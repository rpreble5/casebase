import type { MedicalCase } from "../../types/case";

/**
 * Thiazide-associated hyponatremia with autocorrection overshoot.
 *
 * The other two cases hand you the diagnosis in the first thirty seconds. This
 * one doesn't: the resident has to establish that it's genuinely hypotonic,
 * then work out whether ADH is acting and why, before anything can be treated.
 *
 * The other structural difference is that here the treatment is dangerous in
 * both directions. Too slow and she seizes; too fast and she gets osmotic
 * demyelination — and she carries the risk factors for it. The case turns on the
 * moment the stimulus is removed, ADH switches off, and her own kidneys start
 * correcting her faster than anything we prescribed.
 *
 * Clinical spine: calculated versus measured osmolality excludes a translocational
 * or pseudo-hyponatremia; urine osmolality above 100 says ADH is acting; urine
 * sodium above 30 with a thiazide on board is not the SIADH slam-dunk it looks
 * like; correction is capped at 8 mEq/L in 24 hours; and the rescue for an
 * overshoot is free water with a desmopressin clamp.
 */
export const hyponatremiaCase: MedicalCase = {
  id: "hypona-boyd",
  title: "She's not making sense",
  blurb: "A 78-year-old, confused for two days, six weeks into a new blood pressure tablet.",

  patient: {
    name: "Eileen Boyd",
    age: 78,
    line: "78-year-old woman brought in by her daughter with two days of confusion and unsteadiness.",
    weightKg: 58,
    history: [
      "Hypertension — a thiazide added six weeks ago",
      "Depression, stable on an SSRI for five years",
      "Hypothyroidism",
      "Osteoarthritis, both hips",
      "No previous episodes of confusion",
    ],
    allergies: "No known drug allergies",
    meds: [
      "Hydrochlorothiazide 25 mg daily — started six weeks ago",
      "Sertraline 100 mg daily",
      "Levothyroxine 75 mcg daily",
      "Amlodipine 5 mg daily",
      "Ibuprofen 400 mg as needed for hips",
    ],
    social:
      "Lives alone; daughter visits daily. Since her husband died she mostly has tea and toast. Daughter says she's been drinking 'cups and cups' of tea because the new tablet made her thirsty.",
  },

  vitals: [
    { time: "14:10", hr: 76, bp: "128/74", rr: 16, temp: "36.4 °C", spo2: 98 },
    { time: "18:00", hr: 74, bp: "126/72", rr: 16, temp: "36.5 °C", spo2: 98 },
    { time: "23:00", hr: 72, bp: "124/70", rr: 15, temp: "36.5 °C", spo2: 99 },
    { time: "06:00", hr: 70, bp: "130/76", rr: 14, temp: "36.6 °C", spo2: 99 },
  ],

  analytes: [
    { id: "na", name: "Sodium", ref: "135–145", low: 135, high: 145 },
    { id: "k", name: "Potassium", ref: "3.5–5.1", low: 3.5, high: 5.1, decimals: 1 },
    { id: "cl", name: "Chloride", ref: "98–107", low: 98, high: 107 },
    { id: "hco3", name: "Bicarb", ref: "22–29", low: 22, high: 29 },
    { id: "bun", name: "BUN", ref: "7–20", low: 7, high: 20 },
    { id: "cr", name: "Creatinine", ref: "0.6–1.1", low: 0.6, high: 1.1, decimals: 1 },
    { id: "glucose", name: "Glucose", ref: "70–99", low: 70, high: 99 },
    { id: "sosm", name: "Serum osmolality", ref: "275–295", low: 275, high: 295 },
    // Hidden until the resident calculates it — showing it hands over the answer.
    { id: "cosm", name: "Calculated osm", ref: "275–295", low: 275, high: 295, hidden: true },
    // Hidden until ordered: these are the tests the resident has to think to send.
    { id: "uosm", name: "Urine osm", ref: "—", hidden: true },
    { id: "una", name: "Urine sodium", ref: "—", hidden: true },
    { id: "uric", name: "Uric acid", ref: "2.5–7.0", low: 2.5, high: 7.0, decimals: 1, hidden: true },
    { id: "tsh", name: "TSH", ref: "0.4–4.0", low: 0.4, high: 4.0, decimals: 1, hidden: true },
  ],

  draws: [
    {
      time: "14:20",
      label: "On arrival",
      values: {
        na: 112, k: 3.2, cl: 78, hco3: 26, bun: 8, cr: 0.6, glucose: 92,
        sosm: 238, cosm: 232, uosm: 480, una: 62, uric: 2.1, tsh: 2.1,
      },
    },
    {
      time: "18:20",
      label: "After 3% saline",
      values: {
        na: 119, k: 3.4, cl: 85, hco3: 25, bun: 7, cr: 0.6, glucose: 95,
        sosm: 250, cosm: 246, uosm: 96, una: 48, uric: 2.4, tsh: 2.1,
      },
    },
    {
      time: "23:00",
      label: "After D5W",
      values: {
        na: 118, k: 3.6, cl: 86, hco3: 25, bun: 7, cr: 0.6, glucose: 98,
        sosm: 249, cosm: 245, uosm: 320, una: 44, uric: 2.8, tsh: 2.1,
      },
    },
    {
      time: "06:00",
      values: {
        na: 121, k: 3.9, cl: 89, hco3: 25, bun: 8, cr: 0.6, glucose: 92,
        sosm: 254, cosm: 251, uosm: 280, una: 40, uric: 3.4, tsh: 2.1,
      },
    },
  ],

  beats: [
    {
      kind: "say",
      id: "h1",
      speaker: "dani",
      say: [
        [
          "Eileen Boyd, {=78}. Daughter brought her in — confused for two days, unsteady on her feet, one vomit this morning.",
          "She's oriented to herself and not much else. Pressure {=128/74}, heart rate {=76}, she's afebrile and she looks dry as a bone to me — or maybe she doesn't. Honestly I can't tell.",
        ],
        "The ED sent a panel before you got here. Sodium's {na@0}.",
      ],
    },

    {
      kind: "say",
      id: "h2",
      speaker: "nadia",
      say: [
        [
          "I'm her daughter. She's not like this, she does the crossword every morning.",
          "The doctor put her on a new tablet for her blood pressure about six weeks ago and she's been drinking tea constantly since — she says it makes her thirsty. And she hasn't really been eating. It's mostly toast.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "h2b",
      draw: 0,
      speaker: "system",
      say: ["The ED chemistry panel is on the screen."],
    },

    {
      kind: "medrec",
      id: "h3",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      quiet: true,
      say: [
        "Before we go anywhere near a diagnosis — her list.",
        "Which of these is she getting tomorrow?",
      ],
      meds: [
        {
          id: "hctz",
          name: "Hydrochlorothiazide 25 mg daily",
          reason: "Hypertension — started six weeks ago",
          correct: "stop",
          harmful: ["continue"],
          why: "Stopped, not held. Rechallenge carries a high recurrence rate and she nearly died of it. This drug does not go back on her list — she needs a different antihypertensive.",
        },
        {
          id: "sertraline",
          name: "Sertraline 100 mg daily",
          reason: "Depression, stable five years",
          correct: "hold",
          why: "Hold while you sort the sodium out. Stopping an SSRI outright after five years buys you a discontinuation syndrome and a relapse — that's a conversation with her GP, not a decision for today.",
        },
        {
          id: "ibuprofen",
          name: "Ibuprofen 400 mg as needed",
          reason: "Hip pain",
          correct: "stop",
          harmful: ["continue"],
          why: "NSAIDs potentiate the renal action of ADH and blunt free water excretion. In a 78-year-old with a creatinine that only looks normal because she has no muscle, it also has no business being there.",
        },
        {
          id: "levothyroxine",
          name: "Levothyroxine 75 mcg daily",
          reason: "Hypothyroidism",
          correct: "continue",
          harmful: ["stop"],
          why: "Continue it. Untreated hypothyroidism is itself a cause of hyponatremia — stopping it would work against you.",
        },
        {
          id: "amlodipine",
          name: "Amlodipine 5 mg daily",
          reason: "Hypertension",
          correct: "continue",
          why: "Her pressure is fine and amlodipine has nothing to do with this. Reflexively holding the whole list is its own error.",
        },
      ],
      rep: { who: "okafor", points: 3 },
      onRight: ["Right. Now — what have we actually got?"],
      onWrong: ["Right. Now — what have we actually got?"],
    },

    /* ---- establish it's real before treating it ---- */

    {
      kind: "keypad",
      id: "h4",
      speaker: "okafor",
      tier: "foundation",
      domain: "diagnosis",
      say: [
        "Sodium {na@0}, glucose {glucose@0}, BUN {bun@0}.",
        "Calculate her serum osmolality. Round to the nearest whole number.",
      ],
      answer: 232,
      tolerance: 2,
      unlocks: ["cosm"],
      rep: { who: "okafor", points: 1 },
      onRight: ["About {cosm@0}. The lab measured {sosm@0}. Tell me what that pair means."],
      onWrong: [
        [
          "Twice the sodium, plus glucose over 18, plus BUN over 2.8. That's {cosm@0}.",
          "The lab measured {sosm@0}. Tell me what that pair means.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "h5",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      pairs: "h4",
      say: ["Calculated {cosm@0}, measured {sosm@0}. So?"],
      choices: [
        {
          id: "a",
          text: "The gap is small, so there's no unmeasured osmole — this is genuine hypotonic hyponatremia and the sodium means what it says",
        },
        { id: "b", text: "The gap is large, which points to pseudohyponatremia from hyperlipidaemia or paraproteinaemia" },
        { id: "c", text: "The two should be identical; a difference of any size indicates a laboratory error" },
        { id: "d", text: "Calculated osmolality is unreliable below a sodium of 120, so the comparison tells you nothing" },
      ],
      correct: "a",
      why: {
        b: "A gap of about 6 is normal. You'd want more than 10 before invoking an unmeasured osmole, and considerably more for a paraprotein.",
        c: "A small gap is expected — the formula doesn't account for every solute. It's the size of the gap that carries information.",
        d: "There's no such threshold. The formula holds across the range.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Good. That's the step everyone skips, and skipping it is how somebody gets treated with hypertonic saline for a triglyceride problem.",
          "She is genuinely hypotonic. Her cells are swelling, including the ones inside her skull, which is why she can't do the crossword.",
        ],
      ],
      onWrong: [
        [
          "Calculated {cosm@0} against a measured {sosm@0} is a gap of about {=6}. That's normal — no unmeasured osmole, no lipid or paraprotein artefact.",
          "So the number is real. She is genuinely hypotonic, her cells are swelling, and that includes the ones inside her skull.",
        ],
      ],
    },

    {
      kind: "picker",
      id: "h6",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: ["Now work out why. What are you sending?"],
      grouped: true,
      show: [
        "uric_acid", "lft", "cortisol", "tsh",
        "urine_osm", "urine_na", "urine_k",
        "bmp", "na_serial",
        "ct_head", "cxr",
      ],
      correct: ["urine_osm", "urine_na", "tsh", "cortisol", "uric_acid", "na_serial"],
      critical: ["urine_osm", "urine_na", "na_serial"],
      unlocks: ["uosm", "una", "uric", "tsh"],
      cost: { ct_head: "defensible", cxr: "defensible", urine_k: "wasteful" },
      why: {
        urine_osm:
          "The single most useful test on this screen. It answers one question: is ADH acting or isn't it?",
        urine_na:
          "And this one asks whether she's volume deplete. It's less trustworthy than you've been taught, for a reason we'll get to.",
        na_serial:
          "You cannot correct safely without measuring. Every two hours while she's on hypertonic saline, no exceptions.",
        tsh: "Hypothyroidism and adrenal insufficiency both cause this and both are easy to miss. Cheap to exclude.",
        uric_acid: "Low urate supports SIADH physiology. Supportive, not diagnostic — and Ezra is about to make that point.",
        ct_head: "Reasonable in a confused 78-year-old who's been unsteady. It won't explain a sodium of 112 though.",
        urine_k: "Only useful if you're calculating electrolyte-free water clearance, which you aren't.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. Urine's in the lab now."],
      onWrong: ["We'll add a couple. Urine's in the lab."],
    },

    {
      kind: "mcq",
      id: "h7",
      speaker: "okafor",
      tier: "foundation",
      domain: "pathophys",
      say: [
        "While we wait — of everything you just sent, the urine osmolality does the most work.",
        "What exactly does it tell you?",
      ],
      choices: [
        {
          id: "a",
          text: "Whether ADH is acting. Below about 100 the kidney is diluting appropriately and the problem is water intake; above that, ADH is present when it shouldn't be.",
        },
        { id: "b", text: "Whether she is volume depleted — a high urine osmolality means hypovolaemia" },
        { id: "c", text: "How much sodium she is losing in the urine" },
        { id: "d", text: "Whether her kidneys are capable of concentrating, which excludes renal failure" },
      ],
      correct: "a",
      why: {
        b: "Hypovolaemia is one reason ADH is on, but it isn't the only one. The urine osmolality tells you the hormone is acting, not why.",
        c: "That's the urine sodium, and it's a different question.",
        d: "Concentrating capacity is a side effect of the measurement, not its purpose here.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Exactly. It's a hormone assay you can get in ten minutes.",
          "Maximally dilute urine means the kidney is doing its job and someone is drinking more than it can excrete. Concentrated urine in a hypotonic patient means ADH is on when physiology says it should be off.",
        ],
      ],
      onWrong: [
        [
          "It's an ADH assay in disguise. A hypotonic patient should be making maximally dilute urine — under about 100.",
          "If the urine is concentrated instead, ADH is circulating when it has no osmotic business being there. That single number splits the differential in half before you've examined her.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "h8",
      draw: 0,
      speaker: "system",
      say: ["Urine studies and endocrine screen resulted."],
    },

    {
      kind: "mcq",
      id: "h9",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: [
        "Urine osmolality {uosm@0}, urine sodium {una@0}, urate {uric@0}, TSH {tsh@0}.",
        "Put it together.",
      ],
      choices: [
        {
          id: "a",
          text: "ADH is acting inappropriately, and the thiazide is the reason — it impairs urinary dilution while she drinks tea and eats almost no solute",
        },
        { id: "b", text: "Hypovolaemic hyponatremia — she's dry, ADH is an appropriate response, and she needs aggressive saline" },
        { id: "c", text: "Primary polydipsia — she's simply drinking more water than her kidneys can excrete" },
        { id: "d", text: "Hypothyroidism, given the picture and her history" },
      ],
      correct: "a",
      why: {
        b: "Possible on the ward round, and the urine sodium of {una@0} argues against avid renal sodium retention. Worth holding as a differential — but a thiazide makes the urine sodium uninterpretable, which is the next thing Ezra is going to say.",
        c: "Primary polydipsia produces maximally dilute urine — an osmolality under 100. Hers is {uosm@0}. The kidney is not diluting.",
        d: "A TSH of {tsh@0} is normal. Worth excluding, now excluded.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "That's the picture. Thiazides block sodium reabsorption in the cortical diluting segment, which is precisely where dilute urine gets made.",
          "Add an SSRI, an NSAID, and a diet of tea and toast that gives her almost no solute to excrete water with, and you have a 78-year-old at 112.",
        ],
      ],
      onWrong: [
        [
          "Concentrated urine in a hypotonic patient means ADH is acting. Normal thyroid, normal cortisol, low urate.",
          "The thiazide impairs urinary dilution at exactly the segment where dilute urine is made. Then add an SSRI, an NSAID, and a tea-and-toast diet with almost no solute to carry water out. Four small things, one sodium of 112.",
        ],
      ],
    },

    /* ---- Ezra, twice, the second built on the first ---- */

    {
      kind: "mcq",
      id: "h10",
      speaker: "ezra",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "Sorry — the urine sodium is {una@0}.",
        [
          "I've been taught that a urine sodium above {=30} rules out hypovolaemia and basically makes it SIADH.",
          "So can we call this SIADH?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "No — a diuretic invalidates the urine sodium entirely, because the drug is forcing sodium out regardless of her volume state",
        },
        { id: "b", text: "Yes — above 30 is diagnostic of SIADH by consensus criteria" },
        { id: "c", text: "No — SIADH requires a urine sodium above 40, so 62 is only suggestive" },
        { id: "d", text: "Yes, provided the serum osmolality is low, which it is" },
      ],
      correct: "a",
      why: {
        b: "The criteria assume no diuretic. Applying them to a woman on hydrochlorothiazide is using a rule outside the conditions it was written for.",
        c: "There's no such second threshold, and it wouldn't rescue the measurement anyway.",
        d: "Low osmolality is a prerequisite for the diagnosis, not a substitute for excluding a diuretic.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        [
          "Oh — because the drug is making her wee sodium out whatever her volume is.",
          "So the number's meaningless. That's annoying.",
        ],
      ],
      onWrong: [
        [
          "Every SIADH criterion you've memorised comes with a condition attached: no diuretic, normal thyroid, normal adrenal function. She fails the first one.",
          "Hydrochlorothiazide forces sodium into the urine irrespective of her volume status, so a urine sodium of {una@0} tells you she is on a thiazide and nothing else. This is why we call it thiazide-associated rather than SIADH — the mechanism overlaps, the label doesn't fit.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "h11",
      speaker: "ezra",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "What about the urate then — it's {uric@0}, that's properly low.",
        "Doesn't a low urate confirm SIADH?",
      ],
      choices: [
        {
          id: "a",
          text: "It supports the physiology — volume expansion increases urate excretion — but it's neither sensitive nor specific enough to confirm anything, and it drifts back up once she's corrected",
        },
        { id: "b", text: "Yes — a urate below 4 is diagnostic of SIADH" },
        { id: "c", text: "No — low urate points away from SIADH and towards hypovolaemia" },
        { id: "d", text: "It reflects her poor nutritional state and has nothing to do with sodium handling" },
      ],
      correct: "a",
      why: {
        b: "Supportive findings and diagnostic criteria are different things, and treating the first as the second is how confident diagnoses go wrong.",
        c: "Backwards. Hypovolaemia raises urate through increased proximal reabsorption.",
        d: "Malnutrition is real here and it isn't the mechanism. The urate is low because she's water-expanded.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        [
          "So it's a hint, not a proof.",
          "I feel like half of what I've learned is hints that got promoted.",
        ],
      ],
      onWrong: [
        [
          "Low urate fits — water expansion increases fractional excretion of urate, so it's consistent with the physiology.",
          "But plenty of hyponatremic patients without SIADH have low urate, and plenty with it don't. Watch it climb back over the next two days as she corrects. Supportive findings are hints. They get promoted to criteria in people's heads and then mislead them.",
        ],
      ],
    },

    /* ---- how fast, and how fast is too fast ---- */

    {
      kind: "mcq",
      id: "h12",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: [
        "She's confused and she vomited. That's not asymptomatic hyponatremia.",
        "What are you giving her, right now?",
      ],
      choices: [
        {
          id: "a",
          text: "A bolus of hypertonic 3% saline, aiming to raise her sodium 4 to 6 over the next few hours",
        },
        { id: "b", text: "Isotonic saline at 125 mL/hr and recheck in six hours" },
        { id: "c", text: "Fluid restriction alone — the sodium will come up once the thiazide is stopped" },
        { id: "d", text: "Hypertonic saline as a continuous infusion titrated to a sodium of 135" },
      ],
      correct: "a",
      why: {
        b: "Isotonic saline in a patient whose urine is more concentrated than the fluid you're giving can lower the sodium further. It's the classic way to make this worse while feeling reasonable.",
        c: "Correct for asymptomatic hyponatremia and far too slow for a woman who is confused and vomiting.",
        d: "A continuous infusion titrated to normal is how people overshoot. Small boluses, frequent measurement, and a hard ceiling — you are not aiming for 135 today.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Bolus, measure, repeat if she's still symptomatic. Four to six points buys her brain enough room.",
          "You are not treating a number. You are treating cerebral oedema, and a small rise fixes that long before the sodium looks normal.",
        ],
      ],
      onWrong: [
        [
          "She needs {=3}% saline as a bolus — {=100} to {=150} mL — aiming for a rise of {=4} to {=6} over a few hours.",
          "Not an infusion titrated to normal, and definitely not isotonic saline, which in a patient making urine this concentrated can drive the sodium down further.",
        ],
      ],
    },

    {
      kind: "keypad",
      id: "h13",
      speaker: "okafor",
      tier: "core",
      domain: "guidelines",
      say: ["What's the most her sodium is allowed to rise in the first 24 hours?"],
      answer: 8,
      tolerance: 2,
      unit: "mEq/L",
      rep: { who: "okafor", points: 2 },
      onRight: ["Eight. Write the ceiling on the whiteboard, not just in the notes."],
      onWrong: [
        [
          "About {=8} in 24 hours. Some would allow {=10} in a low-risk patient, and she is not low-risk.",
          "Write the ceiling on the whiteboard where the nurses can see it. Not buried in a note nobody opens.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "h14",
      speaker: "okafor",
      tier: "bonus",
      domain: "complications",
      pairs: "h13",
      wager: true,
      say: [
        "Now tell me why the ceiling exists, and why I said she isn't low-risk.",
      ],
      choices: [
        {
          id: "a",
          text: "Osmotic demyelination — her brain has adapted over weeks by extruding osmolytes, and it can't take them back quickly. Her hypokalaemia, malnutrition and chronicity all raise the risk.",
        },
        { id: "b", text: "Cerebral oedema — correcting quickly drives more water into the brain" },
        { id: "c", text: "Rebound hyponatremia once the hypertonic saline is stopped" },
        { id: "d", text: "Central pontine haemorrhage from the osmotic shift across cerebral vessels" },
      ],
      correct: "a",
      why: {
        b: "This is backwards, and it's the commonest confusion in the topic. Oedema is the danger of the hyponatremia itself; demyelination is the danger of correcting it.",
        c: "Rebound happens and it isn't what caps the rate.",
        d: "It's demyelination, not haemorrhage — and it isn't confined to the pons, which is why the name changed.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Right, and the risk factors matter more than people think. Chronic hyponatremia, potassium of {k@0}, and a diet of tea and toast — she has three.",
          "The brain spent six weeks pushing organic osmolytes out to stop itself swelling. Raise the serum tonicity faster than it can pull them back in and you dehydrate the cells that adapted best. That's the myelin.",
        ],
        "It shows up two to six days later, when everyone has stopped watching.",
      ],
      onWrong: [
        [
          "Osmotic demyelination. Over six weeks her brain adapted by extruding organic osmolytes so it wouldn't swell — and it cannot take them back in hours.",
          "Correct her too fast and the adapted cells are left hypertonic to the serum, shrink, and demyelinate. Hypokalaemia, malnutrition and chronicity all raise the risk, and she has all three.",
        ],
        "And it presents two to six days later, when everyone has stopped watching.",
      ],
    },

    {
      kind: "confirm",
      id: "h15",
      speaker: "pharmacy",
      tier: "core",
      domain: "guidelines",
      say: [
        "Pharmacy — verifying on Boyd.",
        "I have {=3}% sodium chloride, {=1} litre, continuous infusion at {=50} mL an hour. Confirming?",
      ],
      affirmLabel: "Confirm it",
      denyLabel: "Hold on",
      correct: "deny",
      followUp: {
        prompt: "What's wrong with it?",
        choices: [
          { id: "a", text: "It should be small repeated boluses with sodium checks between them, not a litre bag running unattended" },
          { id: "b", text: "Nothing — 50 mL an hour is a conservative rate for hypertonic saline" },
          { id: "c", text: "The concentration is wrong; it should be 5% saline for symptomatic hyponatremia" },
          { id: "d", text: "It needs to run through a central line, otherwise the order is unsafe" },
        ],
        correct: "a",
        why: {
          b: "The rate isn't the problem — the format is. A litre bag hanging overnight is how a ceiling gets breached while everyone assumes someone else is watching the number.",
          c: "5% saline exists and isn't what's indicated here. The concentration is fine.",
          d: "3% can be given peripherally in this setting. A real consideration, not the error in front of you.",
        },
      },
      rep: { who: "pharmacy", points: 3 },
      onRight: [
        [
          "Agreed. I'll dispense it as {=100} mL boluses so somebody has to actively decide to give the next one.",
          "A litre bag on a pump is a thing that keeps happening at three in the morning whether or not anyone's checking.",
        ],
      ],
      onWrong: [
        [
          "I'm going to push back. A litre of {=3}% on a pump will keep running whether or not anybody is looking at her sodium.",
          "I'll send it as {=100} mL boluses instead — that way giving more is a decision somebody makes, rather than something that happens.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "h16",
      draw: 1,
      speaker: "dani",
      say: ["Four o'clock sodium's back."],
    },

    /* ---- the overshoot: her own kidneys take over ---- */

    {
      kind: "say",
      id: "h17",
      speaker: "dani",
      say: [
        [
          "Sodium's {na@1}, up from {na@0}.",
          "And she's poured out about {=2.5} litres of urine since four o'clock. It's like water — I've never seen a catheter bag fill like that.",
        ],
      ],
      variants: [
        {
          whenMed: "hctz",
          is: "continue",
          say: [
            [
              "Sodium's {na@1}, up from {na@0}.",
              "And she's poured out about {=2.5} litres of urine since four o'clock, clear as water. I did give her the hydrochlorothiazide at six, since it was still on the list.",
            ],
          ],
        },
      ],
    },

    {
      kind: "mcq",
      id: "h18",
      speaker: "okafor",
      tier: "bonus",
      domain: "pathophys",
      wager: true,
      say: [
        "Stop. That's the most important sentence anybody has said today.",
        [
          "She's up {=7} points in four hours against a ceiling of {=8} for the whole day, and she's making litres of dilute urine.",
          "What is happening to her?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "Her ADH has switched off now the stimulus is gone, so she's excreting free water on her own — and her sodium will keep climbing without us giving anything",
        },
        { id: "b", text: "The hypertonic saline has caused an osmotic diuresis" },
        { id: "c", text: "She's developed diabetes insipidus from the rapid osmotic shift" },
        { id: "d", text: "Her kidneys are failing to concentrate because of acute tubular injury" },
      ],
      correct: "a",
      why: {
        b: "An osmotic diuresis would produce concentrated urine full of solute. Hers is dilute — this is free water, not solute drag.",
        c: "The physiology looks similar and the cause isn't pituitary. Her ADH is appropriately suppressed, which is a normal response, not a new disease.",
        d: "Her creatinine is {cr@1}. Nothing here suggests tubular injury.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Yes. Take away the thiazide, take away the nausea, give her some volume — and the ADH that was holding all that water switches off.",
          "Her kidneys are now correcting her faster than we ever intended, and nothing we stop will slow it down. This is where the demyelination cases come from: not from the hypertonic saline, but from what happens after you fix the cause.",
        ],
      ],
      onWrong: [
        [
          "Her ADH has switched off. The thiazide is gone, the nausea has settled, she's had volume — every stimulus holding that water is now absent.",
          "So she's dumping free water on her own, and her sodium will keep rising whether or not we give her anything. This is where demyelination actually comes from — not the hypertonic saline, but the autocorrection nobody was watching for.",
        ],
      ],
    },

    {
      kind: "selectAll",
      id: "h19",
      speaker: "okafor",
      tier: "bonus",
      domain: "treatment",
      pairs: "h18",
      wager: true,
      say: ["So what do you do about it? And don't tell me how many."],
      choices: [
        { id: "d5w", text: "Start D5W to replace the free water she's losing" },
        { id: "ddavp", text: "Give desmopressin to switch her ADH back on deliberately" },
        { id: "stop_hts", text: "Stop the hypertonic saline" },
        { id: "q2h", text: "Sodium every two hours until the rate is under control" },
        { id: "target", text: "Accept the overshoot and aim to bring the sodium back down toward the 24-hour target" },
        { id: "watch", text: "Observe — her sodium is still low, so a fast rise doesn't matter yet" },
        { id: "iso", text: "Switch to isotonic saline to slow the rise" },
        { id: "furosemide", text: "Give furosemide to reduce her free water losses" },
        { id: "restrict", text: "Fluid restrict her to limit further correction" },
      ],
      correct: ["d5w", "ddavp", "stop_hts", "q2h", "target"],
      cost: { watch: "harmful", iso: "harmful", furosemide: "harmful", restrict: "harmful" },
      why: {
        ddavp:
          "This is the part that feels wrong and isn't. You are deliberately reinstating the hormone that caused the problem, because a controlled ADH clamp plus free water is the only way to actually stop a runaway autocorrection.",
        target:
          "Yes — relowering is legitimate and well described. If she's overshot, bringing her back down is better than hoping.",
        watch: "The absolute sodium is not the risk. The rate of change is, and hers is four times where it should be.",
        iso: "Isotonic saline is still hypertonic relative to the water she's excreting. It will not slow her down.",
        furosemide: "A loop diuretic increases free water clearance. That's the wrong direction, hard.",
        restrict: "Restricting her fluid restricts her intake while her kidneys keep excreting. It accelerates the very thing you're trying to stop.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Good. Free water in, desmopressin to close the tap, and measure every two hours until the line is flat.",
          "Most people find giving DDAVP here counterintuitive — it's the hormone we blamed all afternoon. But an uncontrolled autocorrection is more dangerous than a controlled one, and this is how you take control of it.",
        ],
      ],
      onWrong: [
        [
          "Free water — D5W — and desmopressin. You reinstate the hormone deliberately, which feels wrong and is right.",
          "An ADH clamp with free water replacement is the only reliable way to stop a runaway autocorrection. Stop the hypertonic saline, measure every two hours, and if she's already overshot, bring her back down. Relowering is a real and accepted manoeuvre.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "h20",
      draw: 2,
      speaker: "dani",
      say: ["Eleven o'clock — she's come back down a point and the urine's concentrated again."],
    },

    /* ---- the family, and the drug that started it ---- */

    {
      kind: "say",
      id: "h21",
      speaker: "eileen",
      say: [
        [
          "Where am I? Is that Nadia?",
          "I'm terribly thirsty. Could somebody get me a cup of tea?",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "h22",
      speaker: "nadia",
      tier: "core",
      domain: "communication",
      say: [
        "She knows me. She didn't this morning.",
        "Was this the blood pressure tablet? Because I'm the one who took her to get it changed.",
      ],
      choices: [
        {
          id: "a",
          text: "The tablet started it, but nobody could have predicted it — it's an uncommon reaction that turns up weeks later, and it's exactly why we'll check her sodium after any new one.",
        },
        { id: "b", text: "Yes, the tablet caused this. It shouldn't have been prescribed at her age." },
        { id: "c", text: "It's hard to say — several things were probably involved." },
        { id: "d", text: "These things happen. The important thing is she's getting better." },
      ],
      correct: "a",
      why: {
        b: "Thiazides are a reasonable first-line choice in a 78-year-old. Telling a daughter the prescription was negligent is both untrue and cruel to the person who took her to get it.",
        c: "Technically accurate and evasive. She asked a direct question because she's frightened she caused this.",
        d: "It dodges the question entirely. She will leave still believing it was her fault.",
      },
      rep: { who: "nadia", points: 3 },
      onRight: [
        [
          "So it wasn't — I kept thinking I should have noticed she was off.",
          "You'll write it down somewhere, won't you? So nobody gives it to her again.",
        ],
      ],
      onWrong: [
        "Right. I see.",
        "I did wonder whether I should have brought her in sooner.",
      ],
    },

    {
      kind: "mcq",
      id: "h23",
      speaker: "okafor",
      tier: "bonus",
      domain: "pathophys",
      wager: true,
      say: [
        "Last one, and it's the one that separates people who've memorised this from people who understand it.",
        [
          "Thiazides cause hyponatremia constantly. Loop diuretics are far more potent natriuretics and they almost never do.",
          "Why?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "Thiazides act in the cortical diluting segment and impair dilution while leaving the medullary gradient intact; loops dissipate that gradient, so they impair concentration too and free water still escapes",
        },
        { id: "b", text: "Loop diuretics are shorter acting, so there's less time for water retention to develop" },
        { id: "c", text: "Thiazides directly stimulate ADH release from the posterior pituitary" },
        { id: "d", text: "Loops cause more potassium loss, which protects against hyponatremia" },
      ],
      correct: "a",
      why: {
        b: "Duration isn't the mechanism — a long-acting loop still doesn't produce this, and short-acting thiazides still do.",
        c: "Thiazides don't stimulate ADH directly. Volume depletion and nausea can, but the dilution defect is the main event.",
        d: "Potassium loss makes hyponatremia worse, not better — losing intracellular potassium pulls sodium into cells.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "That's the whole thing in one sentence. Dilute urine is made in the cortical diluting segment, and a thiazide is a drug that specifically stops it being made.",
          "A loop knocks out the medullary gradient, so the kidney can't concentrate either — and water leaks out regardless of how much ADH is around.",
        ],
      ],
      onWrong: [
        [
          "It's about where in the nephron they act. Thiazides block the sodium chloride cotransporter in the distal convoluted tubule — the cortical diluting segment — which is precisely where dilute urine is generated. The medullary concentrating gradient is untouched, so ADH still works perfectly and water is retained.",
          "Loops block the thick ascending limb, which dissipates the medullary gradient. The kidney loses its ability to concentrate as well as dilute, so free water escapes no matter what ADH does.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "h24",
      draw: 3,
      speaker: "system",
      say: ["Morning labs resulted."],
    },

    {
      kind: "selectAll",
      id: "h25",
      speaker: "okafor",
      tier: "core",
      domain: "guidelines",
      say: [
        "Sodium {na@3}, up {=9} from arrival across nearly two days. She's oriented and she's eating.",
        "What's in the discharge plan?",
      ],
      choices: [
        { id: "never", text: "Hydrochlorothiazide documented as never to be re-prescribed" },
        { id: "alt", text: "An alternative antihypertensive, with a plan for who starts it" },
        { id: "recheck", text: "Sodium rechecked one to two weeks after any new medication" },
        { id: "nsaid", text: "Stop the regular ibuprofen and give her an alternative for her hips" },
        { id: "ssri", text: "Flag the sertraline to her GP as a contributing factor, without stopping it unilaterally" },
        { id: "diet", text: "Dietitian review — the tea-and-toast diet is part of the mechanism" },
        { id: "allergy", text: "Record it in the allergy and intolerance field, not just the discharge letter" },
        { id: "restrict_home", text: "Lifelong fluid restriction to 1 litre a day" },
        { id: "salt", text: "Advise her to add salt liberally to her food" },
        { id: "rechallenge", text: "Rechallenge the thiazide at a lower dose once she's home" },
      ],
      correct: ["never", "alt", "recheck", "nsaid", "ssri", "diet", "allergy"],
      cost: { rechallenge: "harmful", restrict_home: "wasteful", salt: "wasteful" },
      why: {
        allergy:
          "The single most durable thing you can do. Discharge letters get filed; the intolerance field pops up when somebody tries to prescribe it in four years.",
        diet: "Low solute intake is not incidental. You cannot excrete free water without solute to carry it — which is why this happens to thin elderly women who live on tea.",
        rechallenge:
          "Recurrence rates after rechallenge are high and she came in at 112. There is no dose of this drug that's worth that.",
        restrict_home: "She isn't going home with SIADH. Once the thiazide is gone the defect is gone — a lifelong restriction is a burden with no purpose.",
        salt: "Solves nothing and undermines the reason she was on an antihypertensive in the first place.",
        ssri: "Contributory rather than causative, and stopping a five-year SSRI from the ward is somebody else's decision made badly.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: ["That'll hold up. Good."],
      onWrong: ["We'll go through the gaps before you write it."],
    },

    {
      kind: "say",
      id: "h26",
      speaker: "okafor",
      say: [
        [
          "Two things worth keeping from today.",
          "The first is that nothing here was exotic. A common drug, a common diet, a common painkiller, and a sodium of 112 — the danger was in the combination and in how long it took anyone to check.",
        ],
        [
          "The second is the bit at four o'clock. You did not correct her too fast. She started correcting herself, and if Dani hadn't mentioned the catheter bag we'd have found out on Thursday when she stopped being able to swallow.",
          "Most of the harm in this diagnosis happens after the part everybody studies.",
        ],
      ],
    },
  ],
};
