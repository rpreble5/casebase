import { useState } from "react";
import { motion } from "motion/react";
import { useRun } from "../../state/runStore";
import type { MedAction, MedRecBeat } from "../../types/case";
import { play } from "../../audio/sounds";
import "./MedRec.css";

const ACTIONS: { id: MedAction; label: string }[] = [
  { id: "continue", label: "Continue" },
  { id: "hold", label: "Hold" },
  { id: "stop", label: "Stop" },
];

/**
 * The home medication list.
 *
 * Three states rather than two, because hold and stop are different decisions
 * with different failure modes — a held anticoagulant that nobody restarts, or
 * a "stopped" NSAID the patient picks up again at home.
 *
 * Nothing is marked right or wrong here. The consequences arrive later in the
 * conversation instead, which is closer to how these calls actually feel than a
 * verdict card would be.
 */
export function MedRecCard({ beat }: { beat: MedRecBeat }) {
  const [picks, setPicks] = useState<Record<string, MedAction>>({});
  const complete = beat.meds.every((m) => picks[m.id]);

  return (
    <>
      <div className="opts">
        <ul className="mr">
          {beat.meds.map((m) => (
            <li key={m.id} className="mr__row">
              <div className="mr__med">
                <b>{m.name}</b>
                <em>{m.reason}</em>
              </div>
              <div className="mr__actions" role="group" aria-label={m.name}>
                {ACTIONS.map((a) => (
                  <button
                    key={a.id}
                    className={`mr__btn mr__btn--${a.id}`}
                    aria-pressed={picks[m.id] === a.id}
                    onClick={() => {
                      play("select");
                      setPicks((p) => ({ ...p, [m.id]: a.id }));
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="opts__commit">
        <span className="ic__count">
          {Object.keys(picks).length} of {beat.meds.length} decided
        </span>
        <button
          className="chunk ic__go"
          disabled={!complete}
          onClick={() => {
            play("commit");
            useRun.getState().answer({ kind: "meds", meds: picks });
          }}
        >
          That's my list
        </button>
      </div>
    </>
  );
}

/** What you settled on, left in the transcript. No marks. */
export function MedRecBlock({ beatId }: { beatId: string }) {
  const caseData = useRun((s) => s.caseData);
  const answer = useRun((s) => s.answers[beatId]);
  const beat = caseData?.beats.find((b) => b.id === beatId);
  if (!beat || beat.kind !== "medrec" || !answer?.meds) return null;

  return (
    <motion.div
      className="mrb"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.34, 1.4, 0.5, 1] }}
    >
      <div className="mrb__head">Admission medication orders</div>
      <ul>
        {beat.meds.map((m) => {
          const a = answer.meds![m.id];
          return (
            <li key={m.id}>
              <span className={`mrb__tag mrb__tag--${a}`}>
                {a === "continue" ? "Continued" : a === "hold" ? "Held" : "Stopped"}
              </span>
              <span className="mrb__name">{m.name}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
