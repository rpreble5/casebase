import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRun, type BubbleItem } from "../../state/runStore";
import { SPEAKERS } from "../../data/speakers";
import { Avatar } from "../ui/Avatar";
import { Stage } from "../beats/InputCard";
import { GradedBlock } from "../beats/GradedBlock";
import "./Conversation.css";

/** Pace of the dialogue. Longer lines get a little more room to land. */
function delayFor(text: string) {
  return Math.min(1100, 420 + text.length * 7);
}

export function Conversation() {
  const feed = useRun((s) => s.feed);
  const pending = useRun((s) => s.pending);
  const phase = useRun((s) => s.phase);
  const ask = useRun((s) => s.activeAsk);
  const tick = useRun((s) => s.tick);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pending.length === 0 && phase !== "playing") return;
    const head = pending[0];
    const wait = head && head.kind !== "note" ? delayFor(head.text) : 260;
    const t = setTimeout(tick, wait);
    return () => clearTimeout(t);
  }, [pending, phase, feed.length, ask, tick]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [feed.length, phase, ask?.paras.length]);

  const typing = pending[0];
  // The dots live at the bottom of the bubble that's still growing, so it reads
  // as someone mid-thought rather than as discrete messages being posted.
  const growing = typing?.kind === "para" && !typing.ask;

  return (
    <div className="convo">
      <div className="convo__scroll">
        <div className="convo__col">
          {feed.map((item) => {
            if (item.type === "answer") {
              return (
                <motion.div
                  key={item.key}
                  className="convo__row convo__row--mine"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.34, 1.4, 0.5, 1] }}
                >
                  <span className="mine">{item.text}</span>
                </motion.div>
              );
            }

            if (item.type === "note") {
              return (
                <motion.div
                  key={item.key}
                  className="convo__note"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>{item.text}</span>
                </motion.div>
              );
            }

            if (item.type === "rep") {
              return (
                <motion.div
                  key={item.key}
                  className="convo__row convo__row--mine"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className={`repmark ${item.delta < 0 ? "repmark--down" : ""}`}>
                    {item.delta > 0 ? "+" : ""}
                    {item.delta} with {SPEAKERS[item.who].name}
                  </span>
                </motion.div>
              );
            }

            if (item.type === "graded") {
              return (
                <div key={item.key} className="convo__wide">
                  <GradedBlock beatId={item.beatId} />
                </div>
              );
            }

            const isLast = feed[feed.length - 1] === item;
            return (
              <Bubble key={item.key} item={item} typing={isLast && growing} />
            );
          })}

          {/* A brand-new speaker's first line gets a standalone indicator, since
              there's no bubble yet for the dots to live inside. */}
          <AnimatePresence>
            {typing?.kind === "bubble" && !typing.ask && (
              <motion.div
                key="typing"
                className="convo__row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="convo__gutter" />
                <div className="convo__body">
                  <div className="bubble bubble--typing">
                    <Dots />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="convo__wide">
            <Stage />
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

function Bubble({ item, typing }: { item: BubbleItem; typing: boolean }) {
  const sp = SPEAKERS[item.speaker];
  return (
    <motion.div
      className={`convo__row ${item.leads ? "convo__row--leads" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.34, 1.4, 0.5, 1] }}
    >
      <div className="convo__gutter">{item.leads && <Avatar id={item.speaker} />}</div>
      <div className="convo__body">
        {item.leads && (
          <div className="convo__who">
            <b>{sp.name}</b>
            {sp.role && <em>{sp.role}</em>}
          </div>
        )}
        {/* `layout` animates the border growing to meet each new paragraph. */}
        <motion.div className="bubble" layout transition={{ type: "spring", stiffness: 420, damping: 34 }}>
          <AnimatePresence initial={false}>
            {item.paras.map((p, i) => (
              <motion.p
                key={i}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26 }}
              >
                {p}
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

function Dots() {
  return (
    <span className="dots">
      <span />
      <span />
      <span />
    </span>
  );
}
