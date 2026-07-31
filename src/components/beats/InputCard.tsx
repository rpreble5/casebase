import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useRun } from "../../state/runStore";
import type { Beat, PickerBeat, SelectAllBeat } from "../../types/case";
import { catalogItem } from "../../data/orderCatalog";
import { CheckIcon, CrossIcon } from "../ui/Icon";
import { play } from "../../audio/sounds";
import "./InputCard.css";

const pop = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.34, ease: [0.34, 1.4, 0.5, 1] as const },
};

export function InputCard() {
  const phase = useRun((s) => s.phase);
  const caseData = useRun((s) => s.caseData);
  const cursor = useRun((s) => s.cursor);

  if (!caseData) return null;
  if (phase === "done") return <DoneCard />;

  const beat = caseData.beats[cursor];
  if (!beat) return null;

  if (phase === "wager") return <WagerCard />;
  if (phase === "reveal") return <RevealCard beat={beat} />;
  if (phase === "followUp" && beat.kind === "confirm") {
    return (
      <ChoiceCard
        choices={beat.followUp.choices}
        onPick={(id, label) => useRun.getState().answer({ kind: "choice", id, label })}
      />
    );
  }
  if (phase !== "input") return null;

  switch (beat.kind) {
    case "mcq":
      return (
        <ChoiceCard
          choices={beat.choices}
          onPick={(id, label) => useRun.getState().answer({ kind: "choice", id, label })}
        />
      );
    case "selectAll":
      return <SetCard beat={beat} />;
    case "picker":
      return <PickerCard beat={beat} />;
    case "slider":
      return <SliderCard beat={beat} />;
    case "keypad":
      return <KeypadCard beat={beat} />;
    case "confirm":
      return (
        <motion.div className="ic ic--row" {...pop}>
          <button
            className="chunk ic__confirm"
            onClick={() => {
              play("tap");
              useRun.getState().answerConfirm("affirm");
            }}
          >
            {beat.affirmLabel}
          </button>
          <button
            className="chunk ic__confirm"
            onClick={() => {
              play("tap");
              useRun.getState().answerConfirm("deny");
            }}
          >
            {beat.denyLabel}
          </button>
        </motion.div>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Wager — staked before the options are revealed                       */
/* ------------------------------------------------------------------ */

function WagerCard() {
  const setWager = useRun((s) => s.setWager);
  return (
    <motion.div className="ic" {...pop}>
      <div className="ic__wagers">
        <button className="chunk wager wager--sure" onClick={() => setWager("sure")}>
          <b>I've got this</b>
          <em>+3 / −3</em>
        </button>
        <button className="chunk wager wager--think" onClick={() => setWager("think")}>
          <b>I think so</b>
          <em>+2 / −1</em>
        </button>
        <button className="chunk wager wager--unsure" onClick={() => setWager("unsure")}>
          <b>Not sure</b>
          <em>+1 / 0</em>
        </button>
      </div>
      <p className="ic__hint">You'll still answer either way — you're only setting the stakes.</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Single choice                                                        */
/* ------------------------------------------------------------------ */

function ChoiceCard({
  choices,
  onPick,
}: {
  choices: { id: string; text: string }[];
  onPick: (id: string, label: string) => void;
}) {
  return (
    <motion.div className="ic" {...pop}>
      <div className="ic__opts">
        {choices.map((c) => (
          <button
            key={c.id}
            className="opt"
            onClick={() => {
              play("commit");
              onPick(c.id, c.text);
            }}
          >
            <span className="opt__dot" />
            <span>{c.text}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Select all — the count is never shown                                */
/* ------------------------------------------------------------------ */

function SetCard({ beat }: { beat: SelectAllBeat }) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (id: string) => {
    play(picked.includes(id) ? "deselect" : "select");
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  return (
    <motion.div className="ic" {...pop}>
      <div className="ic__opts">
        {beat.choices.map((c) => (
          <button
            key={c.id}
            className="opt"
            aria-pressed={picked.includes(c.id)}
            onClick={() => toggle(c.id)}
          >
            <span className="opt__box">
              <CheckIcon />
            </span>
            <span>{c.text}</span>
          </button>
        ))}
      </div>
      <Commit count={picked.length} onCommit={() => useRun.getState().answer({ kind: "set", ids: picked })} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Order entry                                                          */
/* ------------------------------------------------------------------ */

function PickerCard({ beat }: { beat: PickerBeat }) {
  const [picked, setPicked] = useState<string[]>([]);
  const items = useMemo(() => beat.show.map(catalogItem), [beat.show]);

  const groups = useMemo(() => {
    if (!beat.grouped) return [{ name: "", items }];
    const order: string[] = [];
    const map = new Map<string, typeof items>();
    for (const it of items) {
      if (!map.has(it.category)) {
        map.set(it.category, []);
        order.push(it.category);
      }
      map.get(it.category)!.push(it);
    }
    return order.map((name) => ({ name, items: map.get(name)! }));
  }, [items, beat.grouped]);

  const toggle = (id: string) => {
    play(picked.includes(id) ? "deselect" : "select");
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <motion.div className="ic" {...pop}>
      <div className="ic__groups">
        {groups.map((g) => (
          <div key={g.name} className="ic__group">
            {g.name && <h4>{g.name}</h4>}
            <div className="ic__grid">
              {g.items.map((it) => (
                <button
                  key={it.id}
                  className="ord"
                  aria-pressed={picked.includes(it.id)}
                  onClick={() => toggle(it.id)}
                >
                  <span className="opt__box">
                    <CheckIcon size={16} />
                  </span>
                  <span className="ord__name">{it.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Commit
        count={picked.length}
        label="Place orders"
        onCommit={() => useRun.getState().answer({ kind: "set", ids: picked })}
      />
    </motion.div>
  );
}

function Commit({
  count,
  onCommit,
  label = "Lock it in",
}: {
  count: number;
  onCommit: () => void;
  label?: string;
}) {
  return (
    <div className="ic__commit">
      {/* Deliberately never "3 of 5" — knowing the count is a different, easier question. */}
      <span className="ic__count">{count} selected</span>
      <button
        className="chunk ic__go"
        disabled={count === 0}
        onClick={() => {
          play("commit");
          onCommit();
        }}
      >
        {label}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slider — judgment. Keypad — arithmetic.                              */
/* ------------------------------------------------------------------ */

function SliderCard({ beat }: { beat: Extract<Beat, { kind: "slider" }> }) {
  const [v, setV] = useState(beat.start);
  const d = beat.decimals ?? 2;
  const derived = beat.derived ? (v * beat.derived.perUnit).toFixed(beat.derived.decimals) : null;
  return (
    <motion.div className="ic" {...pop}>
      <div className="dial">
        <div className="dial__val">
          {v.toFixed(d)}
          <span>
            {beat.unit}
            {derived && ` · ${derived} ${beat.derived!.label}`}
          </span>
        </div>
        <input
          type="range"
          min={beat.min}
          max={beat.max}
          step={beat.step}
          value={v}
          aria-label={beat.unit}
          onChange={(e) => setV(Number(e.target.value))}
        />
        <div className="dial__ticks">
          <span>{beat.min.toFixed(d)}</span>
          <span>{beat.max.toFixed(d)}</span>
        </div>
      </div>
      <div className="ic__commit">
        <span />
        <button
          className="chunk ic__go"
          onClick={() => {
            play("commit");
            useRun.getState().answer({
              kind: "value",
              value: v,
              label: `${v.toFixed(d)} ${beat.unit}`,
            });
          }}
        >
          Write it
        </button>
      </div>
    </motion.div>
  );
}

function KeypadCard({ beat }: { beat: Extract<Beat, { kind: "keypad" }> }) {
  const [s, setS] = useState("");
  const push = (ch: string) => {
    play("tap");
    setS((p) => (p.length < 6 ? p + ch : p));
  };
  return (
    <motion.div className="ic ic--pad" {...pop}>
      {/* No range shown, no slider: a control that hints at the magnitude would
          leak the answer on an arithmetic question. */}
      <div className="pad__readout">
        {s || <em>—</em>}
        {beat.unit && s && <span>{beat.unit}</span>}
      </div>
      <div className="pad__keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((k) => (
          <button key={k} className="chunk pad__key" onClick={() => push(k)}>
            {k}
          </button>
        ))}
        <button className="chunk pad__key pad__key--del" onClick={() => { play("tap"); setS((p) => p.slice(0, -1)); }}>
          <CrossIcon size={20} />
        </button>
      </div>
      <button
        className="chunk ic__go pad__go"
        disabled={s === "" || Number.isNaN(Number(s))}
        onClick={() => {
          play("commit");
          useRun.getState().answer({ kind: "value", value: Number(s), label: s });
        }}
      >
        Answer
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal                                                               */
/* ------------------------------------------------------------------ */

function RevealCard({ beat }: { beat: Beat }) {
  const answers = useRun((s) => s.answers);
  const next = useRun((s) => s.next);
  if (beat.kind === "say" || beat.kind === "labs") return null;
  const a = answers[beat.id];
  if (!a) return null;

  const why = "why" in beat ? beat.why : undefined;
  const notes: { id: string; text: string; tone: "good" | "bad" }[] = [];

  if (a.misses?.length && why) {
    for (const id of a.misses) if (why[id]) notes.push({ id, text: why[id], tone: "bad" });
  }
  if (a.wrongAdds?.length && why) {
    for (const id of a.wrongAdds) if (why[id]) notes.push({ id, text: why[id], tone: "bad" });
  }
  if (a.right && a.hits?.length && why) {
    for (const id of a.hits) if (why[id]) notes.push({ id, text: why[id], tone: "good" });
  }
  // Explain the specific road they went down — not every road they didn't take.
  if (!a.right && a.picked) {
    const single =
      beat.kind === "mcq" ? beat.why?.[a.picked] : beat.kind === "confirm" ? beat.followUp.why?.[a.picked] : undefined;
    if (single) notes.push({ id: a.picked, text: single, tone: "bad" });
  }

  return (
    <motion.div className={`ic reveal ${a.right ? "reveal--right" : "reveal--wrong"}`} {...pop}>
      <div className="reveal__head">
        <span className="reveal__mark">{a.right ? <CheckIcon size={22} /> : <CrossIcon size={22} />}</span>
        <b>{a.right ? "Right" : a.wrongReason ? "Right call, wrong reason" : "Not quite"}</b>
        {a.wager && <em className="reveal__wager">staked: {a.wager}</em>}
      </div>

      {(a.misses?.length || a.wrongAdds?.length) && (
        <p className="reveal__tally">
          {a.hits?.length ?? 0} of {(a.hits?.length ?? 0) + (a.misses?.length ?? 0)} right
          {a.misses?.length ? `, missed ${a.misses.length}` : ""}
          {a.harmful?.length
            ? `, and ${a.harmful.length} you added would have hurt her`
            : a.wrongAdds?.length
              ? `, ${a.wrongAdds.length} extra`
              : ""}
          .
        </p>
      )}

      {notes.length > 0 && (
        <ul className="reveal__notes">
          {notes.slice(0, 4).map((n) => (
            <li key={n.id} className={n.tone === "good" ? "is-good" : "is-bad"}>
              {n.text}
            </li>
          ))}
        </ul>
      )}

      <button className="chunk ic__go" onClick={() => { play("tap"); next(); }}>
        Continue
      </button>
    </motion.div>
  );
}

function DoneCard() {
  const reset = useRun((s) => s.reset);
  return (
    <motion.div className="ic" {...pop}>
      <div className="ic__ask">End of the slice.</div>
      <p className="ic__hint">
        Beats 14–22 aren't written yet — the dextrose threshold, the gap-versus-glucose beat, the
        transition off the drip, and Ezra's nitroprusside ambush.
      </p>
      <button className="chunk ic__go" onClick={reset}>
        Run it again
      </button>
    </motion.div>
  );
}
