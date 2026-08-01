import type { MedicalCase } from "../../types/case";
import { dkaCase } from "./dka";
import { giBleedCase } from "./gibleed";
import { hyponatremiaCase } from "./hyponatremia";
import { heartFailureCase } from "./heartfailure";
import { copdCase } from "./copd";

/** Every case the app knows about. Order is the order they're offered in. */
export const CASES: MedicalCase[] = [copdCase, dkaCase, giBleedCase, hyponatremiaCase, heartFailureCase];

export function caseById(id: string): MedicalCase | undefined {
  return CASES.find((c) => c.id === id);
}
