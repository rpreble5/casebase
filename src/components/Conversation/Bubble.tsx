import { AnimatePresence, motion } from "motion/react";
import type { SpeakerId } from "../../types/case";
import { SPEAKERS } from "../../data/speakers";
import { Avatar } from "../ui/Avatar";
import { useRun } from "../../state/runStore";
import { renderLine } from "../../data/interpolate";

/**
 * One speech bubble.
 *
 * Shared between the transcript and the active question, so the thing you're
 * being asked looks identical to everything else that's been said — the options
 * below it are what's different, not the bubble.
 */
export function Bubble({
  speaker,
  paras,
  leads,
  typing = false,
  animate = true,
}: {
  speaker: SpeakerId;
  paras: string[];
  leads: boolean;
  typing?: boolean;
  animate?: boolean;
}) {
  const sp = SPEAKERS[speaker];
  const caseData = useRun((s) => s.caseData);
  const revealedDraws = useRun((s) => s.revealedDraws);
  return (
    <motion.div
      className={`convo__row ${leads ? "convo__row--leads" : ""}`}
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.34, 1.4, 0.5, 1] }}
    >
      <div className="convo__gutter">{leads && <Avatar id={speaker} />}</div>
      <div className="convo__body">
        {leads && (
          <div className="convo__who">
            <b>{sp.name}</b>
            {sp.role && <em>{sp.role}</em>}
          </div>
        )}
        {/* `layout` animates the border growing to meet each new paragraph. */}
        <motion.div
          className="bubble"
          layout
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        >
          <AnimatePresence initial={false}>
            {paras.map((p, i) => (
              <motion.p
                key={i}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26 }}
              >
                {caseData ? renderLine(p, { caseData, revealedDraws }) : p}
              </motion.p>
            ))}
            {typing && (
              <motion.div
                key="dots"
                className="bubble__dots"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dots />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Dots() {
  return (
    <span className="dots">
      <span />
      <span />
      <span />
    </span>
  );
}
