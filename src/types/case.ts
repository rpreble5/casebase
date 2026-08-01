/**
 * The case schema.
 *
 * Two constraints shape this file:
 *
 * 1. Cases are authored by AI and verified by a physician. So every beat is
 *    flat, serializable data — no functions, no logic, nothing that can only be
 *    understood by reading code. A case is reviewable as a document.
 *
 * 2. Cases are on rails. There is no branching. A case is an ordered list of
 *    beats, and every resident sees all of them in the same order. Counterfactuals
 *    are covered by asking about them ("what would you have done if...") rather
 *    than by simulating them.
 */

export type SpeakerId =
  | "okafor" // attending
  | "ezra" // the gunner MS3
  | "dani" // nurse
  | "pharmacy"
  | "marisol" // patient, DKA case
  | "ray" // patient, GI bleed case
  | "gi" // the fellow you have to call at 2am
  | "eileen" // patient, hyponatremia case
  | "nadia" // her daughter
  | "harold" // patient, heart failure case
  | "denise" // his wife
  | "sen" // attending, COPD case
  | "chen" // ED physician, COPD case
  | "maya" // respiratory therapist, COPD case
  | "ibarra" // pulmonology fellow, COPD case
  | "leon" // Walter, patient in COPD case
  | "tasha" // Ruth, his wife in COPD case
  | "system"; // results landing, time passing

/** What the beat is teaching. Drives the end-of-case breakdown. */
export type Domain =
  | "pathophys"
  | "diagnosis"
  | "treatment"
  | "guidelines"
  | "complications"
  | "communication";

/**
 * foundation — med school concepts every resident should hold
 * core       — the management spine of the case
 * bonus      — attending deep cuts and Ezra's ambushes; optional, never subtract
 */
export type Tier = "foundation" | "core" | "bonus";

export type WagerLevel = "sure" | "think" | "unsure";

/**
 * A line of dialogue.
 *
 * A plain string is one bubble. An array is ALSO one bubble, whose paragraphs
 * arrive one at a time while the box grows to meet them — so a continuous
 * thought costs one border instead of three. Use a new entry when the speaker
 * takes a new breath: a line that should land alone, or the question itself
 * separated from its setup.
 */
export type SayLine = string | string[];

/**
 * What to do with a home medication on admission.
 *
 * The interesting distinction is hold versus stop, not continue versus not.
 * Residents write "hold" on everything and then nobody restarts the
 * anticoagulant — or they pause the NSAID that caused the bleed and the patient
 * resumes it at home. Those are different errors and they need different words.
 */
export type MedAction = "continue" | "hold" | "stop";

/** Reputation is earned per character. Wagered beats scale these. */
export interface RepAward {
  who: SpeakerId;
  points: number;
}

interface BeatBase {
  id: string;
  speaker: SpeakerId;
  tier: Tier;
  domain: Domain;
  /** What this speaker says before the input appears. The last entry is the ask. */
  say: SayLine[];
  /**
   * When true, the attending asks whether you know it and you stake reputation
   * BEFORE the options are revealed. Only legitimate when `say` fully states the
   * question — you cannot fairly bet on something you haven't heard.
   */
  wager?: boolean;
  rep: RepAward;
  /**
   * Analyte ids revealed in the chart once this beat is answered — a value the
   * resident had to calculate, or a test they had to think to order.
   */
  unlocks?: string[];
  /**
   * Id of the action beat this one justifies. When an action is right and its
   * paired "why" is wrong, that's a distinct outcome — right call, wrong reason —
   * and it's the most useful thing the end-of-case report can tell a resident.
   */
  pairs?: string;
  /**
   * No verdict, no score marker, no correction. The beat is recorded and the
   * consequences surface later in the conversation instead. For decisions that
   * shouldn't feel like a quiz.
   */
  quiet?: boolean;
  /** Spoken by `speaker` after you answer. This is the teaching. */
  onRight: SayLine[];
  onWrong: SayLine[];
}

/** A line of dialogue or a beat of narration. No input. */
export interface SayBeat {
  kind: "say";
  id: string;
  speaker: SpeakerId;
  say: SayLine[];
  /**
   * Alternate wording when an earlier medication decision makes it apt.
   *
   * This is the one place a beat's text depends on something the resident did.
   * It is deliberately not a branch: the beat exists either way, in the same
   * position, teaching the same point — only the framing changes. First matching
   * variant wins; `say` is the fallback.
   */
  variants?: { whenMed: string; is: MedAction; say: SayLine[] }[];
}

/** Results land: reveals a lab draw into the chart and announces it. */
export interface LabsBeat {
  kind: "labs";
  id: string;
  /** Index into the case's lab draws. */
  draw: number;
  say: SayLine[];
  speaker: SpeakerId;
}

export interface Choice {
  id: string;
  text: string;
}

/**
 * The home medication list, shown in the conversation rather than the chart,
 * because on admission it is a decision and not a reference.
 */
export interface MedRecBeat extends BeatBase {
  kind: "medrec";
  meds: {
    id: string;
    /** As written on the bottle. */
    name: string;
    /** Why they're on it — usually what makes the call hard. */
    reason: string;
    correct: MedAction;
    /** Choices that are actively dangerous in this situation. */
    harmful?: MedAction[];
    why?: string;
  }[];
}

export interface McqBeat extends BeatBase {
  kind: "mcq";
  choices: Choice[];
  correct: string;
  /** Why each wrong choice is wrong, keyed by choice id. Shown on the reveal. */
  why?: Record<string, string>;
}

