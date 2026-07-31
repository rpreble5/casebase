import { motion } from "motion/react";
import { useRun, type AnswerRecord } from "../../state/runStore";
import type { Beat, Choice, PickCost } from "../../types/case";
import { catalogItem } from "../../data/orderCatalog";
import { CheckIcon, CrossIcon } from "../ui/Icon";
import "./GradedBlock.css";

/**
 * The record of what you actually did, left in the transcript.
 *
 * Four states, and their visual weight is the whole design:
 *   missed        — the strongest marker on screen; omission is the real failure
 *   wrong add     — a cross, heavier still when the pick was in the harmful tier
 *   got it        — a check
 *   left alone    — collapsed to a count. Correct rejection deserves no fanfare,
 *                   and marking it would bury everything that matters.
 *
 * Explanations attach to the row they're about rather than floating in a
 * detached bullet list, so there's never any doubt which item a sentence means.
 */
type RowState = "hit" | "miss" | "add" | "quiet";

export function GradedBlock({ beatId }: { beatId: string }) {
  const caseData = useRun((s) => s.caseData);
  const answer = useRun((s) => s.answers[beatId]);
  const beat = caseData?.beats.find((b) => b.id === beatId);
  if (!beat || !answer) return null;

  return (
    <motion.div
      className={`gb ${answer.right ? "gb--right" : "gb--wrong"}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.34, 1.4, 0.5, 1] }}
    >
      <Verdict beat={beat} answer={answer} />
      <Body beat={beat} answer={answer} />
    </motion.div>
  );
}

function Verdict({ beat, answer }: { beat: Beat; answer: AnswerRecord }) {
  const label = answer.right
    ? "Right"
    : answer.wrongReason
      ? "Right call, wrong reason"
      : "Not quite";

  const setBeat = beat.kind === "selectAll" || beat.kind === "picker";
  const total = (answer.hits?.length ?? 0) + (answer.misses?.length ?? 0);

  return (
    <div className="gb__head">
      <span className="gb__mark">
        {answer.right ? <CheckIcon size={20} /> : <CrossIcon size={20} />}
      </span>
      <b>{label}</b>
      {setBeat && total > 0 && (
        <span className="gb__tally">
          {answer.hits?.length ?? 0} of {total}
          {answer.harmful?.length ? ` · ${answer.harmful.length} harmful` : ""}
        </span>
      )}
      {answer.wager && <em className="gb__wager">staked: {answer.wager}</em>}
    </div>
  );
}

function Body({ beat, answer }: { beat: Beat; answer: AnswerRecord }) {
  switch (beat.kind) {
    case "selectAll":
      return (
        <RowList
          rows={beat.choices}
          answer={answer}
          why={beat.why}
          cost={beat.cost}
          critical={undefined}
        />
      );

    case "picker":
      return (
        <RowList
          rows={beat.show.map((id) => ({ id, text: catalogItem(id).name }))}
          answer={answer}
          why={beat.why}
          cost={beat.cost}
          critical={beat.critical}
        />
      );

    case "mcq":
      return <ChoiceList choices={beat.choices} correct={beat.correct} answer={answer} why={beat.why} />;

    case "confirm":
      return (
        <>
          <div className="gb__readback">
            <span className={answer.confirmChoice === beat.correct ? "is-hit" : "is-add"}>
              {answer.confirmChoice === beat.correct ? <CheckIcon size={16} /> : <CrossIcon size={16} />}
            </span>
            You chose <b>{answer.confirmChoice === "affirm" ? beat.affirmLabel : beat.denyLabel}</b>
            {answer.confirmChoice !== beat.correct &&
              ` — the order needed to be ${beat.correct === "deny" ? "stopped" : "released"}.`}
          </div>
          <ChoiceList
            choices={beat.followUp.choices}
            correct={beat.followUp.correct}
            answer={answer}
            why={beat.followUp.why}
          />
        </>
      );

    case "slider": {
      const d = beat.decimals ?? 2;
      return (
        <Numeric
          yours={`${(answer.value ?? 0).toFixed(d)} ${beat.unit}`}
          expected={
            beat.accept[0] === beat.accept[1]
              ? `${beat.accept[0].toFixed(d)} ${beat.unit}`
              : `${beat.accept[0].toFixed(d)}–${beat.accept[1].toFixed(d)} ${beat.unit}`
          }
          right={answer.right}
          band={{ min: beat.min, max: beat.max, lo: beat.accept[0], hi: beat.accept[1], at: answer.value ?? 0 }}
        />
      );
    }

    case "keypad":
      return (
        <Numeric
          yours={`${answer.value}${beat.unit ? ` ${beat.unit}` : ""}`}
          expected={`${beat.answer}${beat.unit ? ` ${beat.unit}` : ""}`}
          right={answer.right}
        />
      );

    default:
      return null;
  }
}

function RowList({
  rows,
  answer,
  why,
  cost,
  critical,
}: {
  rows: Choice[];
  answer: AnswerRecord;
  why?: Record<string, string>;
  cost?: Record<string, PickCost>;
  critical?: string[];
}) {
  const hits = new Set(answer.hits ?? []);
  const misses = new Set(answer.misses ?? []);
  const adds = new Set(answer.wrongAdds ?? []);

  const shown = answer.shown ? rows.filter((r) => answer.shown!.includes(r.id)) : rows;
  const graded = shown.filter((r) => hits.has(r.id) || misses.has(r.id) || adds.has(r.id));
  const quietCount = shown.length - graded.length;

  // Misses first — they're the thing worth looking at.
  const order: Record<RowState, number> = { miss: 0, add: 1, hit: 2, quiet: 3 };
  const stateOf = (id: string): RowState =>
    misses.has(id) ? "miss" : adds.has(id) ? "add" : hits.has(id) ? "hit" : "quiet";
  graded.sort((a, b) => order[stateOf(a.id)] - order[stateOf(b.id)]);

  return (
    <>
      <ul className="gb__rows">
        {graded.map((r) => {
          const st = stateOf(r.id);
          const harmful = st === "add" && cost?.[r.id] === "harmful";
          const isCritical = st === "miss" && critical?.includes(r.id);
          return (
            <li key={r.id} className={`gb__row is-${st} ${harmful ? "is-harmful" : ""}`}>
              <span className="gb__icon">
                {st === "hit" ? <CheckIcon size={15} /> : <CrossIcon size={15} />}
              </span>
              <div className="gb__rowbody">
                <span className="gb__label">
                  {r.text}
                  {st === "miss" && <em>{isCritical ? "missed — critical" : "missed"}</em>}
                  {harmful && <em>would have hurt her</em>}
                  {st === "add" && !harmful && <em>not indicated</em>}
                </span>
                {why?.[r.id] && <p className="gb__why">{why[r.id]}</p>}
              </div>
            </li>
          );
        })}
      </ul>
      {quietCount > 0 && (
        <p className="gb__quiet">+{quietCount} others you correctly left alone</p>
      )}
    </>
  );
}

function ChoiceList({
  choices,
  correct,
  answer,
  why,
}: {
  choices: Choice[];
  correct: string;
  answer: AnswerRecord;
  why?: Record<string, string>;
}) {
  return (
    <ul className="gb__rows">
      {choices.map((c) => {
        const picked = answer.picked === c.id;
        const isRight = c.id === correct;
        const st: RowState = isRight ? (picked ? "hit" : "miss") : picked ? "add" : "quiet";
        if (st === "quiet") {
          return (
            <li key={c.id} className="gb__row is-quiet">
              <span className="gb__icon" />
              <div className="gb__rowbody">
                <span className="gb__label">{c.text}</span>
              </div>
            </li>
          );
        }
        return (
          <li key={c.id} className={`gb__row is-${st}`}>
            <span className="gb__icon">
              {st === "hit" ? <CheckIcon size={15} /> : <CrossIcon size={15} />}
            </span>
            <div className="gb__rowbody">
              <span className="gb__label">
                {c.text}
                {st === "miss" && <em>this was it</em>}
                {st === "add" && <em>you chose this</em>}
              </span>
              {/* Explain the road they took, not every road they didn't. */}
              {st === "add" && why?.[c.id] && <p className="gb__why">{why[c.id]}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Numeric({
  yours,
  expected,
  right,
  band,
}: {
  yours: string;
  expected: string;
  right: boolean;
  band?: { min: number; max: number; lo: number; hi: number; at: number };
}) {
  const pct = (v: number) => (band ? ((v - band.min) / (band.max - band.min)) * 100 : 0);
  return (
    <div className="gb__num">
      <div className="gb__nums">
        <span>
          <em>you</em>
          <b className={right ? "is-hit" : "is-add"}>{yours}</b>
        </span>
        <span>
          <em>expected</em>
          <b>{expected}</b>
        </span>
      </div>
      {band && (
        // Seeing how far off you were teaches more than the number alone.
        <div className="gb__track">
          <span
            className="gb__band"
            style={{ left: `${pct(band.lo)}%`, width: `${pct(band.hi) - pct(band.lo)}%` }}
          />
          <span className={`gb__pin ${right ? "is-hit" : "is-add"}`} style={{ left: `${pct(band.at)}%` }} />
        </div>
      )}
    </div>
  );
}
