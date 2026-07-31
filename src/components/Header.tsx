import { motion } from "motion/react";
import { useRun } from "../state/runStore";
import { SPEAKERS, RATED_SPEAKERS } from "../data/speakers";
import { Avatar } from "./ui/Avatar";
import { SoundIcon } from "./ui/Icon";
import { isSoundEnabled, setSoundEnabled, play } from "../audio/sounds";
import { useState } from "react";
import "./Header.css";

/**
 * Reputation, not a score. A percentage tells a resident nothing they want to
 * know; how the shift went with each person does. Only characters you've
 * actually met appear.
 */
export function Header({ onToggleChart }: { onToggleChart: () => void }) {
  const title = useRun((s) => s.caseData?.title ?? "");
  const rep = useRun((s) => s.reputation);
  const feed = useRun((s) => s.feed);
  const reset = useRun((s) => s.reset);
  const [sound, setSound] = useState(isSoundEnabled());

  const met = new Set(
    feed.filter((f) => f.type === "bubble").map((f) => (f as { speaker: string }).speaker)
  );

  return (
    <header className="hd">
      <div className="hd__title">
        <b>{title}</b>
        {/* Build stamp: hover to see when it was deployed. Removes any doubt
            about whether you're looking at the newest push or a cached build. */}
        <em title={`built ${new Date(__BUILD_TIME__).toLocaleString()}`}>
          DKA · vertical slice · {__BUILD_SHA__}
        </em>
      </div>

      <div className="hd__rep">
        {RATED_SPEAKERS.filter((id) => met.has(id)).map((id) => (
          <motion.div
            key={id}
            className="repchip"
            layout
            title={`${SPEAKERS[id].name} — ${SPEAKERS[id].role}`}
          >
            <Avatar id={id} size={26} />
            <motion.span key={rep[id]} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>
              {rep[id] ?? 0}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="hd__tools">
        <button
          className="chunk hd__icon"
          aria-label={sound ? "Mute" : "Unmute"}
          onClick={() => {
            const next = !sound;
            setSound(next);
            setSoundEnabled(next);
            play("tap");
          }}
        >
          <SoundIcon on={sound} />
        </button>
        <button className="chunk hd__restart" onClick={reset}>
          Restart
        </button>
        <button className="chunk hd__chart" onClick={onToggleChart}>
          Chart
        </button>
      </div>
    </header>
  );
}
