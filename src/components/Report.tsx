import { motion } from "motion/react";
import { useRun } from "../state/runStore";
import { SPEAKERS, RATED_SPEAKERS } from "../data/speakers";
import { isQuestion, type Domain, type SpeakerId } from "../types/case";
import { Avatar } from "./ui/Avatar";
import { CrossIcon } from "./ui/Icon";
import { play } from "../audio/sounds";
import "./Report.css";

/**
 * End of case.
 *
 * Reputation is the headline because a percentage tells a resident nothing they
 * want to know — how the shift went with each person does. The real learning
 * artifact sits underneath it: performance by domain, calibration, and the
 * right-call-wrong-reason list, which is the most useful thing here and the one
 * thing a question bank structurally cannot produce.
 *
 * Standings are qualitative on purpose. "Okafor trusts you with the next one" is
 * something you remember; 84% is not.
 */
const STANDINGS: Record<SpeakerId, [string, string, string, string]> = {
  okafor: [
    "Trusts you with the next one",
    "Would let you run it again",
    "Kept a close eye on you",
    "Stayed at the bedside all night",
  ],
  ezra: [
    "Has stopped raising his hand",
    "Is quietly rechecking his notes",
    "Got a few past you",
    "Is very pleased with himself",
  ],
  dani: [
    "Pages you first",
    "Runs your orders without asking twice",
    "Double-checked a few things",
    "Held your orders until she was sure",
  ],
  pharmacy: [
    "Releases your orders without calling",
    "Calls you less than most",
    "Verified everything twice",
    "Wants a second signature",
  ],
  marisol: [
    "Understood what happened to her",
    "Felt looked after",
    "Was left with questions",
    "Still doesn't know what happened",
  ],
  ray: [
    "Knows exactly what happened and why",
    "Understood the important part",
    "Is still worried about the blood thinner",
    "Is going home frightened of the wrong drug",
  ],
  gi: [
    "Will take your next call first",
    "Found you easy to work with",
    "Had to drag it out of you",
    "Is going to mention this handover to someone",
  ],
  eileen: [
    "Got her crossword back",
    "Came round and stayed round",
    "Is still confused about what happened",
    "Went home not knowing why she was here",
  ],
  nadia: [
    "Stopped blaming herself",
    "Understood what happened to her mother",
    "Is still turning it over",
    "Left believing it was her fault",
  ],
  harold: [
    "Understood exactly what he needs to watch for",
    "Left with a plan he'll actually follow",
    "Is still fuzzy on what changed",
    "Went home without a real plan",
  ],
  denise: [
    "Feels confident she'd catch it early next time",
    "Understood what happened",
    "Is still worried and unsure what to watch for",
    "Left without answers",
  ],
  sen: [
    "Would hand you the next admission",
    "Trusts your working plan",
    "Kept checking the orders",
    "Took over the bedside",
  ],
  chen: [
    "Handed over a clear working plan",
    "Trusted the admission",
    "Needed to clarify the handoff",
    "Had to repeat the essentials",
  ],
  maya: [
    "Trusts your respiratory plan",
    "Needed only one clarification",
    "Had to retitrate the plan",
    "Called for backup early",
  ],
  ibarra: [
    "Got the answer before asking",
    "Found the consult focused",
    "Had to reconstruct the trend",
    "Could not find the clinical question",
  ],
  leon: [
    "Went home knowing what to watch for",
    "Understood the important changes",
    "Still has unanswered questions",
    "Went home without a usable plan",
  ],
  tasha: [
    "Knows exactly when to call",
    "Feels ready to help",
    "Is unsure what worsening looks like",
    "Left without clear instructions",
  ],
  system: ["", "", "", ""],
};

const DOMAIN_LABEL: Record<Domain, string> = {
  pathophys: "Pathophysiology",
  diagnosis: "Diagnosis",
  treatment: "Treatment",
  guidelines: "Guidelines",
  complications: "Complications",
  communication: "Communication",
};

function standing(earned: number, max: number) {
  if (max <= 0) return 3;
  const f = earned / max;
  if (f >= 0.85) return 0;
  if (f >= 0.6) return 1;
  if (f >= 0.3) return 2;
  return 3;
}

