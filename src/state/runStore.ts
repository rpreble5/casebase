import { create } from "zustand";
import type {
  Beat,
  MedAction,
  MedicalCase,
  PickCost,
  SayLine,
  SpeakerId,
  WagerLevel,
} from "../types/case";
import { isQuestion } from "../types/case";
import { RATED_SPEAKERS } from "../data/speakers";
import { adapter } from "./persistence";
import { record } from "../telemetry/log";
import { play } from "../audio/sounds";

/* ------------------------------------------------------------------ */
/* Feed — the conversation transcript                                   */
/* ------------------------------------------------------------------ */

export interface BubbleItem {
  key: string;
  type: "bubble";
  speaker: SpeakerId;
  /** Paragraphs land one at a time and the box grows to meet them. */
  paras: string[];
  leads: boolean;
}

export type FeedItem =
  | BubbleItem
  | { key: string; type: "answer"; text: string }
  | { key: string; type: "note"; text: string }
  | { key: string; type: "rep"; who: SpeakerId; delta: number }
  /** The graded option list. Stays in the transcript as the record of what you did. */
  | { key: string; type: "graded"; beatId: string }
  /** The medication list you settled on. Recorded, not marked. */
  | { key: string; type: "meds"; beatId: string };

/** One step of the dialogue queue. Consumed by tick() on a timer. */
type PendingOp =
  | { kind: "bubble"; speaker: SpeakerId; text: string; leads: boolean; ask: boolean }
  | { kind: "para"; text: string; ask: boolean }
  | { kind: "note"; text: string };

/**
 * The question currently being asked, held out of the feed so the layout can
 * bound it together with the input and guarantee both stay on screen. Pushed
 * into the transcript once answered.
 */
export interface ActiveAsk {
  speaker: SpeakerId;
  paras: string[];
  /** False when the same voice just spoke — no repeated name header. */
  leads: boolean;
}

/* ------------------------------------------------------------------ */
/* Answers                                                              */
/* ------------------------------------------------------------------ */

export interface AnswerRecord {
  beatId: string;
  right: boolean;
  wager?: WagerLevel;
  /** Set-based beats: what you got, what you missed, what you shouldn't have added. */
  hits?: string[];
  misses?: string[];
  wrongAdds?: string[];
  harmful?: string[];
  /** Everything you were shown, so the graded list can render without re-deriving. */
  shown?: string[];
  /** Which single choice was taken, on mcq / confirm follow-ups. */
  picked?: string;
  /** Numeric beats: what you entered. */
  value?: number;
  /** Which way a read-back went. */
  confirmChoice?: "affirm" | "deny";
  /** Right action, wrong reason — only meaningful on a beat that `pairs` another. */
  wrongReason?: boolean;
  /** Medication reconciliation: what you decided for each drug. */
  meds?: Record<string, MedAction>;
}

/**
 * Reputation.
 *
 * Unwagered beats can only gain — a resident who doesn't know something hasn't
 * lost anything. Wagered beats can lose, because you chose to stake it. Losing a
 * bet you made feels fair in a way that losing points for a gap never does.
 */
const WAGER_TABLE: Record<WagerLevel, { right: number; wrong: number }> = {
  sure: { right: 3, wrong: -3 },
  think: { right: 2, wrong: -1 },
  unsure: { right: 1, wrong: 0 },
};

export type Phase = "playing" | "wager" | "input" | "followUp" | "reveal" | "done";

interface RunState {
  caseData: MedicalCase | null;
  cursor: number;
  feed: FeedItem[];
  pending: PendingOp[];
  activeAsk: ActiveAsk | null;
  phase: Phase;
  answers: Record<string, AnswerRecord>;
  reputation: Record<string, number>;
  revealedDraws: number;
  /** Derived analytes the resident has earned the right to see. */
  unlockedAnalytes: string[];
  /** Home medication decisions, so later beats can react to them. */
  medChoices: Record<string, MedAction>;
  orders: string[];
  wager: WagerLevel | null;
  confirmChoice: "affirm" | "deny" | null;
  beatStartedAt: number;

  begin: (c: MedicalCase, opts?: { fresh?: boolean }) => void;
  tick: () => void;
  pump: () => void;
  setWager: (w: WagerLevel) => void;
  answer: (payload: AnswerPayload) => void;
  answerConfirm: (choice: "affirm" | "deny") => void;
  next: () => void;
  reset: () => void;
}

export type AnswerPayload =
  | { kind: "choice"; id: string; label: string }
  | { kind: "meds"; meds: Record<string, MedAction> }
  | { kind: "set"; ids: string[]; shown: string[] }
  | { kind: "value"; value: number; label: string };

