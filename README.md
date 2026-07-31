# Casebase

Interactive clinical cases for residents, structured as a conversation.

A case is a scripted shift: the attending, the nurse, the pharmacist, a gunner
med student, and the patient all talk to you, and the questions arrive in their
speech. Not a question bank with a story bolted on.

```
npm install
npm run dev
```

## Design decisions worth knowing before you change anything

**Cases are on rails.** There is no branching. Counterfactuals are covered by
*asking* about them — "what would you have done if her potassium had been 2.6?" —
which reaches management the actual path skipped, and costs a fraction of the
authoring.

**Nobody is ever wrong on purpose.** Not the attending, not the pharmacist, not
the med student. But an *order* can be wrong, and pharmacy reads it back for you
to confirm or stop. That's how errors actually get caught, and it keeps every
character an ally.

**The wager comes before the options.** On hard beats the attending asks whether
you know it, and you stake reputation before the choices appear — so you're
rating your knowledge, not your ability to eliminate distractors. Admitting you
don't know costs less than bluffing, which is the point.

**Reputation, not a score.** Five meters, one per character. Unwagered beats can
only gain; only a wager you chose to make can lose you anything.

**The lab table refuses the app's costume.** Thinner border, no accent colour, no
chunky shadow, one uniform weight, one red for abnormal with a triangle for
direction. It reads as the patient's real chemistry precisely because it doesn't
look like the game around it.

**Picker size is a knob, not a rule.** Every picker beat declares how many items
it shows. Play telemetry records list size, time taken, hits and misses, so the
right size gets settled with data instead of opinion:

```js
casebaseTelemetry.readAll()   // in the browser console
```

## Layout

```
src/types/case.ts       the case schema — flat, serializable, reviewable as a document
src/data/orderCatalog   one fixed order list shared by every case
src/data/cases/         the cases themselves
src/state/runStore      all run state in one object
src/state/persistence   localStorage today, Firebase later — only this file changes
src/components/beats/   the input mechanics
src/components/Chart/   patient, labs, orders, vitals
```

## Known gaps

- **The typeface is a system fallback.** `ui-rounded` resolves on macOS and
  degrades to a plain sans elsewhere. A self-hosted rounded face does a lot of
  the charm work and should be picked before much more UI is calibrated against it.
- **No audio assets.** `src/audio/sounds.ts` has named hooks wired at every call
  site; dropping files into `public/sfx/` and filling the map turns them on.
- **Desktop and tablet only.** Below 1000px the chart becomes a slide-over, but
  phone layout is deliberately not designed yet.
- **Chain assembly and timeline sequencing aren't built.** Both need drag, and
  both are worth designing against real content rather than in the abstract.
- **No end-of-case report yet** — reputation accrues, but the breakdown by
  domain and the "right call, wrong reason" list aren't rendered.