export function Report() {
  const caseData = useRun((s) => s.caseData);
  const answers = useRun((s) => s.answers);
  const reputation = useRun((s) => s.reputation);
  const reset = useRun((s) => s.reset);
  if (!caseData) return null;

  const questions = caseData.beats.filter(isQuestion);

  // Max is what a wagered beat pays at full stake, not its base points.
  const maxFor = (who: SpeakerId) =>
    questions
      .filter((b) => b.rep.who === who)
      .reduce((sum, b) => sum + (b.wager ? 3 : b.rep.points), 0);

  const domains = new Map<Domain, { right: number; total: number }>();
  for (const b of questions) {
    const a = answers[b.id];
    if (!a) continue;
    const d = domains.get(b.domain) ?? { right: 0, total: 0 };
    d.total += 1;
    if (a.right) d.right += 1;
    domains.set(b.domain, d);
  }

  const wrongReasons = questions.filter((b) => answers[b.id]?.wrongReason);

  // The medication beat deliberately gives no feedback in the moment, so this is
  // the first time the resident sees how those calls landed.
  const medBeats = questions.filter((b) => b.kind === "medrec" && answers[b.id]?.meds);

  const staked = questions
    .map((b) => answers[b.id])
    .filter((a) => a?.wager === "sure");
  const stakedRight = staked.filter((a) => a!.right).length;

  const missedBonus = questions.filter((b) => b.tier === "bonus" && !answers[b.id]).length;

  return (
    <motion.div
      className="report"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.34, 1.4, 0.5, 1] }}
    >
      <header className="report__head">
        <em>End of shift</em>
        <h2>{caseData.title}</h2>
      </header>

      <section className="report__standings">
        {RATED_SPEAKERS.filter((id) => maxFor(id) > 0).map((id, i) => {
          const earned = reputation[id] ?? 0;
          const max = maxFor(id);
          const tier = standing(earned, max);
          return (
            <motion.div
              key={id}
              className="stand"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.09, duration: 0.36 }}
            >
              <Avatar id={id} size={44} />
              <div className="stand__body">
                <b>{SPEAKERS[id].name}</b>
                <span>{STANDINGS[id][tier]}</span>
              </div>
              <span className="stand__score">
                {earned}
                <em>/{max}</em>
              </span>
            </motion.div>
          );
        })}
      </section>

      {/* Charm on top, substance underneath. */}
      <section className="report__block">
        <h3>Where you were strong</h3>
        <ul className="bars">
          {[...domains.entries()].map(([d, v]) => (
            <li key={d}>
              <span className="bars__label">{DOMAIN_LABEL[d]}</span>
              <span className="bars__track">
                <motion.span
                  className="bars__fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(v.right / v.total) * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                />
              </span>
              <span className="bars__n">
                {v.right}/{v.total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {medBeats.map((b) => {
        if (b.kind !== "medrec") return null;
        const chosen = answers[b.id].meds!;
        const wrong = b.meds.filter((m) => chosen[m.id] !== m.correct);
        return (
          <section className="report__block" key={b.id}>
            <h3>The medication list</h3>
            <p className="report__note">
              {wrong.length === 0
                ? "Every call matched. That list was the diagnosis, and you read it correctly."
                : "You weren't told at the time, on purpose. Here's how those calls landed."}
            </p>
            {wrong.length > 0 && (
              <ul className="wr">
                {wrong.map((m) => (
                  <li key={m.id}>
                    <CrossIcon size={15} />
                    <span>
                      <b>{m.name}</b> — you{" "}
                      {chosen[m.id] === "continue"
                        ? "continued"
                        : chosen[m.id] === "hold"
                          ? "held"
                          : "stopped"}{" "}
                      it; it should have been{" "}
                      {m.correct === "continue" ? "continued" : m.correct === "hold" ? "held" : "stopped"}.
                      {m.why ? ` ${m.why}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      {wrongReasons.length > 0 && (
        <section className="report__block">
          <h3>Right call, wrong reason</h3>
          <p className="report__note">
            You made the right decision and explained it incorrectly. This is the most useful list on
            this page — it's the gap between following a protocol and understanding one.
          </p>
          <ul className="wr">
            {wrongReasons.map((b) => {
              // The last entry is the ask itself — the setup line identifies nothing.
              const last = b.say[b.say.length - 1];
              const text = typeof last === "string" ? last : last[last.length - 1];
              return (
                <li key={b.id}>
                  <CrossIcon size={15} />
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {staked.length > 0 && (
        <section className="report__block">
          <h3>Calibration</h3>
          <p className="report__big">
            You said <b>“I've got this”</b> {staked.length} time{staked.length === 1 ? "" : "s"} and
            were right {stakedRight}.
          </p>
          <p className="report__note">
            {stakedRight === staked.length
              ? "Confidence matched knowledge. That's the whole skill."
              : stakedRight >= staked.length / 2
                ? "Reasonably calibrated. The misses are worth revisiting — being sure and wrong is the dangerous combination."
                : "Your confidence is running ahead of your knowledge. In a simulator that costs points; on a ward it's the reason people don't call for help."}
          </p>
        </section>
      )}

      <footer className="report__foot">
        {missedBonus > 0 && (
          <span className="report__skipped">
            {missedBonus} bonus question{missedBonus === 1 ? "" : "s"} not reached
          </span>
        )}
        <button
          className="chunk ic__go"
          onClick={() => {
            play("tap");
            reset();
          }}
        >
          Run it again
        </button>
      </footer>
    </motion.div>
  );
}
