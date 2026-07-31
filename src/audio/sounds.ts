/**
 * Sound hooks — named events with no assets yet.
 *
 * Wiring the call sites now means adding audio later is dropping files into
 * `public/sfx/` and filling in this map, rather than hunting through components
 * for the right moments.
 */

export type Sfx =
  | "tap" // any chunky button
  | "select" // toggling an option on
  | "deselect"
  | "commit" // locking in an answer
  | "right"
  | "wrong"
  | "wager" // staking reputation
  | "resultsIn" // labs landing
  | "chartOpen"
  | "bubble" // a new line of dialogue
  | "ezraDeflates"; // beating the gunner

const FILES: Partial<Record<Sfx, string>> = {
  // e.g. tap: "sfx/tap.mp3"
};

let enabled = true;
const cache = new Map<Sfx, HTMLAudioElement>();

export function setSoundEnabled(on: boolean) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

export function play(name: Sfx) {
  if (!enabled) return;
  const file = FILES[name];
  if (!file) return; // placeholder — no asset wired yet
  let el = cache.get(name);
  if (!el) {
    el = new Audio(import.meta.env.BASE_URL + file);
    el.volume = 0.4;
    cache.set(name, el);
  }
  el.currentTime = 0;
  void el.play().catch(() => {
    /* autoplay policy — not worth surfacing */
  });
}
