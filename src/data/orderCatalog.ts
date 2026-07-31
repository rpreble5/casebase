/**
 * The shared order catalog.
 *
 * One fixed list, defined once, used by every case. A case declares which ids it
 * shows and how each scores — it never invents order names. That keeps a
 * physician reviewer checking clinical judgment instead of proofreading strings,
 * and it means adding a case costs no catalog work.
 *
 * `synonyms` is unused today (v1 is a picker, not free text) but is how people
 * actually talk, so it's captured while the items are being written rather than
 * reconstructed later.
 */

export type OrderCategory =
  | "Chemistry"
  | "Hematology"
  | "Endocrine"
  | "Micro"
  | "Imaging"
  | "Cardiac"
  | "Point of care"
  | "Fluids"
  | "Medications"
  | "Nursing";

export interface CatalogItem {
  id: string;
  name: string;
  category: OrderCategory;
  detail?: string;
  synonyms?: string[];
}

export const ORDER_CATALOG: CatalogItem[] = [
  // ---- Chemistry ----
  { id: "bmp", name: "Basic metabolic panel", category: "Chemistry", synonyms: ["bmp", "chem 7", "lytes", "electrolytes"] },
  { id: "cmp", name: "Comprehensive metabolic panel", category: "Chemistry", synonyms: ["cmp", "chem 14"] },
  { id: "mag", name: "Magnesium", category: "Chemistry", synonyms: ["mag", "mg"] },
  { id: "phos", name: "Phosphorus", category: "Chemistry", synonyms: ["phos", "po4"] },
  { id: "calcium", name: "Ionized calcium", category: "Chemistry" },
  { id: "lipase", name: "Lipase", category: "Chemistry" },
  { id: "lft", name: "Liver function panel", category: "Chemistry", synonyms: ["lfts", "hepatic panel"] },
  { id: "lactate", name: "Lactate", category: "Chemistry", synonyms: ["lactic acid"] },
  { id: "osm", name: "Serum osmolality", category: "Chemistry", synonyms: ["osm", "serum osms"] },
  { id: "vbg", name: "Venous blood gas", category: "Chemistry", synonyms: ["vbg", "gas", "blood gas"] },
  { id: "abg", name: "Arterial blood gas", category: "Chemistry", synonyms: ["abg"] },
  { id: "salicylate", name: "Salicylate level", category: "Chemistry", synonyms: ["asa level", "aspirin level"] },
  { id: "etoh", name: "Ethanol level", category: "Chemistry", synonyms: ["alcohol level"] },

  // ---- Hematology ----
  { id: "cbc", name: "CBC with differential", category: "Hematology", synonyms: ["cbc", "blood count"] },
  { id: "coags", name: "PT / INR and PTT", category: "Hematology", synonyms: ["coags", "inr"] },
  { id: "type_screen", name: "Type and screen", category: "Hematology" },
  { id: "crossmatch", name: "Crossmatch 2 units", category: "Hematology", synonyms: ["crossmatch", "type and cross"] },
  { id: "prbc", name: "Transfuse packed red cells", category: "Hematology", synonyms: ["prbc", "transfuse", "blood"] },
  { id: "fibrinogen", name: "Fibrinogen", category: "Hematology" },

  // ---- Endocrine ----
  { id: "bhb", name: "Beta-hydroxybutyrate, serum", category: "Endocrine", synonyms: ["bhb", "beta hydroxybutyrate", "serum ketones"] },
  { id: "a1c", name: "Hemoglobin A1c", category: "Endocrine", synonyms: ["a1c", "hba1c"] },
  { id: "tsh", name: "TSH", category: "Endocrine" },
  { id: "cpeptide", name: "C-peptide", category: "Endocrine" },
  { id: "cortisol", name: "Cortisol", category: "Endocrine" },

  // ---- Micro ----
  { id: "ua", name: "Urinalysis with microscopy", category: "Micro", synonyms: ["ua", "urinalysis"] },
  { id: "urine_cx", name: "Urine culture", category: "Micro" },
  { id: "blood_cx", name: "Blood cultures x2", category: "Micro", synonyms: ["blood cultures", "cultures"] },
  { id: "resp_panel", name: "Respiratory viral panel", category: "Micro", synonyms: ["viral panel", "flu covid"] },
  { id: "strep", name: "Rapid strep", category: "Micro" },

  // ---- Imaging ----
  { id: "cxr", name: "Chest x-ray, portable", category: "Imaging", synonyms: ["cxr", "chest xray"] },
  { id: "kub", name: "Abdominal x-ray", category: "Imaging", synonyms: ["kub"] },
  { id: "ct_head", name: "CT head without contrast", category: "Imaging", synonyms: ["ct head", "head ct"] },
  { id: "ct_abd", name: "CT abdomen/pelvis with contrast", category: "Imaging", synonyms: ["ct abd", "cap"] },
  { id: "cta_chest", name: "CTA chest", category: "Imaging", synonyms: ["cta", "pe protocol"] },
  { id: "ruq_us", name: "Right upper quadrant ultrasound", category: "Imaging", synonyms: ["ruq us"] },

  // ---- Cardiac ----
  { id: "ecg", name: "12-lead ECG", category: "Cardiac", synonyms: ["ecg", "ekg", "12 lead"] },
  { id: "trop", name: "High-sensitivity troponin", category: "Cardiac", synonyms: ["troponin", "trop"] },
  { id: "tele", name: "Continuous telemetry", category: "Cardiac", synonyms: ["telemetry", "monitor"] },
  { id: "echo", name: "Transthoracic echocardiogram", category: "Cardiac", synonyms: ["echo", "tte"] },

  // ---- Point of care ----
  { id: "poc_glucose", name: "Point-of-care glucose", category: "Point of care", synonyms: ["fingerstick", "accucheck", "cbg"] },
  { id: "q1h_glucose", name: "Hourly point-of-care glucose", category: "Point of care", synonyms: ["q1h glucose", "hourly sugars"] },
  { id: "urine_ketones", name: "Urine ketones (dipstick)", category: "Point of care", synonyms: ["urine ketones", "dipstick ketones"] },
  { id: "poc_preg", name: "Urine pregnancy test", category: "Point of care", synonyms: ["upt", "hcg", "pregnancy test"] },

  // ---- Fluids ----
  { id: "ns_bolus", name: "Normal saline bolus", category: "Fluids", synonyms: ["ns bolus", "saline bolus", "fluids"] },
  { id: "lr_bolus", name: "Lactated Ringer's bolus", category: "Fluids", synonyms: ["lr", "ringers"] },
  { id: "ns_maint", name: "Normal saline infusion", category: "Fluids", synonyms: ["ns drip", "maintenance saline"] },
  { id: "half_ns", name: "Half-normal saline infusion", category: "Fluids", synonyms: ["1/2 ns", "half normal"] },
  { id: "d5_half_ns", name: "D5 half-normal saline infusion", category: "Fluids", synonyms: ["d5 half ns", "dextrose containing fluid"] },

  // ---- Medications ----
  { id: "insulin_gtt", name: "Regular insulin infusion", category: "Medications", synonyms: ["insulin drip", "insulin gtt"] },
  { id: "insulin_bolus", name: "Regular insulin IV bolus", category: "Medications", synonyms: ["insulin bolus", "iv push insulin"] },
  { id: "insulin_glargine", name: "Insulin glargine, subcutaneous", category: "Medications", synonyms: ["lantus", "basal insulin", "glargine"] },
  { id: "kcl_iv", name: "Potassium chloride IV", category: "Medications", synonyms: ["kcl", "potassium iv", "k replacement"] },
  { id: "kcl_po", name: "Potassium chloride, oral", category: "Medications", synonyms: ["k po", "oral potassium"] },
  { id: "bicarb", name: "Sodium bicarbonate IV", category: "Medications", synonyms: ["bicarb", "amp of bicarb", "nahco3"] },
  { id: "ondansetron", name: "Ondansetron IV", category: "Medications", synonyms: ["zofran"] },
  { id: "mag_repl", name: "Magnesium sulfate IV", category: "Medications", synonyms: ["mag sulfate", "magnesium replacement"] },
  { id: "phos_repl", name: "Potassium phosphate IV", category: "Medications", synonyms: ["phosphate replacement", "kphos"] },
  { id: "abx_empiric", name: "Empiric broad-spectrum antibiotics", category: "Medications", synonyms: ["antibiotics", "abx"] },
  { id: "heparin_ppx", name: "Prophylactic heparin, subcutaneous", category: "Medications", synonyms: ["dvt ppx", "heparin ppx"] },
  { id: "metoclopramide", name: "Metoclopramide IV", category: "Medications", synonyms: ["reglan"] },
  { id: "ppi_gtt", name: "Pantoprazole IV infusion", category: "Medications", synonyms: ["ppi drip", "protonix drip", "pantoprazole infusion"] },
  { id: "ppi_bolus", name: "Pantoprazole IV bolus", category: "Medications", synonyms: ["protonix bolus"] },
  { id: "octreotide", name: "Octreotide infusion", category: "Medications", synonyms: ["octreotide", "sandostatin"] },
  { id: "erythromycin_pro", name: "Erythromycin IV, pre-endoscopy", category: "Medications", synonyms: ["erythromycin", "prokinetic"] },
  { id: "andexanet", name: "Andexanet alfa", category: "Medications", synonyms: ["andexxa", "factor xa reversal"] },
  { id: "pcc", name: "4-factor prothrombin complex concentrate", category: "Medications", synonyms: ["pcc", "kcentra"] },
  { id: "vitk", name: "Vitamin K IV", category: "Medications", synonyms: ["vitamin k", "phytonadione"] },
  { id: "txa", name: "Tranexamic acid IV", category: "Medications", synonyms: ["txa"] },

  // ---- Nursing ----
  { id: "strict_io", name: "Strict intake and output", category: "Nursing", synonyms: ["strict i/o", "i and o"] },
  { id: "foley", name: "Indwelling urinary catheter", category: "Nursing", synonyms: ["foley", "catheter"] },
  { id: "npo", name: "NPO", category: "Nursing", synonyms: ["nothing by mouth"] },
  { id: "neuro_checks", name: "Hourly neuro checks", category: "Nursing", synonyms: ["neuro checks"] },
  { id: "large_bore", name: "Two large-bore IVs", category: "Nursing", synonyms: ["large bore iv", "two ivs", "access"] },
  { id: "gi_consult", name: "Gastroenterology consult", category: "Nursing", synonyms: ["gi consult", "call gi"] },
  { id: "ng_lavage", name: "Nasogastric lavage", category: "Nursing", synonyms: ["ng lavage", "ng tube"] },
  { id: "icu_admit", name: "Admit to ICU", category: "Nursing", synonyms: ["icu", "unit"] },
  { id: "stepdown_admit", name: "Admit to stepdown", category: "Nursing", synonyms: ["stepdown", "intermediate care"] },
];

const BY_ID = new Map(ORDER_CATALOG.map((i) => [i.id, i]));

export function catalogItem(id: string): CatalogItem {
  const item = BY_ID.get(id);
  if (!item) throw new Error(`Unknown catalog order: "${id}"`);
  return item;
}
