import type { ReactNode } from "react";
import type { MedicalCase } from "../types/case";

/**
 * Dialogue never contains a lab number as literal text.
 *
 * A line says `Potassium's {k}` and the value is pulled from the case's own lab
 * draws at render time. The story therefore cannot drift from the chart, because
 * there is only one copy of every number. That was a real bug: a beat announced
 * "three thirty" while the panel it referred to was timestamped 02:30.
 *
 * It also makes the authoring rule trivial to follow and trivial to check — an
 * author never types a value, and an unresolvable token is a hard error rather
 * than a plausible-looking wrong number.
 *
 * Tokens
 *   {k}          analyte from the most recently revealed draw
 *   {k@0}        analyte from a specific draw, for "she arrived at {k@0}"
 *   {t} {t@2}    the draw's timestamp
 *   {=68 kg}     a literal that should still read as a value
 *
 * Every token renders as a bold numeral so figures stand out from the prose.
 */

export interface LineCtx {
  caseData: MedicalCase;
  /** How many draws the resident has been shown. Tokens can't outrun the chart. */
  revealedDraws: number;
}

const TOKEN = /\{([^}]+)\}/g;

export function resolveToken(raw: string, ctx: LineCtx): string | null {
  if (raw.startsWith("=")) return raw.slice(1);

  const [name, at] = raw.split("@");
  const idx = at !== undefined ? Number(at) : ctx.revealedDraws - 1;
  if (!Number.isInteger(idx) || idx < 0 || idx >= ctx.caseData.draws.length) return null;
  const draw = ctx.caseData.draws[idx];

  if (name === "t") return draw.time;

  const analyte = ctx.caseData.analytes.find((a) => a.id === name);
  if (!analyte) return null;
  const v = draw.values[name];
  if (v === undefined) return null;
  return v.toFixed(analyte.decimals ?? 0);
}

/** Splits a line into text and bold value spans. */
export function renderLine(text: string, ctx: LineCtx): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const value = resolveToken(m[1], ctx);
    out.push(
      value === null ? (
        // Loud on purpose: a broken token should be obvious in review, not silent.
        <b key={out.length} className="num num--bad">
          {`{${m[1]}}`}
        </b>
      ) : (
        <b key={out.length} className="num">
          {value}
        </b>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Walks every line of a case and reports tokens that don't resolve.
 *
 * Cases are AI-authored and physician-verified, so the failure mode to guard
 * against is a number that looks right and isn't. Run against every draw index
 * so a token is checked wherever in the case it might appear.
 */
export function validateCase(c: MedicalCase): string[] {
  const problems: string[] = [];
  const ctx: LineCtx = { caseData: c, revealedDraws: c.draws.length };

  const check = (beatId: string, where: string, lines: unknown) => {
    if (!Array.isArray(lines)) return;
    for (const entry of lines) {
      const paras = typeof entry === "string" ? [entry] : (entry as string[]);
      for (const p of paras) {
        TOKEN.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = TOKEN.exec(p)) !== null) {
          if (resolveToken(m[1], ctx) === null) {
            problems.push(`${beatId} ${where}: unresolved {${m[1]}}`);
          }
        }
      }
    }
  };

  for (const b of c.beats) {
    check(b.id, "say", (b as { say?: unknown }).say);
    check(b.id, "onRight", (b as { onRight?: unknown }).onRight);
    check(b.id, "onWrong", (b as { onWrong?: unknown }).onWrong);
  }
  return problems;
}
