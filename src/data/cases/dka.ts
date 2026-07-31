import type { MedicalCase } from "../../types/case";

/**
 * DKA — vertical slice.
 *
 * Beats 1-13 of a planned 22. This slice exercises every mechanic built so far:
 * picker, keypad, wagered MCQ, select-all at both ends of the size range,
 * slider, and a pharmacy read-back.
 *
 * Clinical note on the arrival chemistry: she has been vomiting for two days, so
 * the panel is deliberately written to carry a concurrent metabolic alkalosis.
 * Anion gap 29 (delta 17) against a bicarbonate drop of 12 gives a delta-delta
 * around 1.4 — which is what makes Ezra's ambush a real finding the history
 * predicts, rather than free-floating trivia.
 */
export const dkaCase: MedicalCase = {
  id: "dka-reyes",
  title: "Two days of vomiting",
  blurb: "A 24-year-old with type 1 diabetes, three days out of glargine.",

  patient: {
    name: "Marisol Reyes",
    age: 24,
    line: "24-year-old woman with type 1 diabetes, presenting with two days of vomiting.",
    weightKg: 68,
    history: [
      "Type 1 diabetes, diagnosed age 9",
      "Managed on multiple daily injections — glargine at night, lispro with meals",
      "No prior DKA admissions",
    ],
    allergies: "No known drug allergies",
    meds: [
      "Insulin glargine 22 units nightly — ran out three days ago",
      "Insulin lispro, sliding scale with meals — has been halving doses to stretch supply",
    ],
    social:
      "Turned 24 in March and came off her parents' insurance. Roommate drove her in. Graduate student.",
  },

  vitals: [
    { time: "22:04", hr: 122, bp: "96/58", rr: 28, temp: "37.1 °C", spo2: 99 },
    { time: "23:15", hr: 108, bp: "104/64", rr: 24, temp: "37.0 °C", spo2: 99 },
  ],

  analytes: [
    { id: "glucose", name: "Glucose", ref: "70–99 mg/dL", low: 70, high: 99 },
    { id: "na", name: "Sodium", ref: "135–145", low: 135, high: 145 },
    { id: "k", name: "Potassium", ref: "3.5–5.1", low: 3.5, high: 5.1, decimals: 1 },
    { id: "cl", name: "Chloride", ref: "98–107", low: 98, high: 107 },
    { id: "hco3", name: "Bicarbonate", ref: "22–29", low: 22, high: 29 },
    { id: "ag", name: "Anion gap", ref: "8–12", low: 8, high: 12 },
    { id: "bun", name: "BUN", ref: "7–20", low: 7, high: 20 },
    { id: "cr", name: "Creatinine", ref: "0.6–1.1", low: 0.6, high: 1.1, decimals: 1 },
    { id: "ph", name: "pH", ref: "7.35–7.45", low: 7.35, high: 7.45, decimals: 2 },
    { id: "pco2", name: "pCO₂", ref: "35–45", low: 35, high: 45 },
    { id: "bhb", name: "β-hydroxybutyrate", ref: "<0.6 mmol/L", high: 0.6, decimals: 1 },
  ],

  draws: [
    {
      time: "22:10",
      label: "On arrival",
      values: {
        glucose: 642, na: 129, k: 5.4, cl: 88, hco3: 12, ag: 29,
        bun: 34, cr: 1.6, ph: 7.15, pco2: 26, bhb: 6.8,
      },
    },
    {
      time: "23:15",
      label: "After 2 L",
      values: {
        glucose: 486, na: 132, k: 3.1, cl: 95, hco3: 14, ag: 23,
        bun: 30, cr: 1.3, ph: 7.22, pco2: 28, bhb: 5.4,
      },
    },
    {
      time: "02:30",
      values: {
        glucose: 268, na: 136, k: 3.7, cl: 103, hco3: 18, ag: 15,
        bun: 22, cr: 1.0, ph: 7.32, pco2: 35, bhb: 1.4,
      },
    },
    {
      time: "06:00",
      values: {
        glucose: 186, na: 138, k: 3.9, cl: 109, hco3: 22, ag: 7,
        bun: 16, cr: 0.9, ph: 7.37, pco2: 38, bhb: 0.4,
      },
    },
  ],

  beats: [
    {
      kind: "say",
      id: "b1",
      speaker: "dani",
      say: [
        [
          "Bed four. Marisol Reyes, twenty-four, type one diabetic.",
          "Two days of vomiting, roommate drove her in. Heart rate one twenty-two, pressure ninety-six over fifty-eight, respirations twenty-eight.",
        ],
        "Her meter just says HI. That's all it says.",
      ],
    },
    {
      kind: "say",
      id: "b2",
      speaker: "dani",
      say: [
        [
          "She's breathing deep and fast but she's talking to me and protecting her airway. I've got two large-bore IVs in.",
          "She told me she ran out of her long-acting three days ago. Aged off her parents' insurance in March.",
        ],
      ],
    },

    {
      kind: "picker",
      id: "b3",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: [
        "Alright. She's on the monitor and she's got access.",
        "Tell me what you're sending and what you're starting. Don't shotgun it — I want to see what you actually think is going on.",
      ],
      grouped: true,
      show: [
        "bmp", "vbg", "osm", "lactate", "lipase",
        "cbc", "coags",
        "bhb", "a1c",
        "ua", "urine_cx", "blood_cx",
        "cxr", "ct_head", "ct_abd",
        "ecg", "trop",
        "poc_glucose", "poc_preg", "urine_ketones",
        "ns_bolus", "insulin_bolus",
      ],
      correct: ["bmp", "vbg", "bhb", "cbc", "ua", "ecg", "poc_glucose", "poc_preg", "ns_bolus"],
      critical: ["bmp", "vbg", "bhb", "ecg"],
      cost: {
        insulin_bolus: "harmful",
        ct_abd: "harmful",
        ct_head: "wasteful",
        trop: "wasteful",
        coags: "wasteful",
        urine_ketones: "wasteful",
      },
      why: {
        ecg: "Her potassium is unknown and about to matter enormously. The ECG is the fastest look you get at whether it's already dangerous.",
        insulin_bolus:
          "Insulin before you know her potassium is how you cause an arrest. And the bolus adds nothing when the infusion starts promptly.",
        ct_abd:
          "Contrast on a creatinine of 1.6, in a patient whose vomiting is fully explained by her metabolic state.",
        urine_ketones:
          "The dipstick uses nitroprusside, which detects acetoacetate and not β-hydroxybutyrate. In early DKA it understates how sick she is. Send the serum β-hydroxybutyrate.",
        a1c: "Not wrong, and worth having before she leaves — just not part of resuscitating her.",
        poc_preg: "She's 24. It changes what you image and what you prescribe.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Good. That's a workup, not a shotgun.",
          "Fluids are running. Let's see what comes back.",
        ],
      ],
      onWrong: [
        [
          "Some of that I'd fight you on.",
          "Fluids are running either way. Let's see what comes back.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "b4",
      draw: 0,
      speaker: "system",
      say: ["Chemistry, gas, and β-hydroxybutyrate resulted."],
    },

    {
      kind: "keypad",
      id: "b5",
      speaker: "okafor",
      tier: "foundation",
      domain: "diagnosis",
      say: ["Before you say the word — give me her anion gap."],
      answer: 29,
      tolerance: 0,
      rep: { who: "okafor", points: 1 },
      onRight: [
        [
          "Twenty-nine. Sodium one twenty-nine, chloride eighty-eight, bicarb twelve.",
          "She's in DKA. Glucose over two fifty, gap acidosis, ketones through the roof.",
        ],
      ],
      onWrong: [
        [
          "Sodium minus chloride minus bicarbonate. One twenty-nine, minus eighty-eight, minus twelve.",
          "Twenty-nine. She's in DKA — glucose over two fifty, gap acidosis, ketones through the roof.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "b6",
      speaker: "ezra",
      tier: "bonus",
      domain: "pathophys",
      wager: true,
      say: [
        "Sorry — can I ask something?",
        [
          "Her gap went up by seventeen. But her bicarbonate only fell by twelve, from twenty-four down to twelve.",
          "If it were only the ketoacidosis, those should move together, right? So doesn't that mean there's a second thing going on?",
        ],
      ],
      choices: [
        { id: "a", text: "Yes — a concurrent metabolic alkalosis, from two days of vomiting" },
        { id: "b", text: "Yes — a concurrent non-gap metabolic acidosis" },
        { id: "c", text: "No — a delta ratio like that is what you expect in pure DKA" },
        { id: "d", text: "No — the chloride is likely a lab error" },
      ],
      correct: "a",
      why: {
        b: "A concurrent non-gap acidosis pushes the ratio below 1 — the bicarbonate would have fallen further than the gap rose, not less. That comes later, after she's had several liters of saline.",
        c: "In pure DKA the two move roughly together, a ratio near 1. Hers is about 1.4.",
        d: "The chloride is low because she's been vomiting hydrochloric acid for two days. That's the finding, not an error.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        [
          "Oh. Yeah, that — that's what I was going to say.",
          "Two days of vomiting. Losing hydrogen and chloride. So the alkalosis is propping her bicarbonate up.",
        ],
      ],
      onWrong: [
        [
          "So the delta ratio is about 1.4 — the gap rose more than the bicarbonate fell.",
          "She's been vomiting hydrochloric acid for two days. There's a metabolic alkalosis underneath propping her bicarbonate up, which means her acidosis is worse than that number looks.",
        ],
      ],
    },

    {
      kind: "selectAll",
      id: "b7",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: [
        "Right. Now — before a single unit of insulin goes anywhere near her.",
        "What do you want? And don't tell me how many there are.",
      ],
      choices: [
        { id: "fluids", text: "Keep isotonic fluids running" },
        { id: "recheck_k", text: "Recheck her potassium after the first liter" },
        { id: "tele", text: "Continuous telemetry" },
        { id: "q1h", text: "Hourly point-of-care glucose" },
        { id: "io", text: "Strict intake and output" },
        { id: "bicarb", text: "Push an amp of bicarbonate" },
        { id: "bolus", text: "Regular insulin IV bolus first" },
        { id: "k_now", text: "Start repleting potassium now" },
        { id: "half_ns", text: "Switch to half-normal saline for the initial fluid" },
        { id: "abx", text: "Empiric broad-spectrum antibiotics" },
        { id: "glargine", text: "Give her home glargine dose subcutaneously" },
        { id: "zofran", text: "Ondansetron for the vomiting" },
      ],
      correct: ["fluids", "recheck_k", "tele", "q1h", "io"],
      cost: {
        bicarb: "harmful",
        bolus: "harmful",
        k_now: "harmful",
        half_ns: "wasteful",
      },
      why: {
        recheck_k:
          "Her potassium is 5.4 and that number is lying to you. Total body potassium is severely depleted — you need to know where it actually is before insulin drives it anywhere.",
        k_now: "At a potassium of 5.4 you don't replete. You recheck.",
        bicarb:
          "No mortality benefit, and it drives potassium down further in someone who cannot afford it.",
        half_ns: "She's volume depleted and hypotensive. Isotonic first, always.",
        abx: "She's afebrile with a white count you'd expect from the stress response alone. Not unreasonable to think about — not something to start.",
        glargine:
          "Early basal insulin has some evidence behind it, but not before you know her potassium and not as your opening move.",
        zofran: "Reasonable. Won't hurt her. Won't fix anything either.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. That's the setup. Now you can think about insulin."],
      onWrong: ["We'll come back to some of those. Let's talk about insulin."],
    },

    {
      kind: "slider",
      id: "b8",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: ["She's sixty-eight kilos. What rate do you want the insulin infusion started at?"],
      min: 0.02,
      max: 0.2,
      step: 0.01,
      start: 0.06,
      accept: [0.09, 0.11],
      unit: "units/kg/hr",
      decimals: 2,
      derived: { label: "units/hr", perUnit: 68, decimals: 1 },
      rep: { who: "okafor", points: 1 },
      onRight: ["Point one per kilo per hour. Write it."],
      onWrong: [
        [
          "Point one units per kilogram per hour. That's the number, and it hasn't changed in twenty years.",
          "Write it.",
        ],
      ],
    },

    {
      kind: "confirm",
      id: "b9",
      speaker: "pharmacy",
      tier: "core",
      domain: "guidelines",
      say: [
        "Pharmacy — calling to verify an order on Reyes in bed four.",
        "I have regular insulin infusion, 10u per hour. Confirming before I release it?",
      ],
      affirmLabel: "Confirm it",
      denyLabel: "Hold on",
      correct: "deny",
      followUp: {
        prompt: "What's wrong with it?",
        choices: [
          { id: "a", text: "The dose — she's 68 kg, so 0.1 units/kg/hr is 6.8 units/hr, not 10" },
          { id: "b", text: "Nothing. Ten units an hour is a standard adult starting rate" },
          { id: "c", text: "It should be a bolus first, then the infusion" },
          { id: "d", text: "The rate is right, but it needs to run in half-normal saline" },
        ],
        correct: "a",
        why: {
          b: "There is no standard flat rate. It's weight-based, and at 10 units an hour she's getting nearly 50% more insulin than intended.",
          c: "The bolus question is real, but it isn't what's wrong with this order.",
          d: "The diluent isn't the problem here.",
        },
      },
      rep: { who: "pharmacy", points: 3 },
      onRight: [
        [
          "That's what I had too. Six point eight an hour, I'll fix it.",
          "And for what it's worth — whoever typed that wrote it as one-zero-u. That 'u' is on the do-not-use list for exactly this reason. It reads as a hundred.",
        ],
      ],
      onWrong: [
        [
          "I'm going to push back on that one. She's sixty-eight kilos, so point one per kilo is six point eight an hour, not ten.",
          "Also — that order was written as one-zero-u. The 'u' abbreviation is on the do-not-use list because it reads as a hundred. I'll get it rewritten.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "b10",
      draw: 1,
      speaker: "dani",
      say: [
        [
          "Before you hang that — her repeat chem just came back.",
          "Potassium's three point one.",
        ],
      ],
    },

    {
      kind: "selectAll",
      id: "b11",
      speaker: "dani",
      tier: "core",
      domain: "complications",
      say: ["The insulin's at the bedside. Do you want me to start it?"],
      choices: [
        { id: "hold", text: "Hold the insulin" },
        { id: "replete", text: "Replete potassium IV" },
        { id: "fluids", text: "Keep the fluids running" },
        { id: "recheck", text: "Recheck the potassium before starting insulin" },
        { id: "low_rate", text: "Start the insulin, just at a lower rate" },
        { id: "bicarb", text: "Give bicarbonate to shift the potassium back" },
        { id: "stop_fluids", text: "Stop the fluids until the potassium corrects" },
        { id: "ecg", text: "Get a repeat ECG" },
      ],
      correct: ["hold", "replete", "fluids", "recheck"],
      cost: {
        low_rate: "harmful",
        bicarb: "harmful",
        stop_fluids: "harmful",
      },
      why: {
        hold: "Below 3.3, insulin waits. This is the single most dangerous moment in the case.",
        low_rate:
          "A lower rate still drives potassium into cells. There is no rate that is safe here — the answer is not yet.",
        bicarb: "Bicarbonate would push her potassium down further. Exactly the wrong direction.",
        stop_fluids:
          "The fluids aren't the problem. She's still volume depleted and they're doing real work on her glucose.",
        ecg: "Reasonable at 3.1. Not the thing that saves her.",
      },
      rep: { who: "dani", points: 3 },
      onRight: [
        [
          "That's what I thought. I'll get the potassium hung and hold the insulin.",
          "Forty milliequivalents — I'll run it central, not through the twenty-two in her hand.",
        ],
      ],
      onWrong: [
        [
          "I'm going to hold it until you're sure.",
          "Three point one is below the cutoff. Potassium first, insulin after — I've seen this go badly.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "b12",
      speaker: "okafor",
      tier: "core",
      domain: "pathophys",
      pairs: "b11",
      say: [
        "Dani just saved you. So tell me why.",
        "Why would starting that insulin have been dangerous?",
      ],
      choices: [
        {
          id: "a",
          text: "Insulin drives potassium into cells, and her total body potassium is already depleted",
        },
        { id: "b", text: "Insulin causes a rapid osmolar shift and risks cerebral edema" },
        { id: "c", text: "Insulin transiently worsens the acidosis before it improves it" },
        { id: "d", text: "Insulin can't take effect until the acidosis is corrected" },
      ],
      correct: "a",
      why: {
        b: "Cerebral edema is a real DKA complication and mostly a pediatric one — but it isn't what the potassium is telling you right now.",
        c: "It doesn't. Insulin shuts off ketogenesis; the acidosis improves.",
        d: "Insulin works fine in an acidotic patient. That's why it's the treatment.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Right. And notice what happened — she arrived at five point four and everyone relaxed.",
          "Her total body potassium was never five point four. It was depleted the whole time. The acidosis and the insulin deficiency were holding it in the serum where you could see it.",
        ],
        "Two liters in, and the truth showed up.",
      ],
      onWrong: [
        [
          "Insulin drives potassium into cells. That's the whole answer.",
          "She arrived at five point four and everyone relaxed. But her total body potassium was never five point four — the acidosis and the insulin deficiency were holding it in the serum where you could see it.",
        ],
        "Two liters in, and the truth showed up.",
      ],
    },

    {
      kind: "say",
      id: "b13",
      speaker: "okafor",
      say: [
        [
          "Alright. Potassium's going in, fluids are running, insulin waits.",
          "Go see her. She's been lying there for an hour listening to us talk about her, and nobody's told her anything.",
        ],
      ],
    },
  ],
};
