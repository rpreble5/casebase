import type { MedicalCase } from "../../types/case";

/**
 * Upper GI bleed on anticoagulation.
 *
 * The home medication list is the pathophysiology: an anticoagulant, an
 * antiplatelet and an NSAID at the same time, on a man with no gastric
 * protection. Nobody prescribed that combination — it assembled itself — so the
 * medication beat isn't a quiz bolted on, it's the diagnosis sitting in his
 * chart before anyone asks a question.
 *
 * Deliberately heavier on attending and gunner questions than the DKA case, with
 * several arriving back to back and building on the previous answer.
 *
 * Clinical spine: BUN:Cr ratio points upstream; the arrival haemoglobin is
 * falsely reassuring because whole blood has been lost and hasn't equilibrated;
 * the beta blocker is blunting his compensatory tachycardia; transfusion is
 * restrictive; endoscopy within 24 hours rather than emergently; and the hardest
 * question in the case is when the apixaban goes back on.
 */
export const giBleedCase: MedicalCase = {
  id: "gib-sandoval",
  title: "He stood up too fast",
  blurb: "A 71-year-old on apixaban, aspirin and an NSAID he bought himself.",

  patient: {
    name: "Ray Sandoval",
    age: 71,
    line: "71-year-old man with atrial fibrillation and coronary disease, presenting with melena and syncope.",
    weightKg: 84,
    history: [
      "Atrial fibrillation, anticoagulated since 2021",
      "Coronary artery disease — three-vessel bypass, 2019",
      "Hypertension",
      "Osteoarthritis, both knees",
      "No prior GI bleeding, no known ulcer disease",
    ],
    allergies: "No known drug allergies",
    meds: [
      "Apixaban 5 mg twice daily",
      "Aspirin 81 mg daily",
      "Metoprolol succinate 50 mg daily",
      "Lisinopril 20 mg daily",
      "Atorvastatin 40 mg nightly",
      "Naproxen 440 mg twice daily — over the counter, started two months ago",
    ],
    social:
      "Retired postal supervisor. Wife brought the bottles in a shopping bag. No alcohol. Never told anyone about the naproxen because it was over the counter.",
  },

  vitals: [
    { time: "07:35", hr: 104, bp: "92/58", rr: 20, temp: "36.6 °C", spo2: 97 },
    { time: "08:20", hr: 112, bp: "84/50", rr: 22, temp: "36.5 °C", spo2: 96 },
    { time: "11:00", hr: 96, bp: "104/62", rr: 18, temp: "36.7 °C", spo2: 98 },
    { time: "06:00", hr: 78, bp: "118/70", rr: 16, temp: "36.8 °C", spo2: 98 },
  ],

  analytes: [
    { id: "hgb", name: "Haemoglobin", ref: "13.5–17.5", low: 13.5, high: 17.5, decimals: 1 },
    { id: "plt", name: "Platelets", ref: "150–400", low: 150, high: 400 },
    { id: "inr", name: "INR", ref: "0.9–1.1", low: 0.9, high: 1.1, decimals: 1 },
    { id: "bun", name: "BUN", ref: "7–20", low: 7, high: 20 },
    { id: "cr", name: "Creatinine", ref: "0.6–1.1", low: 0.6, high: 1.1, decimals: 1 },
    // Derived — b7 asks the resident to work it out, so it stays hidden until then.
    { id: "bcr", name: "BUN:Cr ratio", ref: "<20", high: 20, derived: true },
    { id: "na", name: "Sodium", ref: "135–145", low: 135, high: 145 },
    { id: "k", name: "Potassium", ref: "3.5–5.1", low: 3.5, high: 5.1, decimals: 1 },
    { id: "lactate", name: "Lactate", ref: "<2.0", high: 2.0, decimals: 1 },
  ],

  draws: [
    {
      time: "07:40",
      label: "On arrival",
      values: { hgb: 9.1, plt: 212, inr: 1.4, bun: 48, cr: 1.4, bcr: 34, na: 138, k: 4.2, lactate: 2.4 },
    },
    {
      time: "09:30",
      label: "After 1 L",
      values: { hgb: 7.2, plt: 198, inr: 1.3, bun: 44, cr: 1.3, bcr: 34, na: 139, k: 4.0, lactate: 1.8 },
    },
    {
      time: "13:00",
      label: "Post-scope",
      values: { hgb: 8.6, plt: 186, inr: 1.2, bun: 32, cr: 1.1, bcr: 29, na: 139, k: 3.9, lactate: 1.2 },
    },
    {
      time: "06:00",
      values: { hgb: 8.9, plt: 192, inr: 1.1, bun: 18, cr: 1.0, bcr: 18, na: 140, k: 4.1, lactate: 1.0 },
    },
  ],

  beats: [
    {
      kind: "say",
      id: "g1",
      speaker: "dani",
      say: [
        [
          "Ray Sandoval, {=71}. Two days of black stools, went down in the kitchen this morning getting up from the table.",
          "Heart rate {=104}, pressure {=92/58}, and he's grey. I've got one {=20}-gauge in and I'm working on a second.",
        ],
        "Wife brought his medications in a shopping bag. All of them.",
      ],
    },

    {
      kind: "medrec",
      id: "g2",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      quiet: true,
      say: [
        "Before anything else — go through that bag.",
        "Tell me what he's still getting today and what he isn't.",
      ],
      meds: [
        {
          id: "apixaban",
          name: "Apixaban 5 mg twice daily",
          reason: "Atrial fibrillation",
          correct: "hold",
          harmful: ["continue"],
          why: "Held, not stopped. He has atrial fibrillation and stopping it permanently has its own body count — the question is when it goes back on, not whether.",
        },
        {
          id: "naproxen",
          name: "Naproxen 440 mg twice daily",
          reason: "Knee pain — over the counter, two months",
          correct: "stop",
          harmful: ["continue"],
          why: "Stopped, not held. This is why he's here. If it goes back in the cupboard as 'on hold' he'll resume it the week he gets home.",
        },
        {
          id: "aspirin",
          name: "Aspirin 81 mg daily",
          reason: "Secondary prevention, bypass 2019",
          correct: "hold",
          harmful: ["stop"],
          why: "Hold it through the bleed, but stopping it for good after a bypass trades a GI problem for a cardiac one. It goes back on within days.",
        },
        {
          id: "metoprolol",
          name: "Metoprolol succinate 50 mg daily",
          reason: "Rate control and post-bypass",
          correct: "hold",
          harmful: ["continue"],
          why: "He's hypotensive. And it's already doing something to him that you'll notice in about ten minutes.",
        },
        {
          id: "lisinopril",
          name: "Lisinopril 20 mg daily",
          reason: "Hypertension",
          correct: "hold",
          harmful: ["continue"],
          why: "A systolic of 92 in a bleeding man is not the moment for an ACE inhibitor.",
        },
        {
          id: "atorvastatin",
          name: "Atorvastatin 40 mg nightly",
          reason: "Post-bypass",
          correct: "continue",
          why: "Nothing about a GI bleed argues for stopping a statin. Reflexively holding everything is its own error.",
        },
      ],
      rep: { who: "okafor", points: 3 },
      onRight: [
        "Alright. That's your list — we'll see how it holds up.",
      ],
      onWrong: [
        "Alright. That's your list — we'll see how it holds up.",
      ],
    },

    {
      kind: "say",
      id: "g3",
      speaker: "okafor",
      say: [
        [
          "Three things in that bag together. An anticoagulant, an antiplatelet, and an NSAID.",
          "Nobody prescribed that combination. It assembled itself, one reasonable decision at a time, and not one of those prescribers knew about the naproxen because he bought it at the supermarket.",
        ],
        "And no acid suppression anywhere. Right — let's get to work.",
      ],
    },

    {
      kind: "picker",
      id: "g4",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: ["Bloods first. What are you sending?"],
      grouped: true,
      show: [
        "cmp", "lactate", "lft",
        "cbc", "coags", "type_screen", "crossmatch", "fibrinogen",
        "trop",
      ],
      correct: ["cmp", "cbc", "coags", "type_screen", "crossmatch", "lactate", "trop"],
      critical: ["cbc", "type_screen", "crossmatch"],
      cost: { fibrinogen: "wasteful" },
      why: {
        trop: "He's 71 with three grafts and a haemoglobin heading somewhere unpleasant. Demand ischemia is not hypothetical.",
        lactate:
          "His pressure will lie to you and so will his heart rate. The lactate is the number that doesn't.",
        fibrinogen: "He isn't coagulopathic and he isn't in DIC. This is a panel you order out of habit.",
        lft: "Reasonable — you're asking whether there's liver disease behind this. There isn't, but it's a fair question.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. Off it goes."],
      onWrong: ["We'll come back to a couple of those."],
    },

    {
      kind: "mcq",
      id: "g4b",
      speaker: "okafor",
      tier: "foundation",
      domain: "guidelines",
      say: [
        "One thing on that list before we move.",
        "You asked for a crossmatch, not just a type and screen. The blood bank will want a reason.",
      ],
      choices: [
        {
          id: "a",
          text: "A screen tells you his group and antibody status; crossmatched units are allocated with his name on them and ready in minutes when he drops",
        },
        { id: "b", text: "A type and screen can't be performed once a patient is actively bleeding" },
        { id: "c", text: "Crossmatch is legally required before any transfusion" },
        { id: "d", text: "The screen would be invalidated by the first unit transfused" },
      ],
      correct: "a",
      why: {
        b: "It can. The screen is the first half of the process, not an alternative to it.",
        c: "In an emergency you can transfuse uncrossmatched O negative. The law is not the constraint — the clock is.",
        d: "Not for this admission. And it isn't the reason to cross him now.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Right. The difference is about 40 minutes, and he may not have 40 minutes."],
      onWrong: [
        [
          "The screen establishes his group and looks for antibodies. The crossmatch is the final compatibility step, and it's what gets units physically allocated to him.",
          "Screen alone and you're 30 to 45 minutes from blood when he crashes. Crossed and waiting, you're two.",
        ],
      ],
    },

    {
      kind: "picker",
      id: "g4c",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: ["Now the patient rather than the labs. Access, monitoring, where he goes."],
      grouped: true,
      show: [
        "ecg", "tele",
        "large_bore", "foley", "npo", "strict_io", "ng_lavage", "icu_admit", "stepdown_admit",
        "ns_bolus", "lr_bolus",
      ],
      correct: ["ecg", "tele", "large_bore", "npo", "strict_io", "icu_admit", "ns_bolus"],
      critical: ["large_bore", "tele", "ns_bolus"],
      cost: { ng_lavage: "wasteful" },
      why: {
        large_bore:
          "The single most useful order on this screen, and the one people skip because it feels like a nursing detail.",
        icu_admit:
          "He's hypotensive with an active bleed and three-vessel disease. A monitored bed is defensible; the unit is safer.",
        ng_lavage:
          "Doesn't change management, doesn't exclude an upper source, and is genuinely unpleasant. Quietly abandoned.",
        lr_bolus: "Fine. Balanced crystalloid versus saline is not the argument that matters tonight.",
        foley: "Reasonable for output monitoring in someone this unstable.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. He's monitored, he's got access, and fluids are up."],
      onWrong: ["We'll fix the gaps. Fluids are up."],
    },

    {
      kind: "mcq",
      id: "g4d",
      speaker: "okafor",
      tier: "foundation",
      domain: "treatment",
      say: [
        "Ezra asked me last week why we don't just put a central line in these patients.",
        "Two short fat peripherals, or one long central line. Which moves blood faster, and why?",
      ],
      choices: [
        {
          id: "a",
          text: "The peripherals — flow rises with the fourth power of the radius and falls with length, so short and wide beats long and narrow",
        },
        { id: "b", text: "The central line — larger vessels accept higher flow rates" },
        { id: "c", text: "The peripherals, but only because they're quicker to place; a central line would be better given time" },
        { id: "d", text: "They're equivalent; the difference is infection risk, not flow" },
      ],
      correct: "a",
      why: {
        b: "The vessel isn't the bottleneck. The cannula is, and a triple-lumen has narrow, long channels.",
        c: "This is the common version and it's wrong on the physics. Even with unlimited time, the peripherals move more blood.",
        d: "Infection risk is real and separate. The flow difference is large and in the peripherals' favour.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Poiseuille. Double the radius and you get sixteen times the flow; double the length and you halve it.",
          "A triple-lumen central line is long and narrow — exactly the wrong shape for volume.",
        ],
      ],
      onWrong: [
        [
          "Flow through a tube goes with the fourth power of its radius and inversely with its length. A short wide peripheral cannula beats a long narrow central lumen, and it isn't close.",
          "Central lines are for pressors, monitoring, and access you can't get otherwise. They are not the resuscitation line.",
        ],
      ],
    },

    {
      kind: "picker",
      id: "g4e",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: ["Last chunk. Drugs, and who you're calling."],
      grouped: true,
      show: [
        "gi_consult",
        "ppi_bolus", "ppi_gtt", "octreotide", "andexanet", "pcc", "txa", "vitk",
        "heparin_ppx", "abx_empiric", "ondansetron",
      ],
      correct: ["gi_consult", "ppi_bolus", "ppi_gtt"],
      critical: ["gi_consult", "ppi_gtt"],
      cost: {
        heparin_ppx: "harmful",
        txa: "harmful",
        vitk: "wasteful",
        abx_empiric: "wasteful",
      },
      why: {
        gi_consult: "Nothing you do tonight stops the bleeding. The person who can is asleep, and you have to wake them.",
        heparin_ppx:
          "Prophylactic anticoagulation in a man actively bleeding from his stomach. Easy to click past on an admission order set, and genuinely dangerous.",
        vitk: "Does nothing to a factor Xa inhibitor. His INR is perturbed by the drug, not by vitamin K deficiency.",
        abx_empiric:
          "Antibiotics are indicated in variceal bleeding with cirrhosis. He has neither.",
        andexanet: "Hold that thought — Ezra is about to ask about exactly this.",
        octreotide: "Reasonable if you suspect varices. No liver disease, no alcohol, no stigmata.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. GI's paged and the infusion's running."],
      onWrong: ["I'll page GI myself. Let's talk about one of those."],
    },

    {
      kind: "mcq",
      id: "g4f",
      speaker: "okafor",
      tier: "bonus",
      domain: "guidelines",
      wager: true,
      say: [
        "Someone on nights will suggest tranexamic acid for this. They always do.",
        "What do you tell them?",
      ],
      choices: [
        {
          id: "a",
          text: "No — HALT-IT randomised over 12,000 patients with GI bleeding and found no mortality benefit and more venous thromboembolism",
        },
        { id: "b", text: "Yes — it reduces mortality in GI bleeding just as it does in trauma" },
        { id: "c", text: "Yes, but only in variceal bleeding" },
        { id: "d", text: "No — tranexamic acid is contraindicated in anyone on an anticoagulant" },
      ],
      correct: "a",
      why: {
        b: "The trauma result is real and it did not transfer. That is the entire lesson of HALT-IT — a mechanism that works in one bleeding population is a hypothesis, not a conclusion, in another.",
        c: "No subgroup showed benefit, variceal included.",
        d: "It isn't contraindicated. It just doesn't help, and it causes clots.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Good. And notice why people get it wrong — CRASH-2 made tranexamic acid feel like a general-purpose answer to bleeding.",
          "Twelve thousand patients later, no mortality benefit and more clots. Extrapolating a mechanism across populations is how confident medicine goes wrong.",
        ],
      ],
      onWrong: [
        [
          "No. HALT-IT randomised more than 12,000 patients with gastrointestinal bleeding — no mortality benefit, and more venous thromboembolism.",
          "It feels like it should work, because it works in trauma. That's precisely the trap: a plausible mechanism in one bleeding population is a hypothesis in another, not a conclusion.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "g5",
      draw: 0,
      speaker: "system",
      say: ["Chemistry, count and coagulation resulted."],
    },

    /* ---- the first build: a number, then what it means, then the trap ---- */

    {
      kind: "keypad",
      id: "g6",
      speaker: "okafor",
      tier: "foundation",
      domain: "diagnosis",
      say: [
        "BUN {bun@0}, creatinine {cr@0}.",
        "Give me the ratio. Round it.",
      ],
      answer: 34,
      tolerance: 2,
      unlocks: ["bcr"],
      rep: { who: "okafor", points: 1 },
      onRight: ["About {bcr@0}. Now tell me why I asked."],
      onWrong: ["{bun@0} over {cr@0} is about {bcr@0}. Now tell me why I asked."],
    },

    {
      kind: "mcq",
      id: "g7",
      speaker: "okafor",
      tier: "core",
      domain: "pathophys",
      pairs: "g6",
      say: ["What does a ratio that high tell you about where he's bleeding from?"],
      choices: [
        {
          id: "a",
          text: "Upper source — digested blood is a protein load absorbed in the small bowel, and he's prerenal on top of it",
        },
        { id: "b", text: "Lower source — colonic bleeding raises the BUN through bacterial urea splitting" },
        { id: "c", text: "Nothing about location — it only tells you he's volume depleted" },
        { id: "d", text: "Intrinsic renal failure from hypoperfusion, which will need dialysis if it worsens" },
      ],
      correct: "a",
      why: {
        b: "Blood that reaches the colon has largely passed the absorptive surface. A lower source characteristically does *not* raise the BUN.",
        c: "Volume depletion is part of it, which is why the ratio isn't proof. But a ratio above 30 with a creatinine barely off baseline is doing more work than that.",
        d: "His creatinine is {cr@0} with a BUN of {bun@0}. That dissociation is the whole point — the kidney is not the problem.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        [
          "Right. He's absorbing his own blood as a protein meal, and the nitrogen has to go somewhere.",
          "It isn't proof, but with melena and a syncopal episode it's another arrow pointing upstream.",
        ],
      ],
      onWrong: [
        [
          "Blood is protein. Digest it in the small bowel and the nitrogen load comes back as urea — so the BUN climbs while the creatinine barely moves.",
          "A lower source doesn't do that, because the blood never gets absorbed. Melena, syncope, and a ratio above 30: that's an upper source until somebody proves otherwise.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "g8",
      speaker: "okafor",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "Next one, and it's the one people get wrong.",
        [
          "His haemoglobin is {hgb@0}. He's had two days of melena and he fainted this morning.",
          "Why does that number not reassure me at all?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "He's lost whole blood and hasn't equilibrated — the haemoglobin falls as extravascular fluid and our crystalloid dilute what's left",
        },
        { id: "b", text: "Because a haemoglobin of 9.1 is already dangerously low and needs transfusing now" },
        { id: "c", text: "Because chronic blood loss from an ulcer means his baseline was probably 15 or 16" },
        { id: "d", text: "Because the sample was drawn from the line the fluids are running through" },
      ],
      correct: "a",
      why: {
        b: "It isn't. The threshold is lower than instinct suggests, and we'll get to that in a moment. The problem with {hgb@0} is that it's a lagging number, not a low one.",
        c: "Possibly true and not the point. Even with a normal baseline, that number would understate an acute loss in the first hours.",
        d: "A real error, and worth checking. But it doesn't explain the physiology, which is what I'm asking about.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Good. Haemorrhage takes red cells and plasma in the same proportion, so the concentration barely moves at first.",
          "The number only falls once fluid shifts in from the interstitium — or once we push it in ourselves. Which means his first haemoglobin tells you almost nothing about how much he's lost.",
        ],
        "Watch what it does in two hours.",
      ],
      onWrong: [
        [
          "He's bleeding whole blood — cells and plasma together — so the ratio between them doesn't change and the concentration holds up.",
          "It only drops once the interstitium refills the vascular space, or once we do it for him with saline. The first haemoglobin in an acute bleed is a lagging indicator, and treating it as a measure of blood loss is how people get sent to the ward.",
        ],
        "Watch what it does in two hours.",
      ],
    },

    /* ---- Ezra's two-part ambush, the second half built on the first ---- */

    {
      kind: "mcq",
      id: "g9",
      speaker: "ezra",
      tier: "bonus",
      domain: "treatment",
      wager: true,
      say: [
        "Can I ask about the apixaban?",
        [
          "He took his last dose yesterday morning, so about {=24} hours ago. His INR is {inr@0}.",
          "Shouldn't we be giving andexanet alfa to reverse him?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "Consider it, but not yet — reversal is for life-threatening bleeding that isn't responding, and most upper GI bleeds are controlled endoscopically",
        },
        { id: "b", text: "Yes, immediately — any GI bleed on a factor Xa inhibitor is an indication for reversal" },
        { id: "c", text: "No — andexanet doesn't work on apixaban, it's specific to rivaroxaban" },
        { id: "d", text: "No — his INR of 1.3 shows he isn't meaningfully anticoagulated" },
      ],
      correct: "a",
      why: {
        b: "Andexanet is thrombogenic, and this is a man with atrial fibrillation and three bypass grafts. Reversing him is not a free action.",
        c: "It binds both. That's what it's for.",
        d: "This is the trap. The INR is not a measure of factor Xa inhibition — a normal INR doesn't mean a normal apixaban level, and a raised one doesn't quantify it.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        "Oh — so it's not automatic.",
      ],
      onWrong: [
        [
          "Reversal is for bleeding that's life-threatening and not responding to resuscitation and endoscopy. He isn't there yet.",
          "And andexanet causes thrombosis. In a man with atrial fibrillation and three grafts, that's a real trade rather than a technicality.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "g10",
      speaker: "ezra",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "Wait — but his INR is {inr@0}, that's above normal.",
        "Doesn't that tell us how anticoagulated he actually is?",
      ],
      choices: [
        {
          id: "a",
          text: "No — apixaban perturbs the PT assay unpredictably. A raised INR doesn't quantify the effect and a normal one doesn't exclude it.",
        },
        { id: "b", text: "Yes — INR is a direct measure of anticoagulant effect regardless of the agent" },
        { id: "c", text: "Yes, but only if you correct it for his renal function" },
        { id: "d", text: "No — the INR is raised because of hepatic congestion from his blood loss" },
      ],
      correct: "a",
      why: {
        b: "INR was calibrated for vitamin K antagonists. It has no defined relationship to direct factor Xa inhibition.",
        c: "There's no such correction. Renal function matters for clearance, not for interpreting the assay.",
        d: "Nothing here suggests hepatic congestion, and it wouldn't produce this pattern.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        [
          "So the number's basically decorative.",
          "...I've been quoting that on rounds.",
        ],
      ],
      onWrong: [
        [
          "The INR was built for warfarin. Apixaban does move it, but not proportionally and not reliably — a normal INR on apixaban tells you nothing at all.",
          "If you genuinely need a level there's an anti-Xa assay calibrated for the drug, and most hospitals can't run it at three in the morning. Which is rather the point: you treat the patient.",
        ],
      ],
    },

    /* ---- the nurse notices, then the attending asks why ---- */

    {
      kind: "say",
      id: "g11",
      speaker: "dani",
      say: [
        [
          "His pressure's down to {=84}/{=50}.",
          "And his heart rate's only {=112}. For a man that white, I'd expect worse.",
        ],
      ],
      variants: [
        {
          whenMed: "metoprolol",
          is: "continue",
          say: [
            [
              "His pressure's down to {=84}/{=50}.",
              "And his heart rate's only {=112}. For a man that white, I'd expect worse — and he had his metoprolol this morning, which I gave because it was still on the list.",
            ],
          ],
        },
      ],
    },

    {
      kind: "mcq",
      id: "g12",
      speaker: "okafor",
      tier: "core",
      domain: "complications",
      say: ["She's right, and it matters. Why isn't he more tachycardic?"],
      choices: [
        {
          id: "a",
          text: "His metoprolol is blunting the compensatory tachycardia — the heart rate is understating how much he's lost",
        },
        { id: "b", text: "He's compensating well; a rate of 112 is appropriate for this degree of loss" },
        { id: "c", text: "Vagal tone from blood in the gut is slowing him" },
        { id: "d", text: "He's in atrial fibrillation, so the rate isn't interpretable" },
      ],
      correct: "a",
      why: {
        b: "A 71-year-old who has lost enough to syncope should be driving his rate far harder than this. That he isn't is the finding.",
        c: "Vagal responses happen, but they don't explain a sustained blunted response in a man on a beta blocker.",
        d: "Atrial fibrillation makes the rate irregular, not uninterpretable — and it doesn't cap his ability to compensate. The beta blocker does.",
      },
      rep: { who: "dani", points: 3 },
      onRight: [
        [
          "Beta blockade. His heart rate is a compensatory mechanism with the brake half on, so it's telling you a comfortable lie about his volume status.",
          "Anchor on it and you'll admit him to the ward and go to sleep.",
        ],
      ],
      onWrong: [
        [
          "He's on metoprolol. Beta blockade caps the compensatory tachycardia, so his rate understates how much blood he's lost.",
          "This is the classic way a bleeding patient on rate control gets triaged too low — the number that should be screaming is politely raising its hand.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "g13",
      draw: 1,
      speaker: "dani",
      say: ["Repeat count's back after the litre."],
    },

    /* ---- transfusion: the threshold, then the exception, then the reason ---- */

    {
      kind: "keypad",
      id: "g14",
      speaker: "okafor",
      tier: "core",
      domain: "guidelines",
      say: [
        "Haemoglobin {hgb@1}, down from {hgb@0}.",
        "At what haemoglobin do you transfuse a stable patient with an upper GI bleed?",
      ],
      answer: 7,
      tolerance: 0,
      unit: "g/dL",
      rep: { who: "okafor", points: 2 },
      onRight: ["Seven. Not nine, not ten."],
      onWrong: [
        [
          "{=7}. It's lower than instinct, and instinct has killed people here.",
          "The restrictive threshold beat the liberal one on mortality, on rebleeding, and on transfusion reactions.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "g15",
      speaker: "okafor",
      tier: "bonus",
      domain: "guidelines",
      pairs: "g14",
      wager: true,
      say: [
        "Now complicate it.",
        [
          "He has three-vessel disease and grafts from {=2019}. Say his troponin comes back mildly raised and he's describing chest tightness.",
          "Does the threshold move?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "Yes — with acute coronary syndrome most would transfuse at a higher threshold, around 8, though the evidence is far weaker than for the restrictive strategy",
        },
        { id: "b", text: "No — 7 is the threshold in every population, that's the entire point of the trials" },
        { id: "c", text: "Yes — with any coronary disease, transfuse to keep him above 10" },
        { id: "d", text: "No — transfusion worsens coronary outcomes by increasing blood viscosity" },
      ],
      correct: "a",
      why: {
        b: "The restrictive trials largely excluded acute coronary syndrome. Applying a rule to the population it was never tested in is exactly how guidelines get misused.",
        c: "Ten is the old reflex and it has no support. Even in ACS the argument is about 8 versus 10, and it hasn't been settled.",
        d: "Viscosity isn't the mechanism anyone's worried about, and this reverses the actual concern.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Good — and notice what you just did. You held the rule and the exception at the same time without abandoning either.",
          "The restrictive strategy is strong evidence in the population it was tested in. Ischemic myocardium was mostly not in that population.",
        ],
      ],
      onWrong: [
        [
          "Most would go up to about {=8} in acute coronary syndrome. But be honest about why: the restrictive trials largely excluded those patients, so we're extrapolating rather than following evidence.",
          "The mistake isn't picking a number. It's applying a rule to a group it was never tested on and calling that evidence-based.",
        ],
      ],
    },

    {
      kind: "confirm",
      id: "g16",
      speaker: "pharmacy",
      tier: "core",
      domain: "guidelines",
      say: [
        "Pharmacy — verifying on Sandoval.",
        "I have pantoprazole {=40} mg IV once daily. Releasing it?",
      ],
      affirmLabel: "Confirm it",
      denyLabel: "Hold on",
      correct: "deny",
      followUp: {
        prompt: "What would you rather have?",
        choices: [
          { id: "a", text: "A bolus followed by a continuous infusion, or at least high-dose twice-daily dosing, before endoscopy" },
          { id: "b", text: "Nothing — it's fine, once daily is the standard dose" },
          { id: "c", text: "Oral pantoprazole instead, since he'll be eating after the scope" },
          { id: "d", text: "An H2 blocker instead — faster onset and better evidence in bleeding" },
        ],
        correct: "a",
        why: {
          b: "Once-daily dosing is what you write for reflux. Pre-endoscopy the aim is sustained acid suppression to stabilise clot, which needs considerably more.",
          c: "He's nil by mouth for a procedure, and oral dosing wouldn't achieve the pH target anyway.",
          d: "H2 blockers develop tachyphylaxis within a day and have never shown benefit here.",
        },
      },
      rep: { who: "pharmacy", points: 3 },
      onRight: [
        [
          "Agreed — I'll set up the bolus and infusion.",
          "Worth saying: this doesn't change whether he rebleeds or whether he survives. It downstages what the endoscopist finds. Useful, not heroic.",
        ],
      ],
      onWrong: [
        [
          "I'd push back on that. Once daily is a reflux dose — pre-endoscopy you want a bolus and an infusion, or at minimum high-dose twice daily.",
          "It won't change mortality or rebleeding. It does downstage the lesion they find, which makes the scope easier. I'll get it changed.",
        ],
      ],
    },

    /* ---- the consultant you have to persuade ---- */

    {
      kind: "say",
      id: "g17",
      speaker: "gi",
      say: [
        [
          "This is the GI fellow, someone paged.",
          "It's twenty past eight and I've got a list starting at nine, so — quickly.",
        ],
      ],
    },

    {
      kind: "selectAll",
      id: "g18",
      speaker: "gi",
      tier: "core",
      domain: "treatment",
      say: ["What have you actually done, and what do you need from me?"],
      choices: [
        { id: "resus", text: "He's had a litre and two units are crossed" },
        { id: "ppi", text: "Pantoprazole bolus and infusion are running" },
        { id: "anticoag", text: "Apixaban is held; last dose was yesterday morning" },
        { id: "npo", text: "He's nil by mouth" },
        { id: "erythro", text: "Ask whether they want erythromycin before the scope" },
        { id: "timing", text: "Ask for endoscopy within 24 hours" },
        { id: "now", text: "Demand they come immediately, before the morning list" },
        { id: "ng", text: "Offer to place a nasogastric tube to confirm an upper source" },
        { id: "reverse", text: "Tell them you've already given andexanet" },
        { id: "hb", text: "Report that the haemoglobin is 9.1 and stable" },
      ],
      correct: ["resus", "ppi", "anticoag", "npo", "erythro", "timing"],
      cost: { now: "defensible", ng: "wasteful", reverse: "harmful", hb: "harmful" },
      why: {
        erythro:
          "A prokinetic dose of erythromycin 30 to 120 minutes before endoscopy clears the stomach and improves visualisation. Endoscopists notice when you've thought of it.",
        timing:
          "Within 24 hours. Pushing for an emergency scope in the first few hours hasn't improved outcomes and in one trial did worse — resuscitate first.",
        hb: "The 9.1 is the old value and it was never reassuring. Quoting it as 'stable' after his repeat came back at 7.2 misleads the one person who can stop the bleeding.",
        reverse: "You haven't. Telling a consultant something you didn't do is a different category of error from a clinical one.",
        ng: "Doesn't change management or timing. They'll decline.",
        now: "Understandable, but he's responding to resuscitation. Fighting for an eight-thirty scope costs you credibility you'll want later.",
      },
      rep: { who: "gi", points: 3 },
      onRight: [
        [
          "Good handover. Erythromycin's a nice touch — most people don't.",
          "I'll take him after the second case, so around eleven. Keep him full of blood and call me if that changes.",
        ],
      ],
      onWrong: [
        [
          "Right, let me just get this straight, because some of that I'd have wanted differently.",
          "Resuscitate him, keep him nil by mouth, and I'll take him after my second case. Call me if he becomes unstable and I'll come sooner.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "g19",
      draw: 2,
      speaker: "system",
      say: ["13:00 — post-endoscopy labs resulted."],
    },

    {
      kind: "say",
      id: "g20",
      speaker: "gi",
      say: [
        [
          "Scoped him. Duodenal ulcer, visible vessel, oozing.",
          "Clipped it and injected. Forrest 2a, so he has a real rebleeding risk over the next {=72} hours.",
        ],
        "Biopsies are away for Helicobacter. Keep the infusion going.",
      ],
    },

    /* ---- the hardest question in the case ---- */

    {
      kind: "say",
      id: "g21",
      speaker: "ray",
      say: [
        [
          "They said they fixed it. Am I allowed to ask something?",
          "The blood thinner. My brother had a stroke — he can't use his left hand any more, he was {=64}.",
        ],
        "Nobody's said when I go back on it. Or if I do.",
      ],
    },

    {
      kind: "mcq",
      id: "g22",
      speaker: "okafor",
      tier: "bonus",
      domain: "guidelines",
      wager: true,
      say: [
        "He's asked the hardest question in this admission, so let's answer it properly.",
        "When does the apixaban go back on?",
      ],
      choices: [
        {
          id: "a",
          text: "Within about a week, once haemostasis is secure — resuming is associated with lower thromboembolism and lower mortality, even accounting for rebleeding",
        },
        { id: "b", text: "Never — a life-threatening GI bleed is an absolute contraindication to further anticoagulation" },
        { id: "c", text: "At six weeks, once the ulcer has definitely healed" },
        { id: "d", text: "Immediately, before discharge, since the vessel has been clipped" },
      ],
      correct: "a",
      why: {
        b: "This is the commonest error and it's an error of omission, which makes it invisible. The strokes it causes happen months later and nobody connects them to this admission.",
        c: "Six weeks of unopposed atrial fibrillation in a man whose brother is hemiplegic. The rebleeding risk is real but it is not this large.",
        d: "Too early. The first 72 hours after a Forrest 2a lesion carry the highest rebleeding risk — that's the window to let pass.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        [
          "Right. And notice the shape of that decision — the harm from not restarting is invisible and delayed, the harm from restarting is visible and immediate.",
          "Which is exactly why so many of these patients quietly never go back on it. Nobody ever gets blamed for the stroke that happens four months after discharge.",
        ],
        "Write the restart date in the discharge summary. Not 'consider'. A date.",
      ],
      onWrong: [
        [
          "It goes back on, and sooner than feels comfortable — within about a week, once haemostasis is secure.",
          "Resuming is associated with lower thromboembolic events and lower mortality, and that holds even accounting for the rebleeding it causes.",
        ],
        [
          "The reason this gets it wrong so often is that the harms aren't symmetrical in how visible they are. A rebleed happens on your shift. The stroke happens four months later and nobody connects it to this admission.",
          "Write the restart date in the discharge summary. Not 'consider'. A date.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "g23",
      speaker: "ray",
      tier: "core",
      domain: "communication",
      say: ["So what do I tell my wife? She's been asking whether the blood thinner nearly killed me."],
      choices: [
        {
          id: "a",
          text: "The blood thinner didn't do this on its own — the anti-inflammatory you were taking for your knee stripped your stomach's protection, and together they caused it. We're stopping that one for good and restarting the other in about a week.",
        },
        { id: "b", text: "The blood thinner caused the bleed, but you need it for your heart, so it's a risk we accept." },
        { id: "c", text: "These things happen at your age. We'll keep an eye on it." },
        { id: "d", text: "It's complicated — your other doctors will explain it at your follow-up." },
      ],
      correct: "a",
      why: {
        b: "It hands her the wrong villain. She'll spend the next year frightened of the drug he actually needs, and the naproxen — the thing that genuinely caused this — walks free.",
        c: "It isn't age. It's a drug interaction that was preventable, and telling him otherwise removes the one thing he can act on.",
        d: "He asked you. Deferring a frightening question to someone who isn't in the room is how patients stop taking medications nobody explained.",
      },
      rep: { who: "ray", points: 3 },
      onRight: [
        [
          "The knee tablets. The ones from the supermarket.",
          "I didn't think those counted as medicine.",
        ],
      ],
      onWrong: [
        "Right. Okay.",
        "She's not going to let me take that blood thinner again, you know.",
      ],
    },

    {
      kind: "labs",
      id: "g24",
      draw: 3,
      speaker: "system",
      say: ["Next morning — 06:00 labs resulted."],
    },

    {
      kind: "selectAll",
      id: "g25",
      speaker: "okafor",
      tier: "core",
      domain: "guidelines",
      say: [
        "He's stable, haemoglobin {hgb@3}, BUN back down to {bun@3}.",
        "What goes in the discharge plan?",
      ],
      choices: [
        { id: "ppi_home", text: "High-dose oral PPI for 8 weeks" },
        { id: "nsaid_never", text: "Documented instruction to avoid all NSAIDs, including over the counter" },
        { id: "restart_date", text: "A specific date to restart apixaban, written in the summary" },
        { id: "aspirin_back", text: "Restart aspirin within days, not weeks" },
        { id: "hpylori", text: "Follow up the Helicobacter result and treat if positive" },
        { id: "analgesia", text: "An alternative analgesic plan for his knees" },
        { id: "gi_fu", text: "Gastroenterology follow-up" },
        { id: "stop_apix", text: "Discontinue apixaban permanently and document the reason" },
        { id: "aspirin_stop", text: "Stop aspirin permanently given the bleeding risk" },
        { id: "prn_naproxen", text: "Naproxen as needed for severe knee pain only" },
      ],
      correct: ["ppi_home", "nsaid_never", "restart_date", "aspirin_back", "hpylori", "analgesia", "gi_fu"],
      cost: { stop_apix: "harmful", aspirin_stop: "harmful", prn_naproxen: "harmful" },
      why: {
        analgesia:
          "If you take away the only thing that helped his knees and offer nothing, he will find his own solution in the same supermarket aisle.",
        hpylori:
          "And note the trap — testing during an acute bleed has a meaningful false negative rate. A negative result here needs repeating, not filing.",
        prn_naproxen: "As needed is how he was taking it in the first place. There is no safe occasional dose of the drug that put him here.",
        stop_apix: "The invisible harm. He has atrial fibrillation and a brother who can't use his left hand.",
        aspirin_stop:
          "Stopping antiplatelet therapy after bypass grafting increases cardiovascular events and death. It goes back on within days.",
        restart_date:
          "A date, not a sentiment. 'Consider resuming' in a discharge summary is how a patient ends up permanently off anticoagulation by accident.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: ["That's a discharge plan rather than a discharge summary. Good."],
      onWrong: ["We'll go through the gaps together before you write it up."],
    },

    {
      kind: "say",
      id: "g26",
      speaker: "okafor",
      say: [
        [
          "One thing to take away from tonight.",
          "Every drug in that shopping bag was prescribed by somebody sensible, for a good reason, and the combination nearly killed him. Nobody made a mistake. The mistake was that no one person ever saw the whole list.",
        ],
        "You did, this morning. That was the most useful thing you did all day.",
      ],
    },
  ],
};
