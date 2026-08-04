// ============================================================================
// Synthetic dysphagia-layer model + FHIR R4 resource builders
// ----------------------------------------------------------------------------
// Purpose: turn a base stroke patient (sampled from Synthea) into a small set of
// FHIR resources conforming to the Stroke-Dysphagia Care-Transition IG profiles,
// driven by a documented, seeded generative model.
//
// FRAMING (important — read README.md §Evaluation): this is a COMPUTABLE-CDS
// FEASIBILITY + INTEROPERABILITY-DEPENDENCY demonstration. We do NOT compute a
// diagnostic-accuracy / PPV metric — that would be circular on synthetic data.
// Instead we show (1) the CQL rule compiles + executes on a real engine over
// profile-conformant instances (round-trip executability), and (2) the rule's
// yield depends on whether the safety-critical aspiration-risk flag is CODED
// (machine-readable per the IG) vs left as un-coded free text — quantifying the
// interoperability cost the IG is designed to remove. Synthetic data only; no
// real patient; no clinical-benefit claim.
// ============================================================================

const SCT = 'http://snomed.info/sct';
const CANON = 'https://sefatuncer.github.io/stroke-dysphagia-fhir-ig';
const SCALES = `${CANON}/CodeSystem/dysphagia-scales-temp`;

// --- Model parameters (documented + cited in README.md §Model) --------------
export const PARAMS = {
  // Post-stroke swallowing epidemiology (Martino 2005 syst. review: dysphagia
  // ~37-45% clinical / up to 64-78% instrumental). Illustrative, not empirical.
  pDysphagia: 0.50,               // P(swallowing impairment | stroke)

  // Bedside screen (GUSS) flags aspiration risk. P(screen-positive) conditioned
  // on dysphagia — this is the CLINICAL flag (independent of whether it later
  // gets coded). Trapl 2007; bedside-screen literature.
  pScreenPosGivenDysphagia: 0.70,
  pScreenPosGivenNoDysphagia: 0.05,

  // ---- The interoperability variable (the paper's thesis) -----------------
  // Even when a clinician flags aspiration risk, it is frequently recorded only
  // as free text / an un-coded note, so no machine-readable Observation exists
  // and a computable rule cannot see it. Clinical anchor: ~45% of discharge
  // summaries omit dysphagia recommendations in a transferable form.
  pFlagCoded: 0.70,               // P(flag recorded as coded FHIR Observation | screen-positive)

  // Care-plan fluid consistency. Guideline (AHA/ASA, ESO): screen-positive
  // patients should get thickened fluids (IDDSI >= L1) or NPO, never be left on
  // thin (unmodified, IDDSI L0) fluids. Under-treatment = the safety gap.
  dietGivenScreenPos: { npo: 0.20, thickened: 0.45, thin: 0.35 },
  dietGivenScreenNeg: { npo: 0.02, thickened: 0.08, thin: 0.90 },
};

// Base for Bundle.entry.fullUrl. `.invalid` is reserved by RFC 2606 and can
// never resolve, so nothing here can be mistaken for a real endpoint.
const SYNTHETIC_BASE = 'https://synthetic.invalid/fhir';

// --- Verified codes (SNOMED CT Intl 20250201; see the supplementary
//     terminology log for the per-item queries) -------------------------------
// Identifiers only, no display terms. Retrieval matches on system + code, so a
// label would change nothing computationally — but writing our own shorthand
// for a SNOMED concept into 333 deposited bundles would put an altered term in
// the archive, which the CC BY-ND basis this artifact publishes under does not
// allow. The implementer's terminology server supplies the official display.
const CODES = {
  guss:      { system: SCT, code: '1289999007' },
  vfss:      { system: SCT, code: '241149003'  },
  atRisk:    { system: SCT, code: '371736008'  },
  iddsiThin: { system: SCT, code: '1231508001' },
  iddsiL1:   { system: SCT, code: '1237441005' },
  iddsiL2:   { system: SCT, code: '1237442003' },
  iddsiL3:   { system: SCT, code: '1237444002' },
};

