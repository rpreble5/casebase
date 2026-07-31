import type { SpeakerId } from "../types/case";

export interface SpeakerDef {
  id: SpeakerId;
  name: string;
  role: string;
  /** CSS custom property driving the avatar fill. */
  color: string;
  /** Faces are pure CSS — a circle, a thick outline, two dots. A new character
   *  costs nothing and never needs an artist. */
  face: "plain" | "glasses" | "cap" | "bangs";
}

export const SPEAKERS: Record<SpeakerId, SpeakerDef> = {
  okafor: { id: "okafor", name: "Dr. Okafor", role: "attending", color: "var(--plum)", face: "plain" },
  ezra: { id: "ezra", name: "Ezra", role: "MS3", color: "var(--gunner)", face: "glasses" },
  dani: { id: "dani", name: "Dani", role: "RN", color: "var(--sage)", face: "cap" },
  pharmacy: { id: "pharmacy", name: "Pharmacy", role: "on the phone", color: "var(--ochre)", face: "plain" },
  marisol: { id: "marisol", name: "Marisol", role: "patient", color: "var(--rose)", face: "bangs" },
  ray: { id: "ray", name: "Ray", role: "patient", color: "var(--rose)", face: "plain" },
  gi: { id: "gi", name: "GI fellow", role: "on the phone", color: "var(--clay)", face: "glasses" },
  system: { id: "system", name: "", role: "", color: "var(--paper-sink)", face: "plain" },
};

/** Everyone who can hold a reputation meter. */
export const RATED_SPEAKERS: SpeakerId[] = ["okafor", "ezra", "dani", "pharmacy", "gi", "marisol", "ray"];
