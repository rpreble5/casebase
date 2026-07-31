import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRun } from "../../state/runStore";
import type { Beat, PickerBeat, SelectAllBeat } from "../../types/case";
import { catalogItem } from "../../data/orderCatalog";
import { Avatar } from "../ui/Avatar";
import { Bubble } from "../Conversation/Bubble";
import { CheckIcon, CrossIcon } from "../ui/Icon";
import { MedRecCard } from "./MedRec";
import { GridCard } from "./DirectionGrid";
import { Report } from "../Report";
import { play } from "../../audio/sounds";
import "./InputCard.css";

const pop = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.34, ease: [0.34, 1.4, 0.5, 1] as const },
};

/**
 * The active question.
 *
 * No container of its own. The ask renders as an ordinary speech bubble at the
 * prose measure, and the options sit below it borderless and full width — so
 * they read as controls rather than as one enormous card, and they can spread
 * as wide as the space allows. Width is what makes everything fit on screen
 * together; there's no internal scrolling to hide anything.
 */
export function Stage() {
  const phase = useRun((s) => s.phase);
  const caseData = useRun((s) => s.caseData);
  const cursor = useRun((s) => s.cursor);
  const ask = useRun((s) => s.activeAsk);

  if (!caseData) return null;
  if (phase === "done") return <Report />;
  if (phase === "reveal") return <ContinueBar />;
  if (phase !== "input" && phase !== "wager" && phase !== "followUp") return null;

  const beat = caseData.beats[cursor];
  if (!beat || !ask) return null;

  return (
    <section className="stage">
      <div className="stage__ask">
        <Bubble speaker={ask.speaker} paras={ask.paras} leads={ask.leads} animate={false} />
      </div>
      <motion.div className="stage__input" {...pop}>
        <Input beat={beat} phase={phase} />
      </motion.div>
    </section>
  );
}

function Input({ beat, phase }: { beat: Beat; phase: string }) {
  if (phase === "wager") return <WagerCard />;

  if (phase === "followUp" && beat.kind === "confirm") {
    return (
      <ChoiceCard
        choices={beat.followUp.choices}
        onPick={(id, label) => useRun.getState().answer({ kind: "choice", id, label })}
      />
    );
  }

  switch (beat.kind) {
    case "mcq":
      return (
        <ChoiceCard
          choices={beat.choices}
          onPick={(id, label) => useRun.getState().answer({ kind: "choice", id, label })}
        />
      );
    case "medrec":
      return <MedRecCard beat={beat} />;
    case "grid":
      return <GridCard beat={beat} />;
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
        <div className="opts__row">
          {/* Both read identically on purpose. Making "Hold on" the loud one would
              tell the resident an order is wrong before they've looked at it. */}
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
        </div>
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
    <div className="opts">
      <div className="wager__prompt">
        <Avatar id="okafor" size={26} />
        <span>“You know this one?”</span>
      </div>
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
    </div>
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
    <div className="opts">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Select all — the count is never shown                                */
/* ------------------------------------------------------------------ */

/**
 * Short labels tolerate columns; long ones read badly squeezed. Thresholds are
 * generous because the wide lane gives each column ~440px — a 50-character
 * label still sits on one line there.
 */
function columnsFor(labels: string[]) {
  const longest = labels.reduce((m, l) => Math.max(m, l.length), 0);
  if (longest <= 30) return 3;
  if (longest <= 56) return 2;
  return 1;
}

function SetCard({ beat }: { beat: SelectAllBeat }) {
  const [picked, setPicked] = useState<string[]>([]);
  const cols = useMemo(() => columnsFor(beat.choices.map((c) => c.text)), [beat.choices]);
  const toggle = (id: string) => {
    play(picked.includes(id) ? "deselect" : "select");
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  return (
    <>
      <div className="opts">
        <div className="ic__opts" style={{ "--cols": cols } as React.CSSProperties}>
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
      </div>
      <Commit
        count={picked.length}
        onCommit={() =>
          useRun.getState().answer({
            kind: "set",
            ids: picked,
            shown: beat.choices.map((c) => c.id),
          })
        }
      />
    </>
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
    <>
      <div className="opts">
        {/* Categories flow into columns rather than stacking, so a 22-item list
            is roughly a third the height it used to be. */}
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
      </div>
      <Commit
        count={picked.length}
        label="Place orders"
        onCommit={() =>
          useRun.getState().answer({ kind: "set", ids: picked, shown: beat.show })
        }
      />
    </>
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
    <div className="opts__commit">
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
    <>
      <div className="opts">
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
      </div>
      <div className="opts__commit">
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
    </>
  );
}

function KeypadCard({ beat }: { beat: Extract<Beat, { kind: "keypad" }> }) {
  const [s, setS] = useState("");
  const push = (ch: string) => {
    play("tap");
    setS((p) => (p.length < 6 ? p + ch : p));
  };
  return (
    <>
      <div className="opts opts--pad">
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
          <button
            className="chunk pad__key pad__key--del"
            aria-label="Delete"
            onClick={() => {
              play("tap");
              setS((p) => p.slice(0, -1));
            }}
          >
            <CrossIcon size={20} />
          </button>
        </div>
      </div>
      <div className="opts__commit">
        <span />
        <button
          className="chunk ic__go"
          disabled={s === "" || Number.isNaN(Number(s))}
          onClick={() => {
            play("commit");
            useRun.getState().answer({ kind: "value", value: Number(s), label: s });
          }}
        >
          Answer
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ContinueBar() {
  const next = useRun((s) => s.next);
  return (
    <AnimatePresence>
      <motion.div className="continue" {...pop}>
        <button
          className="chunk ic__go"
          onClick={() => {
            play("tap");
            next();
          }}
        >
          Continue
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