/**
 * Cost tiers for a wrong pick. Distractor quality matters more than list length:
 *   wasteful   — redundant, costs stewardship only
 *   defensible — reasonable people differ, costs nothing
 *   harmful    — actively dangerous, stings
 */
export type PickCost = "wasteful" | "defensible" | "harmful";

export interface SelectAllBeat extends BeatBase {
  kind: "selectAll";
  choices: Choice[];
  correct: string[];
  /** Wrong choices default to "defensible" when unlisted. */
  cost?: Record<string, PickCost>;
  why?: Record<string, string>;
}

/**
 * Order entry against the shared catalog. The case declares which catalog items
 * are on screen and how each scores; it never invents order names, so the
 * physician reviewing it is checking clinical judgment rather than proofreading.
 *
 * Size is per-beat with no house minimum — a focused "what's your next move"
 * beat gets ~12, a "what's your whole workup" beat gets more. Deliberately a
 * knob so we can settle it with play data rather than opinion.
 */
export interface PickerBeat extends BeatBase {
  kind: "picker";
  /** Catalog ids shown, in display order. */
  show: string[];
  correct: string[];
  cost?: Record<string, PickCost>;
  /** Missing one of these is weighted heavily — omission is the real test. */
  critical?: string[];
  why?: Record<string, string>;
  /** Group under category headers. Fragments short lists; use above ~20 items. */
  grouped?: boolean;
}

/** Slider — for judgment, where the answer is a defensible range. */
export interface SliderBeat extends BeatBase {
  kind: "slider";
  min: number;
  max: number;
  step: number;
  start: number;
  /** Inclusive band that counts as right. */
  accept: [number, number];
  unit: string;
  /** e.g. 2 for 0.10 */
  decimals?: number;
  /** Derived readout, e.g. weight-based dose. `{v}` is the slider value. */
  derived?: { label: string; perUnit: number; decimals: number };
}

/** Keypad — for arithmetic. Range is hidden so the control can't leak the answer. */
export interface KeypadBeat extends BeatBase {
  kind: "keypad";
  answer: number;
  tolerance?: number;
  unit?: string;
}

export type Direction = "up" | "down" | "same";

/**
 * A grid of factors, each graded on whether it pushes some value up, down, or
 * leaves it alone.
 *
 * The shape a single MCQ can't capture: "obesity lowers BNP, renal failure
 * raises it, atrial fibrillation raises it too" is one compound statement in an
 * MCQ, so a resident who has three of four relationships right and one backwards
 * is marked exactly as wrong as someone with none of them. Grading each factor
 * independently is both fairer and more diagnostic of what's actually understood.
 *
 * Include at least one row whose correct answer is "same" — otherwise a
 * resident can shotgun "up" on every row and look competent without having
 * distinguished anything. The "same" row is what makes the others mean something.
 */
export interface GridBeat extends BeatBase {
  kind: "grid";
  /** What's being pushed up, down, or held steady — shown once above the rows. */
  subject: string;
  rows: {
    id: string;
    label: string;
    correct: Direction;
    why?: string;
  }[];
}

/**
 * Agree / push back.
 *
 * Nobody in a case is ever wrong on purpose — but an *order* can be. Pharmacy
 * reads back what's written and you confirm it or stop it, which is how errors
 * actually get caught.
 *
 * The follow-up fires on BOTH paths, so being asked to justify never tells you
 * which way was right.
 */
export interface ConfirmBeat extends BeatBase {
  kind: "confirm";
  affirmLabel: string;
  denyLabel: string;
  correct: "affirm" | "deny";
  /** Asked regardless of which way you went. */
  followUp: {
    prompt: string;
    choices: Choice[];
    correct: string;
    why?: Record<string, string>;
  };
}

export type Beat =
  | SayBeat
  | LabsBeat
  | MedRecBeat
  | McqBeat
  | SelectAllBeat
  | PickerBeat
  | SliderBeat
  | KeypadBeat
  | ConfirmBeat
  | GridBeat;

export type QuestionBeat = Exclude<Beat, SayBeat | LabsBeat>;

export function isQuestion(b: Beat): b is QuestionBeat {
  return b.kind !== "say" && b.kind !== "labs";
}

/* ------------------------------------------------------------------ */
/* Chart data — lives outside the conversation, in its own panel        */
/* ------------------------------------------------------------------ */

export interface LabAnalyte {
  id: string;
  name: string;
  ref: string;
  /** Bounds for the abnormal flag. Omit either side for one-sided ranges. */
  low?: number;
  high?: number;
  decimals?: number;
  /**
   * Not shown in the chart until a beat unlocks it. Two uses: a value the
   * resident is asked to calculate (showing it would hand over the answer), and
   * a test that hasn't been sent yet (showing it would skip the decision to
   * order it).
   */
  hidden?: boolean;
}

export interface LabDraw {
  time: string;
  label?: string;
  values: Record<string, number>;
}

export interface Patient {
  name: string;
  age: number;
  line: string;
  weightKg: number;
  history: string[];
  allergies: string;
  meds: string[];
  social?: string;
}

export interface Vitals {
  time: string;
  hr: number;
  bp: string;
  rr: number;
  temp: string;
  spo2: number;
}

export interface MedicalCase {
  id: string;
  title: string;
  blurb: string;
  patient: Patient;
  vitals: Vitals[];
  analytes: LabAnalyte[];
  draws: LabDraw[];
  beats: Beat[];
}
