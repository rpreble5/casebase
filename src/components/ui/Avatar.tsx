import type { SpeakerId } from "../../types/case";
import { SPEAKERS } from "../../data/speakers";
import "./Avatar.css";

/**
 * Faces are pure CSS — a circle, a thick outline, two dots. Adding a character
 * costs nothing, never needs an artist, and can't drift off-model.
 */
export function Avatar({ id, size = 38 }: { id: SpeakerId; size?: number }) {
  const s = SPEAKERS[id];
  return (
    <span
      className={`avatar avatar--${s.face}`}
      style={{ width: size, height: size, background: s.color }}
      aria-hidden="true"
    >
      <span className="avatar__eye avatar__eye--l" />
      <span className="avatar__eye avatar__eye--r" />
    </span>
  );
}
