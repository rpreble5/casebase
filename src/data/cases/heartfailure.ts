import type { MedicalCase } from "../../types/case";

/**
 * Decompensated HFrEF, precipitated by new-onset atrial fibrillation with RVR
 * on top of dietary indiscretion and a skipped diuretic dose.
 *
 * Structurally distinct from the other three cases in a few ways worth keeping:
 *
 * - This is an EXAM diagnosis before it's a lab diagnosis. JVP, crackles and
 *   edema arrive through the nurse's voice before a single number does, and the
 *   organizing framework — wet/warm vs wet/cold — has no equivalent elsewhere
 *   in the app. It's a genuinely different axis of reasoning from "what's the
 *   number" or "what's the mechanism".
 *
 * - The precipitant is hidden IN the workup, not in the history. An ECG most
 *   residents order reflexively turns out to matter enormously: new AFib with
 *   RVR, found incidentally, reframes the whole admission and drives a real
 *   decision tree — rate control (avoiding non-dihydropyridine calcium channel
 *   blockers in reduced EF), then anticoagulation, with cardioversion timing
 *   deliberately left as a hypothetical rather than something the case forces.
 *
 * - The GDMT trap runs the OPPOSITE direction from the GI bleed case. There,
 *   continuing the beta blocker was the error, because it masked shock. Here,
 *   a reflexive order to STOP it is the error, because routine decompensation
 *   is not an indication to hold it. Same drug class, opposite lesson — the
 *   point being that the right call depends on reading the patient in front of
 *   you, not on having memorized "hold beta blockers in sick patients."
 *
 * - The creatinine bump is this case's "number that lies", but the mechanism is
 *   the mirror image of the GI bleed case's BUN:Cr ratio: there, a number
 *   pointed at hypovolemia; here, a rising creatinine during decongestion is
 *   common, does not reliably predict a worse outcome, and is not by itself a
 *   reason to stop treating a patient who is still congested and still making
 *   urine. Phrased with real hedge, since the precise mechanism is debated.
 */
