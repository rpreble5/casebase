import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRun } from "../../state/runStore";
import { SPEAKERS } from "../../data/speakers";
import { Avatar } from "../ui/Avatar";
import { InputCard } from "../beats/InputCard";
import "./Conversation.css";

/** Pace of the dialogue. Long lines get a little more room to land. */
function delayFor(text: string) {
  return Math.min(1100, 420 + text.length * 7);
}

export function Conversation() {
  const feed = useRun((s) => s.feed);
  const pending = useRun((s) => s.pending);
  const phase = useRun((s) => s.phase);
  const tick = useRun((s) => s.tick);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pending.length === 0 && phase !== "playing") return;
    const head = pending[0];
    const wait = head && head.type === "bubble" ? delayFor(head.text) : 260;
    const t = setTimeout(tick, wait);
    return () => clearTimeout(t);
  }, [pending, phase, feed.length, tick]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [feed.length, phase]);

  const typing = pending[0];

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
              const who = SPEAKERS[item.who];
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
                    {item.delta} with {who.name}
                  </span>
                </motion.div>
              );
            }

            const sp = SPEAKERS[item.speaker];
            return (
              <motion.div
                key={item.key}
                className={`convo__row ${item.leads ? "convo__row--leads" : ""}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.34, 1.4, 0.5, 1] }}
              >
                <div className="convo__gutter">
                  {item.leads && <Avatar id={item.speaker} />}
                </div>
                <div className="convo__body">
                  {item.leads && (
                    <div className="convo__who">
                      <b>{sp.name}</b>
                      {sp.role && <em>{sp.role}</em>}
                    </div>
                  )}
                  <div className="bubble">{item.text}</div>
                </div>
              </motion.div>
            );
          })}

          <AnimatePresence>
            {typing && typing.type === "bubble" && (
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
                    <span /> <span /> <span />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {pending.length === 0 && <InputCard />}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
