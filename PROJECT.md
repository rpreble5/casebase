# Casebase — project notes

Interactive clinical cases for residents, presented as a conversation. Written
so that a future session (yours or an assistant's) can pick this up cold.

**Live:** https://rpreble5.github.io/casebase/ — the short SHA in the header is
the deployed commit, with the build time on hover.

**Repo:** `rpreble5/casebase`. Work happens on
`claude/interactive-medical-case-app-qsz6y2`; `main` is what Pages deploys.

```
npm install
npm run dev        # local
npm run publish    # build, push the branch, fast-forward main, deploy
```

---

## 1. What it is, and what it deliberately isn't

A case is a scripted shift. The attending, the nurse, the pharmacist, a gunner
medical student and the patient all talk to you, and the questions arrive inside
their speech rather than as a quiz laid over a story.

The design brief was explicitly *not* a medical study app: it should be charming,
tactile and animated, and it should feel like something you'd choose to play.

### Decisions that shape everything else

**Cases are on rails.** No branching. A case is one ordered list of beats and
every resident sees all of them in the same order. Counterfactuals are covered by
*asking* about them — "what would you have done if her potassium had been 2.6?" —
which reaches management the actual path skipped, at a fraction of the authoring
cost. There is exactly one exception, described in §4.

**Nobody is ever wrong on purpose.** Not the attending, not the pharmacist, not
the medical student. This was tried and rejected: making a person wrong is
unrealistic and slightly mean. But an *order* can be wrong, and pharmacy reads it
back for you to confirm or stop, which is how errors actually get caught.

**Ezra just asks hard things.** He's a third-week MS3 who has read the chapter.
He is not wrong; he is relentless, and he is often technically correct about
things that don't change management — which is its own lesson.

**Reputation, not a score.** A percentage tells a resident nothing they want to
know; how the shift went with each person does. Unwagered beats can only gain.
Only a wager you chose to make can lose you anything.

**The wager comes before the options.** On hard beats the attending asks whether
you know it and you stake reputation *before* the choices appear. A slider after
the choices measures how well you eliminate distractors; a wager before them
measures whether you actually know the thing. Admitting you don't know costs less
than bluffing, which is the point.

---

## 2. Visual direction

Reference was an indie game with cream halftone paper, heavy navy outlines and
muted accents. Tokens live in `src/styles/tokens.css`.

- Paper `#F4EAD5`, deeper `#E9DABB`, card `#FBF5E7`, ink `#262A44`
- Five rationed accents, each with one job: **plum** the attending and your
  selections, **rose** patients and family, **sage** the nurse and correct
  answers, **ochre** things you manipulate, **clay** consequences. **Blue-grey**
  is Ezra, deliberately outside the five.
- 3px ink borders, hard 5px offset shadows with no blur. Pressing a control
  drives it down into its own shadow — that's the whole tactile trick.
- **Nothing is tilted.** The reference used rotation for energy; that energy comes
  instead from the flat shadows, the halftone, and type weight.

### Standing rules

- **No emoji, ever.** Every icon is drawn SVG at border weight (`ui/Icon.tsx`).
- **No visible scrollbars anywhere.** Hidden globally in `styles/base.css`. This
  means any region that *can* overflow hides content silently — so layouts must
  be built not to overflow rather than to scroll.
- **Prose is capped at 660px; controls are not.** An option list has no reading
  measure to respect, so the question is a normal speech bubble and the options
  below it are borderless and span the full width (up to 1120px).
- The active question has **no container of its own** and **no internal
  scrolling**. Width is what makes question, options and commit button fit on
  screen together.
- The **lab table refuses the app's costume**: thinner border, no accent colour,
  no chunky shadow, one uniform weight, tabular numerals, one red for abnormal
  with a triangle for direction. It reads as real chemistry precisely because it
  doesn't look like the game around it.

**Known gap:** the chunky rounded typeface is a system fallback (`ui-rounded`).
It resolves on macOS and degrades to a plain sans everywhere else. Self-hosting
something in the Nunito / Baloo / Fredoka family is small work and does a lot of
the charm.

---

## 3. Input mechanics

Each is a `kind` on a beat. Discussed and rejected along the way: confidence
sliders after the options, probability dials, image hotspots, free-text
commit-then-compare, 100-point differentials, order composers, cross-out.

| kind | What it is |
|---|---|
| `say` | Dialogue or narration. No input. |
| `labs` | Reveals a lab draw into the chart and announces it. |
| `mcq` | Single choice. |
| `selectAll` | Multiple. **The count is never shown** — knowing it is a different, easier question. |
| `picker` | Order entry against the shared catalog. |
| `slider` | For judgment, where the answer is a defensible range. |
| `keypad` | For arithmetic. No range shown — a slider would leak the magnitude. |
| `confirm` | Pharmacy reads back an order; confirm or hold. The justification is asked on **both** paths so the structure never tells you which way was right. |
| `medrec` | Home medication list, three states per drug. See §4. |

**Not built, previously designed:** chain assembly (drag pathophysiology nodes
into a causal structure) and timeline sequencing (order actions that are all
individually correct). Both need drag. You were unconvinced by chain assembly and
warmer on sequencing. Pathophysiology is currently carried by MCQs as a result.

### Scoring nuances worth preserving

- **Omission is weighted heavily.** On set beats, any miss fails, as does
  anything in the `harmful` tier. "Defensible" additions cost nothing.
- Distractors are tiered `wasteful` / `defensible` / `harmful`. Distractor
  quality matters far more than list length.
- **Right call, wrong reason** is its own outcome. A beat can declare
  `pairs: "<beatId>"`; when the action was right and its paired justification
  wrong, the report says so. This is the single most useful thing the app tells
  a resident and a question bank structurally cannot produce it.

### Question size

Settled by argument and layout rather than data: **9–13 items** is the size that
reads as "what's your next move." Big pickers were tried at 22 and 25 items and
felt like a workup dump; both cases now split them into chunks with a conceptual
or pearl question hanging off each chunk. Telemetry records list size against
time and accuracy (`casebaseTelemetry.readAll()` in the console) but nothing
reads it yet.

---

## 4. Medication reconciliation

Your idea, and the best-received mechanic. On admission the home medication list
appears **in the conversation**, not the chart, because on admission it's a
decision rather than a reference.

**Three states, not two:** continue / hold / **stop**. Hold and stop are
different decisions with different failure modes — the held anticoagulant nobody
restarts, the "stopped" NSAID the patient resumes at home.

**Deliberately quiet** (`quiet: true`). No verdict, no correction, no reputation
chip — the chip alone would tell you whether you were right. The calls are
reported for the first time in the end-of-case summary.

**The one exception to no-branching.** A `say` beat may carry `variants` that
reword it around an earlier medication decision. Continue the metoprolol in the
GI bleed and the nurse names it when his pressure drops; continue the thiazide in
the hyponatremia case and she tells you she gave it as his sodium starts
climbing. The beat exists either way, in the same position, teaching the same
point — only the framing moves.

---

## 5. Content authoring rules

Cases are AI-written and physician-verified, so the schema is flat, serializable
data with no logic in it. A case is reviewable as a document.

**Never type a lab number into dialogue.** Values are references resolved at
render time from the case's own draws, so the story cannot drift from the chart:

- `{k}` — analyte from the most recently revealed draw
- `{k@0}` — from a specific draw, for "she arrived at {k@0}"
- `{t}` / `{t@2}` — a draw's timestamp
- `{=6.8}` — a literal that should still read as a value

Every token renders as a **bold numeral**. Characters say `3.1`, never "three
point one". A validator walks every line at startup and reports anything
unresolvable; a broken token renders in loud red rather than disappearing. This
caught two errors that had already shipped — a beat announcing "three thirty" for
a draw timestamped 02:30, and the same line claiming insulin had run four hours
when it had been held.

**No markdown in case strings.** They render raw; a stray `*word*` shows as
asterisks.

**`hidden: true` on an analyte** keeps it out of the chart until a beat's
`unlocks` reveals it. Two uses: a value the resident must calculate (showing the
anion gap while the attending asks you to calculate it hands over the answer),
and a test they must think to order (the urine studies in the hyponatremia case).

**Orders come from one shared catalog** (`data/orderCatalog.ts`, 88 items). A
case declares which ids it shows and how each scores; it never invents order
names, so a physician reviewer checks clinical judgment rather than proofreading.

---

## 6. The cases

| id | Title | Beats | Wagers |
|---|---|---|---|
| `dka-reyes` | Two days of vomiting | 28 | 4 |
| `gib-sandoval` | He stood up too fast | 31 | 6 |
| `hypona-boyd` | She's not making sense | 27 | 6 |

**DKA — Marisol Reyes, 24.** Type 1 diabetic three days out of glargine because
she aged off her parents' insurance. Arrival chemistry is written to carry a
concurrent metabolic alkalosis from two days of vomiting, so the delta-delta is
~1.4 and Ezra's ambush is a finding the history predicts. Spine: the potassium
paradox, fluids-before-insulin, glucose versus gap, and a hyperchloremic non-gap
acidosis she leaves with. Ends on insulin cost, not on the gap closing.

**GI bleed — Ray Sandoval, 71.** Apixaban, aspirin and a supermarket NSAID. The
medication list *is* the pathophysiology — nobody prescribed that combination,
it assembled itself. Spine: BUN:Cr points upstream, the arrival haemoglobin is a
lagging number, the beta blocker blunts his tachycardia, restrictive transfusion,
endoscopy within 24 hours. The hardest beat is when the apixaban goes back on,
where the harm of not restarting is invisible and delayed.

**Hyponatremia — Eileen Boyd, 78.** The first case where the diagnosis is the
work: establish it's genuinely hypotonic, then whether ADH is acting, then why.
Also the first where treatment is dangerous in both directions. The case turns on
the autocorrection overshoot — her ADH switches off, her own kidneys correct her
faster than anything prescribed, and the rescue is free water with a desmopressin
clamp.

### Clinical calls awaiting your sign-off

- DKA arrival panel: Na 129 / Cl 88 / HCO₃ 12, gap 29, delta-delta ~1.4.
- GI bleed: transfusion at 7, ~8 in ACS with the caveat that the restrictive
  trials largely excluded those patients. Forrest 2a drives the "let 72 hours
  pass" reasoning in the restart beat.
- GI bleed: ICU admission scored **correct**, stepdown merely defensible.
- Hyponatremia: correction ceiling 8 mEq/L in 24h (tolerance 6–10); **relowering**
  an overshoot scored as correct.

---

## 7. Code map

```
src/types/case.ts          the schema — read this first
src/data/cases/            one file per case, plus index.ts registry
src/data/orderCatalog.ts   shared order list
src/data/speakers.ts       the cast
src/data/interpolate.tsx   {token} resolution + the case validator
src/state/runStore.ts      all run state in one object; the beat engine
src/state/persistence.ts   localStorage today, Firebase later — only this changes
src/components/Conversation/  feed, growing bubbles
src/components/beats/      the input mechanics, graded blocks, medrec
src/components/Chart/      patient, labs, orders, vitals
src/components/Report.tsx  end of case
src/telemetry/log.ts       play data, buffered locally
```

**The beat engine.** `pump()` consumes beats until one needs the resident;
`tick()` moves one queued line into view on a timer. Dialogue is queued as ops so
a bubble can *grow* — a `say` entry that is an array becomes one bubble whose
paragraphs arrive in turn, so a continuous thought costs one border instead of
three. The active question is held out of the transcript in `activeAsk` and
rejoins it once answered.

---

## 8. Known gaps and where we'd left off

**Not built, agreed as worth doing:**

- **Pacing.** No way to skip or fast-forward dialogue. Fine on a first play,
  punishing on a re-run. You deprioritised this but it will bite.
- **A case linter in CI.** The token validator covers one class of error. The
  same walk could check `correct` ids that aren't in the beat's own choices,
  `why` keys naming options that don't exist, `pairs` pointing at missing beats,
  labs beats referencing draws past the end, unknown catalog ids. For an
  AI-authoring pipeline this is the thing that makes the pipeline trustworthy.
- **Asking for help.** A "can you point me at it?" affordance that costs
  reputation — models a real professional skill and gives an escape valve.
- **Reviewer mode.** Render a case as a plain readable document so a physician
  can verify it without seeing TypeScript. Becomes the bottleneck as case count
  grows.
- **Keyboard control**, **resume mid-case**, **carrying misses forward across
  runs**, **pearls as a persistent collection**.

**Smaller:**

- No audio assets. Hooks are wired at every call site in `audio/sounds.ts`.
- Header shows raw reputation numbers, which mean little mid-case.
- Telemetry is recorded and nothing reads it.
- Desktop and tablet only; below 1000px the chart becomes a slide-over but phone
  layout is deliberately not designed.
- Default branch on GitHub is still the feature branch rather than `main`.

**Eventual direction:** multi-user on something like Firebase, with cases written
by AI and verified by physicians.