let seq = 0;
const key = () => `f${seq++}`;

const SAVE_KEY = "casebase:run";

/**
 * Turns authored dialogue into queue operations.
 *
 * A string entry opens a bubble. An array entry opens a bubble and then appends
 * its remaining paragraphs to that same bubble, so one continuous thought costs
 * one border instead of three.
 */
function toOps(
  say: SayLine[],
  speaker: SpeakerId,
  prevSpeaker: SpeakerId | null,
  /** Hold the final entry out of the feed as the active ask. */
  lastIsAsk: boolean
): PendingOp[] {
  const ops: PendingOp[] = [];
  say.forEach((entry, i) => {
    const ask = lastIsAsk && i === say.length - 1;
    const paras = typeof entry === "string" ? [entry] : entry;
    ops.push({
      kind: "bubble",
      speaker,
      text: paras[0],
      // Avatar shows only when the speaker changes. Four lines from Okafor is
      // one avatar and three bare bubbles, which makes an interruption land hard.
      leads: i === 0 && speaker !== prevSpeaker,
      ask,
    });
    for (const p of paras.slice(1)) ops.push({ kind: "para", text: p, ask });
  });
  return ops;
}

function lastSpeaker(feed: FeedItem[]): SpeakerId | null {
  for (let i = feed.length - 1; i >= 0; i--) {
    if (feed[i].type === "bubble") return (feed[i] as BubbleItem).speaker;
  }
  return null;
}

function emptyRep(): Record<string, number> {
  return Object.fromEntries(RATED_SPEAKERS.map((s) => [s, 0]));
}

