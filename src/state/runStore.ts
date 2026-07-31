import { create } from "zustand";
import type {
  Beat,
  MedicalCase,
  PickCost,
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

export type FeedItem =
  | { key: string; type: "bubble"; speaker: SpeakerId; text: string; leads: boolean }
  | { key: string; type: "answer"; text: string }
  | { key: string; type: "note"; text: string }
  | { key: string; type: "rep"; who: SpeakerId; delta: number };

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
  /** Which single choice was taken, on mcq / confirm follow-ups. */
  picked?: string;
  /** Right action, wrong reason — only meaningful on a beat that `pairs` another. */
  wrongReason?: boolean;
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
  pending: FeedItem[];
  phase: Phase;
  answers: Record<string, AnswerRecord>;
  reputation: Record<string, number>;
  revealedDraws: number;
  orders: string[];
  wager: WagerLevel | null;
  /** Held between the confirm answer and its follow-up. */
  confirmChoice: "affirm" | "deny" | null;
  beatStartedAt: number;
  lastRight: boolean | null;

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
  | { kind: "set"; ids: string[] }
  | { kind: "value"; value: number; label: string };

let seq = 0;
const key = () => `f${seq++}`;

const SAVE_KEY = "casebase:run";

function bubbles(beat: { speaker: SpeakerId; say: string[] }, feedTail?: FeedItem): FeedItem[] {
  const prev = feedTail && feedTail.type === "bubble" ? feedTail.speaker : null;
  return beat.say.map((text, i) => ({
    key: key(),
    type: "bubble" as const,
    speaker: beat.speaker,
    text,
    // Avatar shows only when the speaker changes. Four lines from Okafor is one
    // avatar and three bare bubbles, which makes an interruption land hard.
    leads: i === 0 && beat.speaker !== prev,
  }));
}

function emptyRep(): Record<string, number> {
  return Object.fromEntries(RATED_SPEAKERS.map((s) => [s, 0]));
}

export const useRun = create<RunState>((set, get) => ({
  caseData: null,
  cursor: 0,
  feed: [],
  pending: [],
  phase: "playing",
  answers: {},
  reputation: emptyRep(),
  revealedDraws: 0,
  orders: [],
  wager: null,
  confirmChoice: null,
  beatStartedAt: Date.now(),
  lastRight: null,

  begin: (c, opts) => {
    const saved = opts?.fresh ? null : adapter.load<Partial<RunState>>(SAVE_KEY);
    if (saved && saved.caseData === undefined && (saved as { caseId?: string }).caseId === c.id) {
      // Resume: the feed and cursor are restored, the case body is not persisted.
      set({
        caseData: c,
        cursor: saved.cursor ?? 0,
        feed: saved.feed ?? [],
        pending: [],
        phase: "playing",
        answers: saved.answers ?? {},
        reputation: { ...emptyRep(), ...(saved.reputation ?? {}) },
        revealedDraws: saved.revealedDraws ?? 0,
        orders: saved.orders ?? [],
        wager: null,
        confirmChoice: null,
        beatStartedAt: Date.now(),
        lastRight: null,
      });
    } else {
      set({
        caseData: c,
        cursor: 0,
        feed: [],
        pending: [],
        phase: "playing",
        answers: {},
        reputation: emptyRep(),
        revealedDraws: 0,
        orders: [],
        wager: null,
        confirmChoice: null,
        beatStartedAt: Date.now(),
        lastRight: null,
      });
    }
    get().pump();
  },

  /** Moves one queued line into the visible feed. Drives the conversational pace. */
  tick: () => {
    const { pending, feed, phase } = get();
    if (pending.length > 0) {
      const [head, ...rest] = pending;
      if (head.type === "bubble") play("bubble");
      set({ feed: [...feed, head], pending: rest });
      return;
    }
    if (phase === "playing") get().pump();
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
    const tail = st.feed[st.feed.length - 1];

    if (beat.kind === "say") {
      set({ pending: bubbles(beat, tail), cursor: st.cursor + 1, phase: "playing" });
      return;
    }

    if (beat.kind === "labs") {
      play("resultsIn");
      const lines: FeedItem[] =
        beat.speaker === "system"
          ? beat.say.map((t) => ({ key: key(), type: "note" as const, text: t }))
          : bubbles({ speaker: beat.speaker, say: beat.say }, tail);
      set({
        pending: lines,
        cursor: st.cursor + 1,
        phase: "playing",
        revealedDraws: Math.max(st.revealedDraws, beat.draw + 1),
      });
      return;
    }

    // A question: say the setup, then wait.
    const setup = bubbles(beat, tail);
    if (beat.wager) {
      // The wager is always Okafor's line, whoever asked the question. It doubles
      // as the difficulty cue — when he asks whether you know it, you're in deep
      // water, and no "HARD" badge is needed.
      setup.push({
        key: key(),
        type: "bubble",
        speaker: "okafor",
        text: "Hm. Good question, actually. — You know this one?",
        leads: beat.speaker !== "okafor",
      });
    }
    set({
      pending: setup,
      phase: beat.wager ? "wager" : "input",
      wager: null,
      confirmChoice: null,
      beatStartedAt: Date.now(),
    });
  },

  setWager: (w) => {
    play("wager");
    const st = get();
    const label =
      w === "sure" ? "I've got this" : w === "think" ? "I think so" : "Not sure";
    set({
      wager: w,
      phase: "input",
      feed: [...st.feed, { key: key(), type: "answer", text: label }],
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
    const label = choice === "affirm" ? beat.affirmLabel : beat.denyLabel;
    set({
      confirmChoice: choice,
      phase: "followUp",
      feed: [...st.feed, { key: key(), type: "answer", text: label }],
      pending: [
        {
          key: key(),
          type: "bubble",
          speaker: beat.speaker,
          text: beat.followUp.prompt,
          leads: false,
        },
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
    if (st.wager) {
      delta = WAGER_TABLE[st.wager][outcome.right ? "right" : "wrong"];
    } else if (outcome.right) {
      delta = beat.rep.points;
    }
    if (delta !== 0) rep[who] = (rep[who] ?? 0) + delta;

    play(outcome.right ? "right" : "wrong");
    if (outcome.right && beat.speaker === "ezra") play("ezraDeflates");

    const answerLine = payloadLabel(payload);
    const feed: FeedItem[] = [...st.feed];
    if (answerLine) feed.push({ key: key(), type: "answer", text: answerLine });
    if (delta !== 0) feed.push({ key: key(), type: "rep", who, delta });

    const record_: AnswerRecord = {
      beatId: beat.id,
      right: outcome.right,
      wager: st.wager ?? undefined,
      hits: outcome.hits,
      misses: outcome.misses,
      wrongAdds: outcome.wrongAdds,
      harmful: outcome.harmful,
      picked: payload.kind === "choice" ? payload.id : undefined,
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
      answers: { ...st.answers, [beat.id]: record_ },
      reputation: rep,
      orders,
      phase: "reveal",
      lastRight: outcome.right,
      pending: bubbles(
        { speaker: beat.speaker, say: outcome.right ? beat.onRight : beat.onWrong },
        feed[feed.length - 1]
      ),
    });
    persist(get());
  },

  next: () => {
    const st = get();
    set({
      cursor: st.cursor + 1,
      phase: "playing",
      wager: null,
      confirmChoice: null,
      lastRight: null,
    });
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
    feed: st.feed,
    answers: st.answers,
    reputation: st.reputation,
    revealedDraws: st.revealedDraws,
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
      const correct = beat.correct;
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

function payloadLabel(p: AnswerPayload): string | null {
  if (p.kind === "choice") return p.label;
  if (p.kind === "value") return p.label;
  if (p.kind === "set") return p.ids.length === 0 ? "Nothing" : `${p.ids.length} selected`;
  return null;
}

function optionCount(beat: Beat): number | undefined {
  if (beat.kind === "mcq") return beat.choices.length;
  if (beat.kind === "selectAll") return beat.choices.length;
  if (beat.kind === "picker") return beat.show.length;
  if (beat.kind === "confirm") return beat.followUp.choices.length;
  return undefined;
}

function correctCount(beat: Beat): number | undefined {
  if (beat.kind === "selectAll" || beat.kind === "picker") return beat.correct.length;
  if (beat.kind === "mcq" || beat.kind === "confirm") return 1;
  return undefined;
}