// --- Seeded PRNG (mulberry32) — deterministic, reproducible -----------------
export function makeRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const bern = (rng, p) => rng() < p;
function pick(rng, dist) {
  let r = rng(), acc = 0;
  for (const [k, p] of Object.entries(dist)) { acc += p; if (r < acc) return k; }
  return Object.keys(dist)[Object.keys(dist).length - 1];
}
function normInt(rng, mean, sd, lo, hi) {
  const u1 = Math.max(rng(), 1e-9), u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(lo, Math.min(hi, Math.round(mean + sd * z)));
}

// --- FHIR resource builders -------------------------------------------------
const cc = (c) => ({ coding: [{ system: c.system, code: c.code }] });

// The cohort's inclusion criterion is a cerebrovascular-accident condition, which
// is applied upstream against the Synthea export. That export is too large to
// deposit, so without this resource a reader of the archive could not check that
// the deposited bundles are the cohort the Methods describe.
function strokeCondition(pid, date) {
  return {
    resourceType: 'Condition', id: `${pid}-cva`,
    clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
    code: { coding: [{ system: SCT, code: '230690007' }] },
    subject: { reference: `Patient/${pid}` }, onsetDateTime: date,
  };
}
function gussObs(pid, score, date) {
  return {
    resourceType: 'Observation', id: `${pid}-guss`,
    meta: { profile: [`${CANON}/StructureDefinition/swallowing-screening-result`] },
    status: 'final', code: cc(CODES.guss),
    subject: { reference: `Patient/${pid}` }, effectiveDateTime: date, valueInteger: score,
  };
}
function aspirationFlag(pid, date) {
  return {
    resourceType: 'Observation', id: `${pid}-aspflag`,
    meta: { profile: [`${CANON}/StructureDefinition/aspiration-risk-flag`] },
    status: 'final', code: cc(CODES.atRisk),
    subject: { reference: `Patient/${pid}` }, effectiveDateTime: date,
    // value omitted: the finding is asserted by presence of the coded Observation
    // (the rule keys on code, not value) — consistent with the AspirationRiskFlag profile.
  };
}
function vfssPas(pid, pas, date) {
  return {
    resourceType: 'Observation', id: `${pid}-vfss`,
    meta: { profile: [`${CANON}/StructureDefinition/instrumental-swallow-assessment`] },
    status: 'final', code: cc(CODES.vfss),
    subject: { reference: `Patient/${pid}` }, effectiveDateTime: date,
    component: [{
      code: { coding: [{ system: SCALES, code: 'PAS', display: 'Penetration-Aspiration Scale (Rosenbek 1996) — score 1–8' }] },
      valueInteger: pas,
    }],
  };
}
function foisSeverity(pid, fois, date) {
  return {
    resourceType: 'Observation', id: `${pid}-fois`,
    meta: { profile: [`${CANON}/StructureDefinition/dysphagia-severity`] },
    status: 'final',
    code: { coding: [{ system: SCALES, code: 'FOIS', display: 'Functional Oral Intake Scale — level 1–7' }] },
    subject: { reference: `Patient/${pid}` }, effectiveDateTime: date, valueInteger: fois,
  };
}
function nutritionOrder(pid, kind, date) {
  const base = {
    resourceType: 'NutritionOrder', id: `${pid}-diet`,
    meta: { profile: [`${CANON}/StructureDefinition/dysphagia-nutrition-order`] },
    status: 'active', intent: 'order',
    patient: { reference: `Patient/${pid}` }, dateTime: date,
  };
  if (kind === 'npo') return base; // active order, NO oralDiet → CQL IsNPO = true
  const fluid = kind === 'thin' ? CODES.iddsiThin
    : [CODES.iddsiL1, CODES.iddsiL2, CODES.iddsiL3][pid.charCodeAt(pid.length - 1) % 3];
  base.oralDiet = { fluidConsistencyType: [cc(fluid)] };
  return base;
}

