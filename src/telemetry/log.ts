/**
 * Play telemetry.
 *
 * Picker size is an open question we agreed to settle with data rather than
 * opinion, so every answered beat records what was on screen, what was picked,
 * what was missed, and how long it took. Buffered locally now; ships somewhere
 * real once there's a backend.
 */

import { adapter } from "../state/persistence";

export interface BeatEvent {
  caseId: string;
  beatId: string;
  kind: string;
  tier: string;
  domain: string;
  /** How many options were on screen. The number we're actually trying to tune. */
  optionCount?: number;
  correctCount?: number;
  msElapsed: number;
  wager?: string;
  right: boolean;
  picked?: string[];
  missed?: string[];
  wrongAdds?: string[];
  at: number;
}

const KEY = "casebase:telemetry";
const MAX = 2000;

export function record(event: BeatEvent) {
  const existing = adapter.load<BeatEvent[]>(KEY) ?? [];
  existing.push(event);
  adapter.save(KEY, existing.slice(-MAX));
}

export function readAll(): BeatEvent[] {
  return adapter.load<BeatEvent[]>(KEY) ?? [];
}

export function clearAll() {
  adapter.clear(KEY);
}

/** Exposed on window so play data can be pulled during testing without a backend. */
export function installDevHook() {
  (window as unknown as Record<string, unknown>).casebaseTelemetry = { readAll, clearAll };
}
