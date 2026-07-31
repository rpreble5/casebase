# Casebase

Read `PROJECT.md` first — it explains what this is, the decisions behind it, and
where work left off. This file is only the standing rules that are easy to break
by accident.

## Shipping

`npm run publish` builds, pushes the working branch, then fast-forwards `main`,
which is what GitHub Pages deploys. Run it at the end of any change the user
should be able to see. Pages only accepts deployments from `main` — the
`github-pages` environment's branch policy rejects everything else.

## Rules that are easy to violate

- **No emoji anywhere in the UI.** Icons are drawn SVG at border weight.
- **No visible scrollbars.** Hidden globally, which means anything that can
  overflow hides content silently. Build layouts that fit rather than scroll.
- **No markdown in case strings.** They render raw.
- **Never type a lab value into dialogue.** Use `{k}`, `{k@0}`, `{t}`, `{=6.8}`
  so the story cannot drift from the chart. Spelled-out numbers are wrong —
  characters say `3.1`, not "three point one".
- **Nothing is tilted.** No rotated elements.
- **Cases don't branch.** The only exception is `variants` on a `say` beat,
  which rewords one bubble around an earlier medication decision.
- **Never show the count on a select-all.** It makes it a different question.
- The lab table stays visually quiet and is not styled like the rest of the app.

## Working style the user has asked for

- Natural prose in replies, not clipped stylish fragments.
- Flag clinical calls that need their sign-off rather than asserting them.
- Verify in a real browser before claiming something works; they will notice.
