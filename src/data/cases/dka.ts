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
    { time: "02:30", hr: 94, bp: "112/70", rr: 20, temp: "36.9 °C", spo2: 99 },
    { time: "06:00", hr: 82, bp: "118/74", rr: 16, temp: "36.8 °C", spo2: 99 },
  ],

  analytes: [
    { id: "glucose", name: "Glucose", ref: "70–99 mg/dL", low: 70, high: 99 },
    { id: "na", name: "Sodium", ref: "135–145", low: 135, high: 145 },
    { id: "k", name: "Potassium", ref: "3.5–5.1", low: 3.5, high: 5.1, decimals: 1 },
    { id: "cl", name: "Chloride", ref: "98–107", low: 98, high: 107 },
    { id: "hco3", name: "Bicarb", ref: "22–29", low: 22, high: 29 },
    // Hidden until b5, where the resident is asked to calculate it.
    { id: "ag", name: "Anion gap", ref: "8–12", low: 8, high: 12, hidden: true },
    { id: "bun", name: "BUN", ref: "7–20", low: 7, high: 20 },
    { id: "cr", name: "Creatinine", ref: "0.6–1.1", low: 0.6, high: 1.1, decimals: 1 },
    { id: "ph", name: "pH", ref: "7.35–7.45", low: 7.35, high: 7.45, decimals: 2 },
    { id: "pco2", name: "pCO₂", ref: "35–45", low: 35, high: 45 },
    { id: "bhb", name: "β-OHB", ref: "<0.6 mmol/L", high: 0.6, decimals: 1 },
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
          "Two days of vomiting, roommate drove her in. Heart rate {=122}, pressure {=96/58}, respirations {=28}.",
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
        "Bloods first. What are you sending?",
      ],
      grouped: true,
      show: [
        "bmp", "vbg", "abg", "osm", "lactate", "lipase",
        "cbc", "coags",
        "bhb", "a1c",
        "ua", "urine_cx", "blood_cx",
      ],
      correct: ["bmp", "vbg", "bhb", "cbc", "ua"],
      critical: ["bmp", "vbg", "bhb"],
      cost: { coags: "wasteful", abg: "wasteful" },
      why: {
        bhb: "The serum ketone, not the urine one. We'll come back to why that distinction matters.",
        coags: "She isn't bleeding and isn't on anything. This is reflex, not reasoning.",
        abg: "You sent a venous one as well. Pick a lane — and I'm about to ask you which.",
        osm: "Reasonable if you're weighing DKA against a hyperosmolar picture. Not required here.",
        lipase: "Defensible — she's vomiting, and DKA raises lipase anyway, which is its own trap.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. Tight list."],
      onWrong: ["We'll talk about a couple of those."],
    },

    {
      kind: "mcq",
      id: "b3b",
      speaker: "okafor",
      tier: "foundation",
      domain: "diagnosis",
      say: ["While that's running — you sent a venous gas rather than an arterial one. Defend it."],
      choices: [
        {
          id: "a",
          text: "Venous pH and bicarbonate track arterial closely enough to manage DKA, and it spares her an arterial puncture",
        },
        { id: "b", text: "Venous sampling is more accurate for bicarbonate than arterial" },
        { id: "c", text: "Arterial puncture is contraindicated in severe acidosis" },
        { id: "d", text: "They're interchangeable — venous gives you the same information in every respect" },
      ],
      correct: "a",
      why: {
        b: "Neither is more accurate. Venous is close enough for the two numbers that drive management, which is a different claim.",
        c: "It isn't contraindicated. It's just painful and, here, unnecessary.",
        d: "This is the trap. Venous pCO₂ and oxygenation are not interchangeable with arterial — if you needed those, you'd need the artery.",
      },
      rep: { who: "okafor", points: 1 },
      onRight: [
        "Right. pH runs about 0.03 lower and bicarbonate within a couple of points. For this, that's plenty.",
      ],
      onWrong: [
        [
          "Venous pH sits about 0.03 below arterial and the bicarbonate is within a couple of points — close enough for every decision you'll make tonight.",
          "It's not a free substitution though. If you needed a real pCO₂ or an oxygen saturation, you'd need the artery.",
        ],
      ],
    },

    {
      kind: "picker",
      id: "b3c",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: ["Now at the bedside. What do you want on her, and what are you starting?"],
      grouped: true,
      show: [
        "ecg", "trop", "tele",
        "poc_glucose", "poc_preg", "urine_ketones",
        "cxr", "ct_head", "ct_abd",
        "ns_bolus", "half_ns", "insulin_bolus",
      ],
      correct: ["ecg", "tele", "poc_glucose", "poc_preg", "ns_bolus"],
      critical: ["ecg", "ns_bolus"],
      cost: {
        insulin_bolus: "harmful",
        ct_abd: "harmful",
        half_ns: "harmful",
        ct_head: "wasteful",
        trop: "wasteful",
        urine_ketones: "wasteful",
      },
      why: {
        ecg: "Her potassium is unknown and about to matter enormously. This is the fastest look at whether it's already dangerous.",
        insulin_bolus:
          "Insulin before you know her potassium is how you cause an arrest. And the bolus adds nothing once the infusion is running.",
        half_ns: "She's hypotensive and volume depleted. Isotonic first, always.",
        ct_abd: "Contrast on a creatinine of 1.6, for vomiting that's fully explained by her metabolic state.",
        urine_ketones:
          "The dipstick uses nitroprusside, which sees acetoacetate and is blind to β-hydroxybutyrate. In early DKA it understates her.",
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
      unlocks: ["ag"],
      rep: { who: "okafor", points: 1 },
      onRight: [
        [
          "{ag@0}. Sodium {na@0}, chloride {cl@0}, bicarb {hco3@0}.",
          "She's in DKA. Glucose over {=250}, gap acidosis, ketones through the roof.",
        ],
      ],
      onWrong: [
        [
          "Sodium minus chloride minus bicarbonate. {na@0}, minus {cl@0}, minus {hco3@0}.",
          "{ag@0}. She's in DKA — glucose over {=250}, gap acidosis, ketones through the roof.",
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
          "Her gap went up by {=17}. But her bicarbonate only fell by {=12}, from {=24} down to {hco3@0}.",
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
          "So the delta ratio is about {=1.4} — the gap rose more than the bicarbonate fell.",
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
      say: ["She's {=68} kilos. What rate do you want the insulin infusion started at?"],
      min: 0.02,
      max: 0.2,
      step: 0.01,
      start: 0.06,
      accept: [0.09, 0.11],
      unit: "units/kg/hr",
      decimals: 2,
      derived: { label: "units/hr", perUnit: 68, decimals: 1 },
      rep: { who: "okafor", points: 1 },
      onRight: ["{=0.1} per kilo per hour. Write it."],
      onWrong: [
        [
          "{=0.1} units per kilogram per hour. That's the number, and it hasn't changed in 20 years.",
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
        "I have regular insulin infusion, {=10u} per hour. Confirming before I release it?",
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
          "That's what I had too. {=6.8} an hour, I'll fix it.",
          "And for what it's worth — whoever typed that wrote it as {=10u}. That 'u' is on the do-not-use list for exactly this reason. It reads as {=100}.",
        ],
      ],
      onWrong: [
        [
          "I'm going to push back on that one. She's {=68} kilos, so {=0.1} per kilo is {=6.8} an hour, not {=10}.",
          "Also — that order was written as {=10u}. The 'u' abbreviation is on the do-not-use list because it reads as {=100}. I'll get it rewritten.",
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
          "Potassium's {k@1}.",
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
          "{=40} milliequivalents — I'll run it central, not through the {=22}-gauge in her hand.",
        ],
      ],
      onWrong: [
        [
          "I'm going to hold it until you're sure.",
          "{k@1} is below the cutoff. Potassium first, insulin after — I've seen this go badly.",
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
          "Right. And notice what happened — she arrived at {k@0} and everyone relaxed.",
          "Her total body potassium was never {k@0}. It was depleted the whole time. The acidosis and the insulin deficiency were holding it in the serum where you could see it.",
        ],
        "{=2} litres in, and the truth showed up.",
      ],
      onWrong: [
        [
          "Insulin drives potassium into cells. That's the whole answer.",
          "She arrived at {k@0} and everyone relaxed. But her total body potassium was never {k@0} — the acidosis and the insulin deficiency were holding it in the serum where you could see it.",
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

    /* ---------------------------------------------------------------- */
    /* The patient finally gets a voice                                  */
    /* ---------------------------------------------------------------- */

    {
      kind: "say",
      id: "b14",
      speaker: "marisol",
      say: [
        [
          "Are you the doctor? Nobody will tell me anything.",
          "My chest hurts from breathing like this and there's a bag of something going into my arm and I don't know what it is.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "b15",
      speaker: "marisol",
      tier: "core",
      domain: "communication",
      say: [
        "Why do I need so much fluid? I feel like I'm drowning. Can you slow it down?",
      ],
      choices: [
        {
          id: "a",
          text: "You've lost several litres — your kidneys have been dumping sugar and water for two days. The fluid is what lets them start clearing it again.",
        },
        { id: "b", text: "It's the protocol for what you have. We'll slow it down when we can." },
        { id: "c", text: "The fluid dilutes the acid in your blood, which is what's making you breathe like that." },
        { id: "d", text: "We need to flush the ketones out of your system." },
      ],
      correct: "a",
      why: {
        b: "True, and useless to her. She asked why, and a protocol isn't a reason — it's a way of not answering.",
        c: "Dilution isn't the mechanism, and telling a frightened patient something plausible-but-wrong costs you the next explanation.",
        d: "Ketones aren't flushed out. Insulin switches off the production; the fluid restores her circulation and renal clearance.",
      },
      rep: { who: "marisol", points: 2 },
      onRight: [
        [
          "Okay. So it's not — I thought you were just filling me up with water.",
          "Nobody's said any of that. Thank you.",
        ],
      ],
      onWrong: [
        "Right. Okay.",
        "I still don't really understand, but okay.",
      ],
    },

    /* ---------------------------------------------------------------- */
    /* The road not taken — reachable only by asking about it            */
    /* ---------------------------------------------------------------- */

    {
      kind: "mcq",
      id: "b16",
      speaker: "okafor",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "While we wait on the repeat gas — a hypothetical.",
        [
          "Say she'd walked in with everything else exactly the same. The vomiting, the deep breathing, gap of twenty-nine, ketones through the roof.",
          "But her glucose was a hundred and eighty. Is it still DKA?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "Yes — euglycemic DKA. Ketoacidosis with a near-normal glucose, classically with SGLT2 inhibitors, pregnancy, or prolonged fasting.",
        },
        { id: "b", text: "No — a glucose above 250 is required to make the diagnosis." },
        { id: "c", text: "No — with that glucose it would be a starvation ketosis, which doesn't need insulin." },
        { id: "d", text: "Yes, but only in pregnancy — otherwise the glucose has to be high." },
      ],
      correct: "a",
      why: {
        b: "The glucose threshold is a feature of the typical presentation, not a requirement. Treating it as one is how euglycemic DKA gets sent home.",
        c: "Starvation ketosis doesn't produce a gap of twenty-nine. And the treatment for a gap that size is insulin and dextrose either way.",
        d: "Pregnancy is one cause. SGLT2 inhibitors are the one you'll actually meet, and they're the reason this matters more than it used to.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Good. The glucose is the part everyone anchors on, and it's the least important of the three.",
          "Gap, ketones, and a reason to be insulin-deficient. That's the diagnosis.",
        ],
      ],
      onWrong: [
        [
          "Euglycemic DKA. Same acidosis, same ketones, glucose that doesn't look alarming.",
          "SGLT2 inhibitors are the reason you'll see it. The drug keeps spilling glucose in the urine while the ketogenesis runs unchecked underneath — so the number that would have made you worry never shows up.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "b17",
      draw: 2,
      speaker: "dani",
      say: [
        [
          "{t@2}. Potassium's up to {k@2}, so the insulin's been running about two hours.",
          "Repeat chem is on the screen.",
        ],
      ],
    },

    /* ---------------------------------------------------------------- */
    /* Glucose vs gap — the classic error                                */
    /* ---------------------------------------------------------------- */

    {
      kind: "mcq",
      id: "b18",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: [
        "Glucose {glucose@2}, coming down about {=70} an hour.",
        "When do you change her fluids?",
      ],
      choices: [
        { id: "a", text: "At around 200 — add dextrose and keep the insulin running at the same rate" },
        { id: "b", text: "At around 200 — add dextrose and halve the insulin rate" },
        { id: "c", text: "When the anion gap closes, whatever the glucose is doing" },
        { id: "d", text: "Now — 268 is close enough, and you don't want to overshoot" },
      ],
      correct: "a",
      why: {
        b: "Halving the insulin is the instinct that keeps the gap open. The dextrose exists precisely so you don't have to cut the insulin.",
        c: "By the time the gap closes at this rate she'd be profoundly hypoglycemic. The glucose sets the dextrose timing; the gap sets when insulin stops.",
        d: "Adding dextrose this early just means more insulin and more sugar chasing each other. Two hundred is the number.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["{=200}. Dextrose goes up, insulin keeps going."],
      onWrong: [
        "At {=200} you add dextrose, and the insulin rate does not change.",
      ],
    },

    {
      kind: "mcq",
      id: "b19",
      speaker: "okafor",
      tier: "core",
      domain: "pathophys",
      pairs: "b18",
      say: ["So why does the insulin keep running once her sugar is normal?"],
      choices: [
        {
          id: "a",
          text: "The insulin is treating the ketoacidosis, not the glucose — it runs until the gap closes, and the dextrose is what makes that possible",
        },
        { id: "b", text: "Stopping insulin abruptly causes rebound hyperglycemia" },
        { id: "c", text: "The dextrose would cause hypoglycemia without insulin to cover it" },
        { id: "d", text: "Insulin is needed to keep driving potassium back into the cells" },
      ],
      correct: "a",
      why: {
        b: "Rebound is real but it's a consequence, not the reason. The reason is that the ketogenesis hasn't stopped yet.",
        c: "Backwards — the dextrose is there to protect her from the insulin, not the other way round.",
        d: "Her potassium is being repleted directly. That isn't what the drip is for.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Right. The sugar was never the disease.",
          "The gap is the disease, and insulin is the only thing that turns off ketogenesis. Dextrose is just how you keep giving it.",
        ],
      ],
      onWrong: [
        [
          "The sugar was never the disease. The gap is.",
          "Insulin is the only thing that switches off ketogenesis — so it runs until the gap closes, and the dextrose is what lets you keep it running without dropping her sugar through the floor.",
        ],
      ],
    },

    /* ---------------------------------------------------------------- */
    /* Ezra's second ambush — right about the chemistry, wrong about her  */
    /* ---------------------------------------------------------------- */

    {
      kind: "mcq",
      id: "b20",
      speaker: "ezra",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "Um — I pulled up her urine dip from an hour ago.",
        [
          "On arrival her urine ketones were moderate. Now they're large.",
          "Everything else is getting better but that's getting worse. Is she actually deteriorating?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "No — the dipstick detects acetoacetate, not β-hydroxybutyrate. As she improves, BHB converts to acetoacetate, so the urine test looks worse while she gets better.",
        },
        { id: "b", text: "Yes — the ketosis is still worsening despite the insulin, and the rate should go up" },
        { id: "c", text: "No — urine ketones lag by several hours, so that dip still reflects her arrival state" },
        { id: "d", text: "No — the dipstick is picking up acetone, which she's clearing through her lungs" },
      ],
      correct: "a",
      why: {
        b: "Her serum β-hydroxybutyrate has fallen from 6.8 to 1.4 and her gap from 29 to 15. She is unambiguously better. Chasing the dipstick here would be treating a test, not a patient.",
        c: "It isn't a lag. It's the assay measuring the wrong ketone — and it gets *more* positive as she recovers, not less.",
        d: "Nitroprusside doesn't detect acetone meaningfully. It's the acetoacetate that's rising as BHB is oxidised back to it.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        [
          "Oh — so the test gets more positive as she gets better.",
          "That seems like a bad test.",
        ],
      ],
      onWrong: [
        [
          "The dipstick is a nitroprusside reaction. It sees acetoacetate and it's essentially blind to β-hydroxybutyrate.",
          "In deep DKA most of the ketone load is BHB, so the dip understates her. As she recovers, BHB is oxidised back to acetoacetate — and the test climbs while the patient improves. Follow the serum BHB and the gap. Never the dipstick.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "b21",
      draw: 3,
      speaker: "system",
      say: ["06:00 — chemistry and gas resulted."],
    },

    /* ---------------------------------------------------------------- */
    /* The pearl: she's better, and she has a brand-new acidosis          */
    /* ---------------------------------------------------------------- */

    {
      kind: "mcq",
      id: "b22",
      speaker: "okafor",
      tier: "bonus",
      domain: "complications",
      wager: true,
      say: [
        "Gap's {ag@3}. Bicarb's {hco3@3}. She's through it.",
        [
          "But look at her chloride. {cl@0} on arrival, {cl@3} now.",
          "Her pH is still {ph@3} and her bicarbonate is only just normal. What happened?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "A hyperchloremic non-gap acidosis from the saline — you've given her several litres of a fluid with a chloride of 154",
        },
        { id: "b", text: "The alkalosis from her vomiting has resolved, unmasking the true bicarbonate" },
        { id: "c", text: "Ongoing ketoacidosis — the gap has closed but the acid load hasn't cleared" },
        { id: "d", text: "A renal tubular acidosis from the acute kidney injury she arrived with" },
      ],
      correct: "a",
      why: {
        b: "That's happening too, and it's part of the picture — but it doesn't explain a chloride of 109. Only the saline does.",
        c: "The gap closing *is* the ketoacidosis clearing. Whatever acidosis is left has no gap, which means it isn't ketones.",
        d: "Her creatinine is back to 0.9. This was prerenal and it resolved; the chloride is the finding here.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Good. You cured the ketoacidosis and gave her a different acidosis on the way.",
          "It's benign and it resolves on its own. But if you didn't know it was coming, you'd look at that bicarb, decide she wasn't better, and keep the insulin running into a hypoglycemic event.",
        ],
        "Which is the whole reason we follow the gap and not the bicarbonate.",
      ],
      onWrong: [
        [
          "Normal saline has a chloride of {=154}. Give someone {=4} litres of it and you get a hyperchloremic, non-gap acidosis.",
          "It's benign and it self-corrects. But if you don't know it's coming, you look at that bicarbonate, decide she isn't better, and keep the insulin running into a hypoglycemic event.",
        ],
        "Which is the whole reason we follow the gap and not the bicarbonate.",
      ],
    },

    /* ---------------------------------------------------------------- */
    /* Getting her off the drip                                          */
    /* ---------------------------------------------------------------- */

    {
      kind: "selectAll",
      id: "b23",
      speaker: "pharmacy",
      tier: "core",
      domain: "guidelines",
      say: [
        "Pharmacy again — I've got a request to stop the insulin infusion on Reyes.",
        "Before I take it off the pump: what's your transition plan?",
      ],
      choices: [
        { id: "basal", text: "Give subcutaneous long-acting insulin first" },
        { id: "overlap", text: "Overlap it with the drip for one to two hours" },
        { id: "gap", text: "Confirm the anion gap has closed" },
        { id: "eating", text: "Confirm she's tolerating oral intake" },
        { id: "scale", text: "Order a short-acting correction scale with meals" },
        { id: "stop_now", text: "Stop the drip as soon as the glucose is under 200" },
        { id: "no_overlap", text: "Stop the drip and give the long-acting at the same moment" },
        { id: "bicarb_norm", text: "Wait for the bicarbonate to fully normalise before transitioning" },
        { id: "scale_only", text: "Cover her with a correction scale alone for the first 24 hours" },
        { id: "discharge", text: "Plan discharge once she's off the drip" },
      ],
      correct: ["basal", "overlap", "gap", "eating", "scale"],
      cost: {
        stop_now: "harmful",
        no_overlap: "harmful",
        scale_only: "harmful",
        discharge: "harmful",
        bicarb_norm: "wasteful",
      },
      why: {
        overlap:
          "IV insulin has a half-life of minutes. Stop the drip before the subcutaneous dose is working and she's insulin-deficient again inside an hour — straight back into ketosis.",
        gap: "The gap, not the glucose and not the bicarbonate. Her bicarbonate is being held down by the saline.",
        bicarb_norm:
          "This is exactly the trap the chloride was warning you about. Her bicarbonate may sit low for a day from the hyperchloremic acidosis. Waiting on it means running insulin into a patient who no longer needs it.",
        no_overlap: "No overlap means an insulin-free window. That's how people bounce back into DKA on the ward.",
        scale_only:
          "A correction scale is reactive — it treats hyperglycemia after it happens. She has type 1 diabetes and makes no insulin of her own. She needs basal.",
        stop_now: "Glucose under 200 is when dextrose goes up, not when insulin comes off.",
        discharge: "She came in because she couldn't get insulin. Discharging her without fixing that is discharging her back into this.",
      },
      rep: { who: "pharmacy", points: 3 },
      onRight: [
        [
          "That's a real plan. I'll get the glargine up now and we'll pull the drip in two hours.",
          "Nice to get one of these where I don't have to argue.",
        ],
      ],
      onWrong: [
        [
          "I'm going to hold the stop order until we've got a basal on board.",
          "Long-acting first, overlap an hour or two, gap closed, and she has to be eating. Otherwise she's back on my pump by lunchtime.",
        ],
      ],
    },

    /* ---------------------------------------------------------------- */
    /* Why she was here at all                                           */
    /* ---------------------------------------------------------------- */

    {
      kind: "say",
      id: "b24",
      speaker: "marisol",
      say: [
        [
          "Can I ask something. Am I in trouble?",
          "The nurse last night asked why I stopped taking it and I said I ran out, and she wrote something down.",
        ],
        "I wasn't being careless. It was {=$340}.",
      ],
    },

    {
      kind: "selectAll",
      id: "b25",
      speaker: "marisol",
      tier: "core",
      domain: "guidelines",
      say: ["What happens now? I still can't afford it next month."],
      choices: [
        { id: "cost", text: "Get her onto a manufacturer assistance or affordability programme before discharge" },
        { id: "sickday", text: "Sick day rules — never stop basal insulin, even when she can't eat" },
        { id: "ketones", text: "A home blood ketone meter and when to use it" },
        { id: "endo", text: "Endocrinology follow-up within two weeks" },
        { id: "social", text: "Social work consult before she leaves" },
        { id: "educate", text: "Reinforce that she must not miss doses in future" },
        { id: "increase", text: "Increase her glargine dose to give her more margin" },
        { id: "sooner", text: "Advise her to come to the ED sooner next time" },
        { id: "pump", text: "Start the process of switching her to an insulin pump" },
        { id: "metformin", text: "Add metformin to reduce her insulin requirement" },
      ],
      correct: ["cost", "sickday", "ketones", "endo", "social"],
      cost: {
        metformin: "harmful",
        increase: "harmful",
        educate: "wasteful",
        sooner: "wasteful",
        pump: "defensible",
      },
      why: {
        cost: "She didn't have a knowledge problem. She had a $340 problem, and it is the only thing here that actually prevents the next admission.",
        educate:
          "She knows. She told you she knows. Educating someone about a barrier that isn't knowledge is how you make a patient feel blamed for something they can't control.",
        sooner: "She came in when her roommate could drive her. Earlier presentation doesn't address why she ran out.",
        increase: "More insulin she can't afford is less insulin, not more.",
        metformin: "She has type 1 diabetes. Metformin doesn't replace the insulin she isn't making, and it isn't indicated here.",
        pump: "Reasonable eventually. Not a plan for someone who can't fund a vial of glargine.",
      },
      rep: { who: "marisol", points: 3 },
      onRight: [
        [
          "So — someone can actually help with the cost part?",
          "I didn't know that was a thing you could ask about.",
        ],
      ],
      onWrong: [
        "Okay.",
        "I mean — I'll try. I just don't know how it's going to be different next month.",
      ],
    },

    {
      kind: "say",
      id: "b26",
      speaker: "okafor",
      say: [
        [
          "Gap's closed, she's eating, glargine's on board. Good shift.",
          "One thing before you go home.",
        ],
        [
          "Everything you did tonight — the fluids, the potassium, the drip — that was the easy part. There's a protocol for it and the protocol works.",
          "She's here because insulin costs money. No protocol fixes that, and she'll be back in {=6} months if nobody deals with it.",
        ],
        "Go home. You did well.",
      ],
    },
  ],
};