export const useRun = create<RunState>((set, get) => ({
  caseData: null,
  cursor: 0,
  feed: [],
  pending: [],
  activeAsk: null,
  phase: "playing",
  answers: {},
  reputation: emptyRep(),
  revealedDraws: 0,
  unlockedAnalytes: [],
  medChoices: {},
  orders: [],
  wager: null,
  confirmChoice: null,
  beatStartedAt: Date.now(),

  begin: (c) => {
    set({
      caseData: c,
      cursor: 0,
      feed: [],
      pending: [],
      activeAsk: null,
      phase: "playing",
      answers: {},
      reputation: emptyRep(),
      revealedDraws: 0,
      unlockedAnalytes: [],
      medChoices: {},
      orders: [],
      wager: null,
      confirmChoice: null,
      beatStartedAt: Date.now(),
    });
    get().pump();
  },

  /** Moves one queued operation into view. Drives the conversational pace. */
  tick: () => {
    const st = get();
    if (st.pending.length === 0) {
      if (st.phase === "playing") get().pump();
      return;
    }
    const [op, ...rest] = st.pending;

    if (op.kind === "note") {
      set({ feed: [...st.feed, { key: key(), type: "note", text: op.text }], pending: rest });
      return;
    }

    if (op.kind === "bubble") {
      play("bubble");
      if (op.ask) {
        set({
          activeAsk: { speaker: op.speaker, paras: [op.text], leads: op.leads },
          pending: rest,
        });
      } else {
        set({
          feed: [
            ...st.feed,
            { key: key(), type: "bubble", speaker: op.speaker, paras: [op.text], leads: op.leads },
          ],
          pending: rest,
        });
      }
      return;
    }

    // para — grow the bubble it belongs to
    play("bubble");
    if (op.ask && st.activeAsk) {
      set({
        activeAsk: { ...st.activeAsk, paras: [...st.activeAsk.paras, op.text] },
        pending: rest,
      });
      return;
    }
    const feed = [...st.feed];
    for (let i = feed.length - 1; i >= 0; i--) {
      if (feed[i].type === "bubble") {
        const b = feed[i] as BubbleItem;
        feed[i] = { ...b, paras: [...b.paras, op.text] };
        break;
      }
    }
    set({ feed, pending: rest });
  },

  /** Consumes beats until something needs the resident. */
  pump: () => {
    const st = get();
    const c = st.caseData;
    if (!c) return;
    if (st.cursor >= c.beats.length) {
      set({ phase: "done" });
      return;
    }

    const beat = c.beats[st.cursor];
    const prev = lastSpeaker(st.feed);

    if (beat.kind === "say") {
      // A beat may reword itself around an earlier medication decision. Same
      // beat, same position, same teaching point — only the framing moves.
      const variant = beat.variants?.find((v) => st.medChoices[v.whenMed] === v.is);
      set({
        pending: toOps(variant?.say ?? beat.say, beat.speaker, prev, false),
        cursor: st.cursor + 1,
        phase: "playing",
      });
      return;
    }

    if (beat.kind === "labs") {
      play("resultsIn");
      const ops: PendingOp[] =
        beat.speaker === "system"
          ? beat.say.flatMap((e) =>
              (typeof e === "string" ? [e] : e).map((t) => ({ kind: "note" as const, text: t }))
            )
          : toOps(beat.say, beat.speaker, prev, false);
      set({
        pending: ops,
        cursor: st.cursor + 1,
        phase: "playing",
        revealedDraws: Math.max(st.revealedDraws, beat.draw + 1),
      });
      return;
    }

    set({
      pending: toOps(beat.say, beat.speaker, prev, true),
      phase: beat.wager ? "wager" : "input",
      wager: null,
      confirmChoice: null,
      beatStartedAt: Date.now(),
    });
  },

  setWager: (w) => {
    play("wager");
    const label = w === "sure" ? "I've got this" : w === "think" ? "I think so" : "Not sure";
    set({
      wager: w,
      phase: "input",
      feed: [...get().feed, { key: key(), type: "answer", text: label }],
      beatStartedAt: Date.now(),
    });
  },

  answerConfirm: (choice) => {
    const st = get();
    const c = st.caseData;
    if (!c) return;
    const beat = c.beats[st.cursor];
    if (beat.kind !== "confirm") return;
    play("commit");
    const feed = [...st.feed];
    if (st.activeAsk) {
      feed.push({ key: key(), type: "bubble", ...st.activeAsk });
    }
    feed.push({
      key: key(),
      type: "answer",
      text: choice === "affirm" ? beat.affirmLabel : beat.denyLabel,
    });
    set({
      confirmChoice: choice,
      phase: "followUp",
      feed,
      activeAsk: null,
      pending: [
        { kind: "bubble", speaker: beat.speaker, text: beat.followUp.prompt, leads: false, ask: true },
      ],
    });
  },

  answer: (payload) => {
    const st = get();
    const c = st.caseData;
    if (!c) return;
    const beat = c.beats[st.cursor];
    if (!isQuestion(beat)) return;

    const outcome = grade(beat, payload, st.confirmChoice);
    const elapsed = Date.now() - st.beatStartedAt;

    // Right action, wrong reason. The most useful thing the report can tell you.
    let wrongReason = false;
    if (beat.pairs) {
      const paired = st.answers[beat.pairs];
      if (paired?.right && !outcome.right) wrongReason = true;
    }

    const rep = { ...st.reputation };
    const who = beat.rep.who;
    let delta = 0;
    if (st.wager) delta = WAGER_TABLE[st.wager][outcome.right ? "right" : "wrong"];
    else if (outcome.right) delta = beat.rep.points;
    if (delta !== 0) rep[who] = (rep[who] ?? 0) + delta;

    play(outcome.right ? "right" : "wrong");
    if (outcome.right && beat.speaker === "ezra") play("ezraDeflates");

    const feed: FeedItem[] = [...st.feed];
    // The ask rejoins the transcript now that it no longer has to stay pinned.
    if (st.activeAsk) feed.push({ key: key(), type: "bubble", ...st.activeAsk });
    if (beat.quiet) {
      // Recorded, not marked. No verdict and no score chip — otherwise the chip
      // itself tells you whether you were right, which is the thing being avoided.
      feed.push({ key: key(), type: "meds", beatId: beat.id });
    } else {
      feed.push({ key: key(), type: "graded", beatId: beat.id });
      if (delta !== 0) feed.push({ key: key(), type: "rep", who, delta });
    }

    const answerRecord: AnswerRecord = {
      beatId: beat.id,
      right: outcome.right,
      wager: st.wager ?? undefined,
      hits: outcome.hits,
      misses: outcome.misses,
      wrongAdds: outcome.wrongAdds,
      harmful: outcome.harmful,
      shown: payload.kind === "set" ? payload.shown : undefined,
      picked: payload.kind === "choice" ? payload.id : undefined,
      meds: payload.kind === "meds" ? payload.meds : undefined,
      value: payload.kind === "value" ? payload.value : undefined,
      confirmChoice: st.confirmChoice ?? undefined,
      wrongReason,
    };

    const orders =
      beat.kind === "picker" && payload.kind === "set"
        ? Array.from(new Set([...st.orders, ...payload.ids]))
        : st.orders;

    record({
      caseId: c.id,
      beatId: beat.id,
      kind: beat.kind,
      tier: beat.tier,
      domain: beat.domain,
      optionCount: optionCount(beat),
      correctCount: correctCount(beat),
      msElapsed: elapsed,
      wager: st.wager ?? undefined,
      right: outcome.right,
      picked: payload.kind === "set" ? payload.ids : undefined,
      missed: outcome.misses,
      wrongAdds: outcome.wrongAdds,
      at: Date.now(),
    });

    set({
      feed,
      activeAsk: null,
      answers: { ...st.answers, [beat.id]: answerRecord },
      reputation: rep,
      // Unlocked whether or not they got it right — they've been shown the working.
      unlockedAnalytes: beat.unlocks
        ? Array.from(new Set([...st.unlockedAnalytes, ...beat.unlocks]))
        : st.unlockedAnalytes,
      medChoices:
        payload.kind === "meds" ? { ...st.medChoices, ...payload.meds } : st.medChoices,
      orders,
      phase: "reveal",
      pending: toOps(
        beat.quiet || outcome.right ? beat.onRight : beat.onWrong,
        beat.speaker,
        lastSpeaker(feed),
        false
      ),
    });
    persist(get());
  },

  next: () => {
    set({ cursor: get().cursor + 1, phase: "playing", wager: null, confirmChoice: null });
    get().pump();
    persist(get());
  },

  reset: () => {
    adapter.clear(SAVE_KEY);
    const c = get().caseData;
    if (c) get().begin(c, { fresh: true });
  },
}));