export const heartFailureCase: MedicalCase = {
  id: "hf-voss",
  title: "He didn't want to leave the wedding",
  blurb: "A 68-year-old with HFrEF, five days of worsening breathlessness since his granddaughter's wedding.",

  patient: {
    name: "Harold Voss",
    age: 68,
    line: "68-year-old man with HFrEF (EF 25%) presenting with five days of progressive dyspnea and orthopnea.",
    weightKg: 92,
    history: [
      "HFrEF, EF 25% — anterior MI 2020, ischemic cardiomyopathy",
      "Chronic kidney disease, stage 3a — baseline creatinine ~1.0",
      "Type 2 diabetes",
      "Gout",
      "No prior history of atrial fibrillation",
    ],
    allergies: "No known drug allergies",
    meds: [
      "Carvedilol 25 mg twice daily",
      "Lisinopril 20 mg daily",
      "Spironolactone 25 mg daily",
      "Metformin 1000 mg twice daily",
      "Amlodipine 5 mg daily",
      "Ibuprofen 600 mg three times daily — started six days ago for knee pain",
    ],
    social:
      "Retired machinist. His granddaughter's wedding was six days ago — his dry weight is about 86 kg and he's presenting 6 kg above it. His wife Denise says he skipped his morning water pill the day of the wedding so he 'wouldn't need to keep excusing himself,' ate the catered dinner, and started the ibuprofen after he strained his knee dancing.",
  },

  vitals: [
    { time: "19:15", hr: 132, bp: "148/92", rr: 26, temp: "37.0 °C", spo2: 89 },
    { time: "23:30", hr: 108, bp: "130/82", rr: 20, temp: "36.9 °C", spo2: 94 },
    { time: "07:00", hr: 84, bp: "118/74", rr: 16, temp: "36.7 °C", spo2: 96 },
    { time: "10:00", hr: 76, bp: "112/70", rr: 14, temp: "36.7 °C", spo2: 97 },
  ],

  analytes: [
    { id: "na", name: "Sodium", ref: "135–145", low: 135, high: 145 },
    { id: "k", name: "Potassium", ref: "3.5–5.1", low: 3.5, high: 5.1, decimals: 1 },
    { id: "bun", name: "BUN", ref: "7–20", low: 7, high: 20 },
    { id: "cr", name: "Creatinine", ref: "0.6–1.1", low: 0.6, high: 1.1, decimals: 1 },
    { id: "glucose", name: "Glucose", ref: "70–99", low: 70, high: 99 },
    { id: "hgb", name: "Haemoglobin", ref: "13.5–17.5", low: 13.5, high: 17.5, decimals: 1 },
    // Hidden until g/hf5, where ordering the workup reveals them.
    { id: "bnp", name: "BNP", ref: "<100 pg/mL", high: 100, hidden: true },
    { id: "trop", name: "Troponin", ref: "<0.04 ng/mL", high: 0.04, decimals: 2, hidden: true },
  ],

  draws: [
    {
      time: "19:20",
      label: "On arrival",
      values: { na: 133, k: 4.3, bun: 28, cr: 1.3, glucose: 142, hgb: 11.8, bnp: 1450, trop: 0.06 },
    },
    {
      time: "23:40",
      label: "After first dose",
      values: { na: 134, k: 4.0, bun: 32, cr: 1.5, glucose: 118, hgb: 11.5, trop: 0.05 },
    },
    {
      time: "07:10",
      label: "Next morning",
      values: { na: 135, k: 3.9, bun: 30, cr: 1.4, glucose: 110, hgb: 11.6, trop: 0.05 },
    },
    {
      time: "10:15",
      values: { na: 138, k: 4.2, bun: 22, cr: 1.1, glucose: 104, hgb: 11.9, trop: 0.04 },
    },
  ],

  beats: [
    {
      kind: "say",
      id: "hf1",
      speaker: "dani",
      say: [
        [
          "Harold Voss, {=68}, known heart failure — EF twenty-five percent from an anterior MI a few years back.",
          "Five days of worsening breathlessness, sleeping sitting up in his recliner the last two nights. Heart rate {=132} and irregular, pressure {=148/92}, sats {=89}% on room air.",
        ],
        [
          "JVP's up to his jaw. Crackles halfway up both lung fields. Two-plus pitting edema to his knees.",
          "Feet are warm, though, and his cap refill's brisk. He's talking in short sentences but he's not fighting for air.",
        ],
      ],
    },

    {
      kind: "say",
      id: "hf2",
      speaker: "denise",
      say: [
        [
          "I'm his wife. He was fine at our granddaughter's wedding six days ago — a little tired, but fine.",
          "He told me he skipped his water pill that morning so he wouldn't have to keep leaving the ceremony. He had the dinner too, and it was salty — everything at these things is salty.",
        ],
        "And his knee's been bothering him since he danced with her, so he's been taking ibuprofen for it. Every few hours, I think.",
      ],
    },

    {
      kind: "medrec",
      id: "hf3",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      quiet: true,
      say: [
        "Before we do anything else — his list.",
        "Tell me what he's getting today.",
      ],
      meds: [
        {
          id: "carvedilol",
          name: "Carvedilol 25 mg twice daily",
          reason: "Guideline-directed therapy for HFrEF",
          correct: "continue",
          harmful: ["hold", "stop"],
          why: "Continue it. Routine decompensation is not an indication to hold a beta blocker — that's reserved for cardiogenic shock, symptomatic hypotension, or significant bradycardia, and he has none of those. He's warm, not cold.",
        },
        {
          id: "lisinopril",
          name: "Lisinopril 20 mg daily",
          reason: "Guideline-directed therapy for HFrEF",
          correct: "hold",
          harmful: ["continue"],
          why: "Hold it while his creatinine is rising and he's being aggressively diuresed — not stopped for good, restarted once he's decongested and his renal function has settled.",
        },
        {
          id: "spironolactone",
          name: "Spironolactone 25 mg daily",
          reason: "Guideline-directed therapy for HFrEF",
          correct: "hold",
          why: "Hold it alongside the lisinopril while the creatinine is moving. His potassium isn't dangerous yet, but the direction of travel with an ACE inhibitor and a rising creatinine is the wrong one to stack a potassium-sparing drug onto.",
        },
        {
          id: "metformin",
          name: "Metformin 1000 mg twice daily",
          reason: "Type 2 diabetes",
          correct: "hold",
          harmful: ["continue"],
          why: "Hold it during acute kidney injury. The lactic acidosis risk is real and this is exactly the setting it happens in — an acutely rising creatinine, not his stable baseline.",
        },
        {
          id: "ibuprofen",
          name: "Ibuprofen 600 mg three times daily",
          reason: "Knee pain — started six days ago",
          correct: "stop",
          harmful: ["continue"],
          why: "Stop it outright. It blunts diuretic response, promotes sodium retention, and it's a meaningful part of why he's here. It doesn't go back in the cupboard as 'as needed.'",
        },
        {
          id: "amlodipine",
          name: "Amlodipine 5 mg daily",
          reason: "Hypertension",
          correct: "continue",
          why: "Continue it. It's a dihydropyridine — unlike the non-dihydropyridine calcium channel blockers, it doesn't meaningfully depress contractility, and there's nothing here that argues for stopping it.",
        },
      ],
      rep: { who: "okafor", points: 3 },
      onRight: ["Right. Let's see what he's actually made of."],
      onWrong: ["Right. Let's see what he's actually made of."],
    },

    {
      kind: "mcq",
      id: "hf4",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: [
        "You've heard the exam. Warm feet, brisk cap refill, pressure's fine — but he's wet everywhere you look.",
        "How do you classify him?",
      ],
      choices: [
        { id: "a", text: "Wet and warm — congested, but adequately perfused" },
        { id: "b", text: "Wet and cold — congested and poorly perfused, needs inotropic support" },
        { id: "c", text: "Dry and warm — compensated, doesn't need diuresis" },
        { id: "d", text: "Dry and cold — cardiogenic shock without volume overload" },
      ],
      correct: "a",
      why: {
        b: "Cold means poor perfusion — cool skin, delayed cap refill, narrow pulse pressure. His feet are warm and his refill is brisk. Perfusion is fine.",
        c: "Dry means no congestion. He's got a JVP to his jaw and crackles halfway up both fields. He is not dry.",
        d: "Neither dry nor cold fits anything you've been told about him.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        "Right. Wet and warm means this is a decongestion problem, not a perfusion problem — diuresis is the whole job tonight.",
      ],
      onWrong: [
        [
          "Wet and warm. Congested — the JVP, the crackles, the edema — but perfused well enough that his extremities are warm and his refill is brisk.",
          "That distinction is the whole plan. Wet and warm means decongest him. Wet and cold would mean something very different, and we'll come back to that.",
        ],
      ],
    },

    {
      kind: "picker",
      id: "hf5",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: ["Workup. What are you sending, and what are you looking at?"],
      grouped: true,
      show: [
        "bnp", "trop", "bmp", "cbc", "lft", "tsh",
        "ecg", "cxr", "echo",
        "poc_glucose",
      ],
      correct: ["bnp", "trop", "bmp", "cbc", "ecg", "cxr"],
      critical: ["bnp", "ecg", "cxr"],
      cost: { echo: "wasteful", lft: "wasteful", tsh: "defensible" },
      unlocks: ["bnp", "trop"],
      why: {
        bnp: "It won't make the diagnosis on its own, but a very low value would argue strongly against heart failure being the story tonight.",
        ecg: "Don't skip this one. It's about to change the admission.",
        echo: "Useful, eventually — to reassess his EF and look for a new wall motion abnormality. It doesn't change what you do in the next hour.",
        tsh: "Reasonable to exclude thyrotoxicosis as a rate driver, given the tachycardia. Not urgent tonight.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Good. Let's see what comes back."],
      onWrong: ["We'll fill the gaps. Let's see what comes back."],
    },

    {
      kind: "labs",
      id: "hf6",
      draw: 0,
      speaker: "system",
      say: ["Chemistry, count, BNP and troponin resulted."],
    },

    {
      kind: "mcq",
      id: "hf7",
      speaker: "ezra",
      tier: "bonus",
      domain: "diagnosis",
      wager: true,
      say: [
        "Wait — his troponin's {trop@0}. That's above the cutoff.",
        "Shouldn't we be putting out a STEMI page? Or at least getting cardiology down here for a possible NSTEMI?",
      ],
      choices: [
        {
          id: "a",
          text: "No — a mildly elevated troponin without a rise-and-fall pattern or ischemic symptoms is common in decompensated heart failure itself, from wall stress and demand; trend it rather than treating it as ACS",
        },
        { id: "b", text: "Yes — any troponin above the reference range meets criteria for myocardial infarction" },
        { id: "c", text: "No — troponin is never elevated in heart failure without concurrent coronary disease" },
        { id: "d", text: "It's almost certainly a lab error and should be sent again on a fresh sample" },
      ],
      correct: "a",
      why: {
        b: "The diagnosis of MI needs a rise-and-fall pattern plus a clinical context — ischemic symptoms, ECG changes. A single value in isolation isn't a diagnosis.",
        c: "It happens constantly in decompensated heart failure — wall stress alone can produce a demand-type elevation with no coronary event at all.",
        d: "It's a real result. Trend it instead of dismissing it.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        "Oh — so it's the heart failure itself doing it, not necessarily a clot.",
      ],
      onWrong: [
        [
          "Watch what it does over the next two draws rather than reacting to the first one. If it's flat or drifting down, that's wall stress from the failure itself, not an evolving infarct.",
          "He's got no chest pain and nothing acute on his ECG to suggest ischemia. Treat the heart failure and keep an eye on the number — don't activate a cath lab off a single value.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf8",
      speaker: "okafor",
      tier: "foundation",
      domain: "pathophys",
      say: [
        "While we're on lab interpretation — his BNP came back at {bnp@0}.",
        "In general, independent of how congested someone actually is, what makes a BNP misleadingly low, and what makes it misleadingly high?",
      ],
      choices: [
        {
          id: "a",
          text: "Obesity lowers it — adipose tissue clears natriuretic peptides — while renal impairment and atrial fibrillation raise it independent of congestion",
        },
        { id: "b", text: "Body habitus and renal function have no meaningful effect on BNP; it purely reflects cardiac wall stress" },
        { id: "c", text: "Renal impairment lowers BNP, because the failing kidneys produce less of it" },
        { id: "d", text: "Obesity raises BNP, because the extra weight itself increases cardiac strain" },
      ],
      correct: "a",
      why: {
        b: "It's a genuinely common trap — a single BNP gets treated as a verdict when it needs to be read in context.",
        c: "Backwards. The kidneys clear natriuretic peptide fragments; impaired clearance raises the level, it doesn't lower it.",
        d: "The mechanism runs the other way for the BNP value itself, even though the cardiac strain claim sounds intuitive.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        "Right. A number this high in someone this size is about as unambiguous as BNP gets. It won't always be this easy to read.",
      ],
      onWrong: [
        [
          "Obesity lowers BNP — adipose tissue clears it — so a normal BNP in a large patient doesn't rule anything out.",
          "Renal impairment and atrial fibrillation both raise it independent of volume status. His is high enough that none of that ambiguity matters tonight, but it won't always be this clean.",
        ],
      ],
    },

    {
      kind: "say",
      id: "hf9",
      speaker: "dani",
      say: [
        [
          "ECG's back.",
          "He's not in sinus. It's atrial fibrillation, rate in the one-thirties. Nothing in his chart says he's had this before.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf10",
      speaker: "okafor",
      tier: "core",
      domain: "pathophys",
      say: [
        "New atrial fibrillation, and probably not a coincidence.",
        "Why would a rate in the one-thirties push someone with his ejection fraction into overt failure?",
      ],
      choices: [
        {
          id: "a",
          text: "Loss of the atrial kick reduces ventricular filling, and the fast rate shortens diastole further — a heart with little reserve can't compensate for either",
        },
        { id: "b", text: "The irregular rhythm directly damages the myocardium with each beat" },
        { id: "c", text: "Atrial fibrillation raises systemic vascular resistance, increasing the heart's workload" },
        { id: "d", text: "It doesn't — the rate is incidental and the decompensation is unrelated" },
      ],
      correct: "a",
      why: {
        b: "The rhythm isn't causing structural injury beat to beat. The problem is mechanical, not toxic.",
        c: "Vascular resistance isn't what atrial fibrillation changes. Filling is.",
        d: "It's very unlikely to be incidental given the timing, and the mechanism in option A is exactly why it wouldn't be.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        "Right. A normal heart tolerates that rate for a while. His doesn't have the reserve to.",
      ],
      onWrong: [
        [
          "Two things stack. The atrial kick — the last bit of filling the atria contribute right before systole — is gone. And a rate that fast shortens the time available for the ventricle to fill at all.",
          "A normal heart absorbs both for a while. A ventricle already working at twenty-five percent doesn't have the reserve to.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf11",
      speaker: "okafor",
      tier: "core",
      domain: "treatment",
      say: ["He needs rate control. What are you giving?"],
      choices: [
        {
          id: "a",
          text: "IV amiodarone, and avoid diltiazem or verapamil given his ejection fraction",
        },
        { id: "b", text: "IV diltiazem — it's the more reliable agent for acute rate control" },
        { id: "c", text: "IV digoxin alone, since it's the safest option in heart failure" },
        { id: "d", text: "No specific rate control is needed — he's hemodynamically stable at this rate" },
      ],
      correct: "a",
      why: {
        b: "This is the one that hurts him. Non-dihydropyridine calcium channel blockers are meaningfully negatively inotropic — exactly the class of drug you don't want in a ventricle already struggling, and it can tip a wet-and-warm patient into wet-and-cold.",
        c: "Digoxin has a real role, often adjunctively — but its onset is too slow to be your primary agent for acute, symptomatic RVR.",
        d: "Stable is relative. The rate itself is a meaningful part of why he's decompensating — see the last question.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        "Good. That's the one people reach for on reflex without stopping to think about what a non-dihydropyridine does to contractility.",
      ],
      onWrong: [
        [
          "Amiodarone. The instinct to reach for diltiazem is understandable — it works fast and it's what you'd use in someone with normal function.",
          "But non-dihydropyridine calcium channel blockers meaningfully reduce contractility. In a ventricle already at twenty-five percent, that can turn a wet-and-warm patient wet-and-cold in front of you.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf12",
      speaker: "okafor",
      tier: "core",
      domain: "guidelines",
      say: [
        "Separate from anything about fixing the rhythm — does he need anticoagulation started, tonight, regardless?",
      ],
      choices: [
        {
          id: "a",
          text: "Yes — new atrial fibrillation with heart failure, diabetes, hypertension and his age puts his stroke risk score well above the threshold, independent of any rhythm-control plan",
        },
        { id: "b", text: "No — anticoagulation can wait until a decision about cardioversion is made" },
        { id: "c", text: "No — his risk score is too low to justify it" },
        { id: "d", text: "Only if he ends up undergoing cardioversion" },
      ],
      correct: "a",
      why: {
        b: "Stroke prevention isn't contingent on the rhythm strategy. Delaying it delays something with real, ongoing risk for no benefit.",
        c: "Add it up: heart failure, hypertension, diabetes, his age. He clears the threshold for anticoagulation easily.",
        d: "The indication comes from his risk factors, not from whether he's cardioverted.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: ["Right. Start it tonight. This part isn't a judgment call."],
      onWrong: [
        [
          "Start it tonight. Heart failure, hypertension, diabetes, his age — his risk score clears the threshold on its own, well before you get to any question about the rhythm.",
          "This one isn't a judgment call the way the rhythm question is.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf13",
      speaker: "ezra",
      tier: "bonus",
      domain: "guidelines",
      wager: true,
      say: [
        "Okay but — if the AFib is what's causing all of this, why don't we just cardiovert him tonight and fix the actual problem?",
      ],
      choices: [
        {
          id: "a",
          text: "Because the duration of his atrial fibrillation is unknown — cardioverting risks dislodging an atrial thrombus and causing a stroke unless duration is confirmed under 48 hours, a TEE excludes thrombus, or he's been anticoagulated first",
        },
        { id: "b", text: "Cardioversion is contraindicated in patients with heart failure" },
        { id: "c", text: "We should cardiovert him immediately — fixing the rhythm fixes everything, including the risk of stroke" },
        { id: "d", text: "The amiodarone will chemically cardiovert him within minutes, so electrical cardioversion isn't needed" },
      ],
      correct: "a",
      why: {
        b: "Heart failure itself isn't the contraindication. The thromboembolic risk from an unknown-duration arrhythmia is.",
        c: "It's backwards — cardioverting an AFib of unknown duration is how you cause the stroke you're trying to prevent, not how you avoid it.",
        d: "Amiodarone can chemically cardiovert, but not reliably within minutes — and even if it did, the thrombus risk doesn't disappear just because the cardioversion wasn't electrical.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        "Right — so it's not that we can't fix the rhythm. It's that we don't know how long he's been in it.",
      ],
      onWrong: [
        [
          "We don't know how long he's actually been in this. 'New' just means new to us — it may have been going on for days before he noticed.",
          "Cardiovert an atrial fibrillation of unknown duration and you risk dislodging a thrombus that's had time to form. Rate control and anticoagulate first; rhythm control is a decision for later, made deliberately.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf14",
      speaker: "ezra",
      tier: "bonus",
      domain: "guidelines",
      pairs: "hf13",
      wager: true,
      say: [
        "So when would you ever cardiovert him without waiting — regardless of how long he's been in it?",
      ],
      choices: [
        {
          id: "a",
          text: "If he's hemodynamically unstable because of the arrhythmia — cardiogenic shock, refractory pulmonary edema, ongoing ischemia — the immediate threat to his life outweighs the thromboembolic risk",
        },
        { id: "b", text: "Once his BNP normalizes" },
        { id: "c", text: "After exactly 48 hours of anticoagulation, regardless of how he's doing" },
        { id: "d", text: "Only once a TEE has excluded a thrombus, even if he becomes unstable" },
      ],
      correct: "a",
      why: {
        b: "BNP has nothing to do with the timing decision.",
        c: "That's roughly the elective pathway for a stable patient. It isn't the answer to 'what would make this urgent.'",
        d: "This is exactly backwards for an unstable patient — you don't wait for a TEE while someone is dying in front of you.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        [
          "Right. Instability changes the calculus completely — a small, real stroke risk becomes acceptable against a certain, immediate one.",
          "He isn't there. He's wet and warm, not wet and cold. That's exactly why the distinction from earlier matters — it's the thing that tells you which patient you're looking at.",
        ],
      ],
      onWrong: [
        [
          "Instability. Cardiogenic shock, pulmonary edema you can't oxygenate through, ischemia the rhythm is driving — once the arrhythmia itself is about to kill him, the calculation flips and you accept the stroke risk because the alternative is worse and immediate.",
          "He isn't in that category tonight. He's wet and warm, not wet and cold — which is exactly why that distinction from earlier is the one that decides this.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf15",
      speaker: "okafor",
      tier: "bonus",
      domain: "complications",
      wager: true,
      say: [
        "Quick hypothetical, since you'll see it eventually.",
        [
          "Same patient, same rhythm — but his pressure's 78 over 50, his skin's mottled and cool, and his pulse pressure is narrow.",
          "Does anything about tonight's plan change?",
        ],
      ],
      choices: [
        {
          id: "a",
          text: "Yes — that's wet and cold, cardiogenic shock. Diuresis alone won't fix inadequate perfusion; he'd need inotropic or vasopressor support, likely an ICU bed, and consideration of mechanical circulatory support",
        },
        { id: "b", text: "No — diuresis is still the priority regardless of his perfusion status" },
        { id: "c", text: "You'd add a second diuretic and increase the furosemide dose further" },
        { id: "d", text: "You'd urgently anticoagulate and move straight to cardioversion" },
      ],
      correct: "a",
      why: {
        b: "This is the trap. Diuresing a hypoperfused patient can drop preload further and worsen the shock you're trying to treat.",
        c: "More diuretic treats congestion, not perfusion. It's the wrong axis entirely for a cold patient.",
        d: "That's the rhythm question from a minute ago, not the perfusion question being asked here.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: [
        "Exactly. Same rhythm, same congestion — completely different patient, and completely different plan.",
      ],
      onWrong: [
        [
          "That's wet and cold — cardiogenic shock. Diuretics don't fix a perfusion problem, and pushing them here can make it worse by dropping preload further.",
          "He'd need inotropic or vasopressor support, an ICU bed, and a conversation about mechanical circulatory support if he doesn't turn around. Same rhythm, same congestion — a completely different patient.",
        ],
      ],
    },

    {
      kind: "slider",
      id: "hf16",
      speaker: "pharmacy",
      tier: "core",
      domain: "treatment",
      say: [
        "Pharmacy. He's on {=80} milligrams of oral furosemide a day at home and none of it's touched him tonight.",
        "What do you want as his first IV dose?",
      ],
      min: 20,
      max: 200,
      step: 10,
      start: 40,
      accept: [60, 100],
      unit: "mg IV",
      decimals: 0,
      derived: { label: "× his home oral dose", perUnit: 0.0125, decimals: 2 },
      rep: { who: "okafor", points: 2 },
      onRight: ["That'll do it. At least his home total daily dose, given IV."],
      onWrong: [
        [
          "Start at least at his home total daily oral dose, given IV — so around {=80} milligrams.",
          "Oral absorption is unreliable in a gut this congested, and under-dosing here just means a slower, more frustrating night for everyone.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "hf17",
      draw: 1,
      speaker: "system",
      say: ["First-dose recheck resulted."],
    },

    {
      kind: "say",
      id: "hf17b",
      speaker: "dani",
      say: [
        [
          "He's made about {=900} mLs since the first dose.",
          "Rate's coming down with the amiodarone running.",
        ],
      ],
      variants: [
        {
          whenMed: "carvedilol",
          is: "hold",
          say: [
            [
              "He's made about {=900} mLs since the first dose.",
              "Rate's coming down with the amiodarone, though slower than I'd have expected — I noticed the carvedilol got held on the order set.",
            ],
          ],
        },
      ],
    },

    {
      kind: "say",
      id: "hf18",
      speaker: "dani",
      say: ["Repeat chemistry's back."],
    },

    {
      kind: "mcq",
      id: "hf19",
      speaker: "dani",
      tier: "core",
      domain: "complications",
      say: [
        "His creatinine's {cr@1}, up from {cr@0}. He's still making good urine and he's a litre lighter than when he came in.",
        "Do you want me to hold the furosemide?",
      ],
      choices: [
        {
          id: "a",
          text: "No — keep decongesting him. A creatinine rise during aggressive diuresis is common, doesn't reliably predict a worse outcome, and isn't a reason to stop treatment in someone who's still congested and still urinating well",
        },
        { id: "b", text: "Yes — hold the diuretic and give a fluid bolus for acute kidney injury" },
        { id: "c", text: "Yes — this is worsening renal failure and he needs an urgent nephrology consult before anything else" },
        { id: "d", text: "No, but cut the dose in half to be cautious" },
      ],
      correct: "a",
      why: {
        b: "A fluid bolus in someone this congested is close to the worst thing you could do. His problem was never intravascular volume depletion.",
        c: "Urgent, tonight, no — he's making urine, he's improving symptomatically, and the numbers are moving the way you'd expect. Worth mentioning at handover, not an emergency.",
        d: "Halving the dose slows his decongestion for a bump that, on its own, isn't a reason to change course.",
      },
      rep: { who: "dani", points: 3 },
      onRight: ["Good. I'll keep it running and keep an eye on his output."],
      onWrong: [
        [
          "I'd keep going. He's still congested and he's still making urine — those are the two things that actually matter here, not one number moving in a direction that scares people.",
          "I'll keep it running and let you know if his output drops off.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf20",
      speaker: "okafor",
      tier: "core",
      domain: "pathophys",
      pairs: "hf19",
      say: ["Dani's right not to worry yet. Why might his creatinine be doing that?"],
      choices: [
        {
          id: "a",
          text: "As venous congestion resolves and intrathoracic and renal hemodynamics shift, the creatinine can rise transiently — a pattern distinct from prerenal injury caused by true volume depletion",
        },
        { id: "b", text: "He's being over-diuresed and is now intravascularly dry" },
        { id: "c", text: "The furosemide is directly nephrotoxic at this dose" },
        { id: "d", text: "It reflects an unrelated new kidney injury coincidentally starting tonight" },
      ],
      correct: "a",
      why: {
        b: "If he were dry, he wouldn't still be making the volume of urine Dani just reported. Watch the whole picture, not the one number.",
        c: "Furosemide isn't meaningfully nephrotoxic at ordinary doses. That's not the mechanism here.",
        d: "Reaching for 'unrelated and coincidental' before you've considered the far more likely explanation isn't good reasoning, even when it happens to be technically possible.",
      },
      rep: { who: "okafor", points: 2 },
      onRight: [
        "Right. It's exactly why we watch urine output and symptoms, not just the creatinine, when we're deciding whether decongestion is working.",
      ],
      onWrong: [
        [
          "The precise mechanism is debated, but the pattern is well described: as congestion improves, creatinine can rise transiently without it representing true injury or predicting a worse outcome.",
          "Which is exactly why urine output and symptoms — not the creatinine alone — are what tell you whether decongestion is working.",
        ],
      ],
    },

    {
      kind: "confirm",
      id: "hf21",
      speaker: "pharmacy",
      tier: "core",
      domain: "guidelines",
      say: [
        "Pharmacy again — I've got an order here to hold the carvedilol, given tonight's admission.",
        "Want me to process that?",
      ],
      affirmLabel: "Yes, hold it",
      denyLabel: "No — keep it going",
      correct: "deny",
      followUp: {
        prompt: "Why keep a beta blocker running in someone who's actively decompensating?",
        choices: [
          {
            id: "a",
            text: "Reflexive discontinuation in routine decompensation is associated with worse outcomes — it's held only for cardiogenic shock, symptomatic hypotension, or significant bradycardia, none of which he has",
          },
          { id: "b", text: "Stopping it would cause dangerous rebound hypertension" },
          { id: "c", text: "Beta blockers directly treat volume overload" },
          { id: "d", text: "It doesn't meaningfully matter either way during an acute admission" },
        ],
        correct: "a",
        why: {
          b: "Rebound hypertension isn't the concern driving this decision.",
          c: "Beta blockers don't treat congestion. Diuretics do. That's not the reason to continue it.",
          d: "It matters a great deal — this is one of the most common and most avoidable errors in decompensated heart failure.",
        },
      },
      rep: { who: "pharmacy", points: 3 },
      onRight: [
        [
          "Agreed. I'll leave it as written.",
          "This is the one that gets held on reflex more than almost anything else — 'he's sick, stop the beta blocker' — and it's usually wrong.",
        ],
      ],
      onWrong: [
        [
          "I'm going to hold off on that order. Wet and warm isn't a reason to stop a beta blocker — cardiogenic shock is, and he isn't in it.",
          "This gets stopped on reflex more than almost anything else in heart failure, and it's usually the wrong call.",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf22",
      speaker: "ezra",
      tier: "bonus",
      domain: "pathophys",
      wager: true,
      say: [
        "One more — I read that if the furosemide alone isn't working, you add metolazone.",
        "Why does that actually help? It seems like a weak diuretic on its own.",
      ],
      choices: [
        {
          id: "a",
          text: "Loop diuretics block sodium reabsorption in the thick ascending limb, and the nephron compensates downstream in the distal tubule — metolazone blocks that segment too, so together they produce a synergy neither achieves alone",
        },
        { id: "b", text: "Metolazone is simply a stronger diuretic than furosemide and effectively replaces it" },
        { id: "c", text: "Metolazone works by directly increasing cardiac contractility" },
        { id: "d", text: "There's no real synergy — it's added mainly for its antihypertensive effect" },
      ],
      correct: "a",
      why: {
        b: "Backwards — metolazone alone is a fairly weak diuretic. It's the combination, not a replacement, that matters.",
        c: "That's an inotrope's job, not a diuretic's. Wrong mechanism entirely.",
        d: "The synergy is real and well described — sequential nephron blockade is exactly why the combination works when either drug alone plateaus.",
      },
      rep: { who: "ezra", points: 3 },
      onRight: [
        "Sequential nephron blockade. So it's not that metolazone is stronger — it's that it closes the loophole the loop diuretic leaves open.",
      ],
      onWrong: [
        [
          "The nephron compensates for a loop diuretic by reabsorbing more sodium downstream, in the distal tubule. Metolazone blocks exactly that segment.",
          "Together they close off sodium reabsorption at two points instead of one — sequential nephron blockade — which is why the combination can produce dramatic diuresis when furosemide alone has plateaued.",
        ],
      ],
    },

    {
      kind: "labs",
      id: "hf23",
      draw: 2,
      speaker: "system",
      say: ["Next morning — repeat labs resulted."],
    },

    {
      kind: "selectAll",
      id: "hf24",
      speaker: "okafor",
      tier: "core",
      domain: "diagnosis",
      say: [
        "He's down another two litres and breathing easier. Before we move on — what actually brought him in?",
        "And don't tell me how many.",
      ],
      choices: [
        { id: "diet", text: "Dietary indiscretion — the wedding dinner" },
        { id: "med", text: "Held his diuretic the morning of the wedding" },
        { id: "nsaid", text: "Started ibuprofen for his knee" },
        { id: "afib", text: "New atrial fibrillation with rapid ventricular response" },
        { id: "mi", text: "Acute myocardial infarction" },
        { id: "pe", text: "Undiagnosed pulmonary embolism" },
        { id: "pna", text: "Community-acquired pneumonia" },
        { id: "fluid", text: "Excessive water intake, independent of sodium" },
        { id: "progression", text: "Simple progression of his cardiomyopathy, with no identifiable trigger" },
        { id: "statin", text: "Medication nonadherence to his statin" },
      ],
      correct: ["diet", "med", "nsaid", "afib"],
      why: {
        diet: "A salty catered dinner in someone with almost no cardiac reserve is a real and common trigger, not a footnote.",
        med: "Skipping even one dose on a day he specifically wanted to avoid the bathroom mattered.",
        nsaid: "Blunts diuretic response and promotes retention — a genuine contributor, not just bad luck.",
        afib: "The one nobody was looking for until the ECG came back.",
        mi: "The troponin pattern — mildly elevated, flat rather than rising — argues against an evolving infarct as the trigger.",
        progression: "There's always a temptation to reach for 'no clear cause' when four real ones are sitting in the history. Keep looking before you accept that.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: ["Good. Four real reasons, and every one of them is something you can act on."],
      onWrong: ["A few of those aren't quite right. Worth a second look before you write the note."],
    },

    {
      kind: "say",
      id: "hf25",
      speaker: "harold",
      say: [
        [
          "Doc, can I ask something? My daughter's hosting Thanksgiving in a few weeks.",
          "Am I going to end up back here if I have a plate of stuffing?",
        ],
      ],
    },

    {
      kind: "mcq",
      id: "hf26",
      speaker: "harold",
      tier: "core",
      domain: "communication",
      say: ["So — stuffing or no stuffing?"],
      choices: [
        {
          id: "a",
          text: "Probably not from one meal — it's the pattern that matters. Weigh yourself every morning, and if you're up a few pounds, call us before it becomes a problem, not after.",
        },
        { id: "b", text: "You should avoid family gatherings with food until your heart failure is fully cured" },
        { id: "c", text: "One meal won't matter, so there's no real need to weigh yourself regularly" },
        { id: "d", text: "As long as you take an extra water pill beforehand, the sodium doesn't matter" },
      ],
      correct: "a",
      why: {
        b: "Heart failure isn't cured, and telling him to avoid his family indefinitely is both untrue and a plan nobody actually follows.",
        c: "This throws away the one habit — daily weights — that catches the next admission early.",
        d: "Encourages him to self-adjust his diuretic around meals without anyone watching his potassium or his kidneys. That's how people end up back here for a different reason.",
      },
      rep: { who: "harold", points: 3 },
      onRight: [
        [
          "Alright. So it's not about never having stuffing again.",
          "I can live with weighing myself. I just didn't know that was the thing that mattered.",
        ],
      ],
      onWrong: [
        "Right. I'll try to remember that.",
        "I still don't really know what I'm supposed to watch for, though.",
      ],
    },

    {
      kind: "labs",
      id: "hf27",
      draw: 3,
      speaker: "system",
      say: ["Discharge morning — labs resulted."],
    },

    {
      kind: "selectAll",
      id: "hf28",
      speaker: "okafor",
      tier: "core",
      domain: "guidelines",
      say: [
        "He's back near his dry weight, creatinine's {cr@3}, and he's rate-controlled.",
        "What's in the discharge plan?",
      ],
      choices: [
        { id: "weights", text: "Daily weights with a clear threshold for calling — 3 lb in a day or 5 lb in a week" },
        { id: "diet", text: "Sodium-restricted diet education" },
        { id: "followup", text: "Heart failure or cardiology follow-up within one to two weeks" },
        { id: "restart", text: "Restart lisinopril and spironolactone once creatinine and potassium are stable, with a recheck" },
        { id: "gdmt", text: "Plan for outpatient optimization of his guideline-directed therapy" },
        { id: "anticoag_fu", text: "Anticoagulation and rhythm-control follow-up arranged for the new atrial fibrillation" },
        { id: "resume_nsaid", text: "Resume ibuprofen as needed if the knee pain is severe" },
        { id: "stop_bb", text: "Permanently discontinue carvedilol given this admission" },
        { id: "no_restrict", text: "No fluid or dietary restrictions are needed once he feels better" },
        { id: "strict_fluid", text: "Strict lifelong fluid restriction to one litre daily" },
      ],
      correct: ["weights", "diet", "followup", "restart", "gdmt", "anticoag_fu"],
      cost: { resume_nsaid: "harmful", stop_bb: "harmful", no_restrict: "wasteful", strict_fluid: "wasteful" },
      why: {
        weights: "The single habit most likely to catch the next decompensation before it puts him back in a bed.",
        resume_nsaid: "This is exactly what brought him in. Acetaminophen for the knee, and a conversation about why.",
        stop_bb: "Third time tonight this has come up. It's not a discharge decision any more than it was an admission one.",
        strict_fluid: "He doesn't have the dilutional hyponatremia that would justify this. Ordinary sodium restriction and daily weights are the right tools here.",
      },
      rep: { who: "okafor", points: 3 },
      onRight: ["That's a real discharge plan. Good work tonight."],
      onWrong: ["We'll tighten a couple of those before it goes out."],
    },

    {
      kind: "say",
      id: "hf29",
      speaker: "okafor",
      say: [
        [
          "One thing before you go home.",
          "Everything that put him here — the dinner, the skipped dose, the ibuprofen, even the rhythm — is ordinary. None of it was reckless. That's most heart failure admissions, not the exception.",
        ],
        [
          "The exam told you he was wet before a single lab did. The ECG told you why. Neither of those needed a protocol — they needed you to actually look.",
          "Go home.",
        ],
      ],
    },
  ],
};
