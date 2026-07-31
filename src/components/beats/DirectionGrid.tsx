import { useState } from "react";
import { useRun } from "../../state/runStore";
import type { Direction, GridBeat } from "../../types/case";
import { TriangleIcon } from "../ui/Icon";
import { play } from "../../audio/sounds";
import "./DirectionGrid.css";

const DIRECTIONS: { id: Direction; label: string }[] = [
  { id: "up", label: "Up" },
  { id: "same", label: "Same" },
  { id: "down", label: "Down" },
];

/**
 * One factor, one row, one of three calls: does it push the subject up, down,
 * or leave it alone. Grading each row independently is the whole point — a
 * resident with three of four relationships right and one backwards has real,
 * partial understanding, which a single compound MCQ can't distinguish from
 * having none of them right.
 */
export function GridCard({ beat }: { beat: GridBeat }) {
  const [picks, setPicks] = useState<Record<string, Direction>>({});
  const complete = beat.rows.every((r) => picks[r.id]);

  return (
    <>
      <div className="opts">
        <p className="grid__subject">{beat.subject}</p>
        <ul className="dg">
          {beat.rows.map((r) => (
            <li key={r.id} className="dg__row">
              <span className="dg__label">{r.label}</span>
              <span className="dg__actions" role="group" aria-label={r.label}>
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.id}
                    className={`dg__btn dg__btn--${d.id}`}
                    aria-pressed={picks[r.id] === d.id}
                    onClick={() => {
                      play("select");
                      setPicks((p) => ({ ...p, [r.id]: d.id }));
                    }}
                  >
                    {d.id === "up" && <TriangleIcon dir="up" size={11} />}
                    {d.id === "down" && <TriangleIcon dir="down" size={11} />}
                    {d.id === "same" && <span className="dg__dash" aria-hidden="true" />}
                    {d.label}
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="opts__commit">
        <span className="ic__count">
          {Object.keys(picks).length} of {beat.rows.length} answered
        </span>
        <button
          className="chunk ic__go"
          disabled={!complete}
          onClick={() => {
            play("commit");
            useRun.getState().answer({ kind: "directions", picks });
          }}
        >
          Lock it in
        </button>
      </div>
    </>
  );
}