function persist(st: RunState) {
  adapter.save(SAVE_KEY, {
    caseId: st.caseData?.id,
    cursor: st.cursor,
    answers: st.answers,
    reputation: st.reputation,
    revealedDraws: st.revealedDraws,
    unlockedAnalytes: st.unlockedAnalytes,
    medChoices: st.medChoices,
    orders: st.orders,
  });
}

/* ------------------------------------------------------------------ */
/* Grading                                                              */
/* ------------------------------------------------------------------ */

interface Outcome {
  right: boolean;
  hits?: string[];
  misses?: string[];
  wrongAdds?: string[];
  harmful?: string[];
}

function grade(
  beat: Beat,
  payload: AnswerPayload,
  confirmChoice: "affirm" | "deny" | null
): Outcome {
  switch (beat.kind) {
    case "mcq":
      return { right: payload.kind === "choice" && payload.id === beat.correct };

    case "confirm": {
      // Both the read-back call and its justification have to be right. Getting
      // the follow-up right after confirming a bad order isn't a save.
      const followRight = payload.kind === "choice" && payload.id === beat.followUp.correct;
      return { right: followRight && confirmChoice === beat.correct };
    }

    case "selectAll":
    case "picker": {
      if (payload.kind !== "set") return { right: false };
      const { correct } = beat;
      const picked = payload.ids;
      const hits = correct.filter((id) => picked.includes(id));
      const misses = correct.filter((id) => !picked.includes(id));
      const wrongAdds = picked.filter((id) => !correct.includes(id));
      const cost = (beat.cost ?? {}) as Record<string, PickCost>;
      const harmful = wrongAdds.filter((id) => cost[id] === "harmful");
      // Omission is the real test, so any miss fails — as does anything harmful.
      // "Defensible" additions cost nothing; reasonable people differ.
      return { right: misses.length === 0 && harmful.length === 0, hits, misses, wrongAdds, harmful };
    }

    case "medrec": {
      if (payload.kind !== "meds") return { right: false };
      const hits = beat.meds.filter((m) => payload.meds[m.id] === m.correct).map((m) => m.id);
      const misses = beat.meds.filter((m) => payload.meds[m.id] !== m.correct).map((m) => m.id);
      const harmful = beat.meds
        .filter((m) => m.harmful?.includes(payload.meds[m.id]))
        .map((m) => m.id);
      return { right: misses.length === 0, hits, misses, harmful };
    }

    case "slider": {
      if (payload.kind !== "value") return { right: false };
      const [lo, hi] = beat.accept;
      return { right: payload.value >= lo - 1e-9 && payload.value <= hi + 1e-9 };
    }

    case "keypad": {
      if (payload.kind !== "value") return { right: false };
      const tol = beat.tolerance ?? 0;
      return { right: Math.abs(payload.value - beat.answer) <= tol + 1e-9 };
    }

    default:
      return { right: false };
  }
}

function optionCount(beat: Beat): number | undefined {
  if (beat.kind === "medrec") return beat.meds.length;
  if (beat.kind === "mcq" || beat.kind === "selectAll") return beat.choices.length;
  if (beat.kind === "picker") return beat.show.length;
  if (beat.kind === "confirm") return beat.followUp.choices.length;
  return undefined;
}

function correctCount(beat: Beat): number | undefined {
  if (beat.kind === "selectAll" || beat.kind === "picker") return beat.correct.length;
  if (beat.kind === "mcq" || beat.kind === "confirm") return 1;
  return undefined;
}