// --- Generate the dysphagia layer for one base patient ----------------------
export function generatePatient(basePatient, rng, params = PARAMS) {
  const pid = basePatient.id;
  const dScreen = '2026-03-08', dInstr = '2026-03-09', dOrder = '2026-03-10';

  // 1) Latent clinical state ------------------------------------------------
  const dysphagia = bern(rng, params.pDysphagia);
  // Clinical bedside screen result (aspiration-risk flagged by clinician):
  const screenPos = bern(rng, dysphagia ? params.pScreenPosGivenDysphagia : params.pScreenPosGivenNoDysphagia);

  // 2) Interoperability variable: was the flag recorded as a CODED Observation?
  //    (screen-positive but un-coded → invisible to the computable rule)
  const flagCoded = screenPos && bern(rng, params.pFlagCoded);

  // 3) Illustrative scores (not used by the rule; for realism / narrative) ---
  const guss = screenPos ? normInt(rng, 9, 3, 0, 19) : dysphagia ? normInt(rng, 15, 2, 10, 19) : normInt(rng, 19, 1, 15, 20);
  const pas  = screenPos ? normInt(rng, 6, 1, 3, 8) : normInt(rng, 2, 1, 1, 4);
  const fois = screenPos ? normInt(rng, 4, 1, 1, 6) : dysphagia ? normInt(rng, 6, 1, 4, 7) : normInt(rng, 7, 0.5, 6, 7);

  // 4) Care-plan fluid consistency (adherence gap) --------------------------
  const dietKind = pick(rng, screenPos ? params.dietGivenScreenPos : params.dietGivenScreenNeg);
  const onThin = dietKind === 'thin';
  const isNpo = dietKind === 'npo';

  // 5) Assemble FHIR bundle -------------------------------------------------
  const entries = [
    { resource: basePatientResource(basePatient) },
    { resource: strokeCondition(pid, dScreen) },
    { resource: gussObs(pid, guss, dScreen) },
    { resource: foisSeverity(pid, fois, dInstr) },
    { resource: nutritionOrder(pid, dietKind, dOrder) },
  ];
  if (flagCoded) entries.push({ resource: aspirationFlag(pid, dScreen) }); // ← coded flag only when recorded interoperably
  if (screenPos) entries.push({ resource: vfssPas(pid, pas, dInstr) });
  // Every entry needs a fullUrl: base FHIR requires one outside transactions and
  // batches, and without it the relative subject references cannot be resolved
  // inside the bundle. The host is an RFC 2606 reserved name that can never
  // resolve, which is the honest base for data that exists nowhere.
  for (const e of entries) e.fullUrl = `${SYNTHETIC_BASE}/${e.resource.resourceType}/${e.resource.id}`;
  const bundle = { resourceType: 'Bundle', id: `bundle-${pid}`, type: 'collection', entry: entries };

  // 6) Reference labels (NOT a diagnostic gold standard) --------------------
  //    clinicalUnsafe  : clinician-level safety gap (screen-positive + thin + not NPO),
  //                      independent of whether it was coded — the situation that
  //                      SHOULD surface at the care transition.
  //    cqlEligible     : what a correctly-authored rule CAN fire on (needs the
  //                      CODED flag). Compared against the engine output to prove
  //                      the CQL is authored faithfully (concordance == 100%).
  //    interopGap      : clinicalUnsafe cases the rule MISSES only because the
  //                      flag was not coded — the interoperability cost.
  const clinicalUnsafe = screenPos && onThin && !isNpo;
  const cqlEligible = flagCoded && onThin && !isNpo;
  const interopGap = clinicalUnsafe && !flagCoded;

  const label = {
    id: pid, dysphagia, screenPos, flagCoded, dietKind, onThin, isNpo,
    guss, pas, fois, clinicalUnsafe, cqlEligible, interopGap,
  };
  return { bundle, label };
}

function basePatientResource(p) {
  const r = {
    resourceType: 'Patient', id: p.id,
    meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
    gender: p.gender || 'unknown',
  };
  if (p.birthDate) r.birthDate = p.birthDate;
  if (p.name) r.name = p.name;
  return r;
}

export { CODES };
