// ============================================================================
// generate-cohort.mjs — build the synthetic stroke-dysphagia evaluation cohort
// ----------------------------------------------------------------------------
// 1. Read the Synthea CSV export; select patients with a stroke (SNOMED CVA)
//    condition → the recognized synthetic base population (demographic spine).
// 2. For each, generate the dysphagia layer (src/model.mjs) → a FHIR R4 Bundle
//    conforming to the IG profiles + a reference label (NOT a diagnostic gold).
// 3. Write per-patient bundles + labels.json + cohort-summary.json.
//
// Synthetic data only; no real patient. Deterministic (seeded).
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatePatient, makeRng, PARAMS } from './src/model.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const CSV_DIR = join(__dir, 'synthea-out', 'csv');
const COHORT_DIR = join(__dir, 'cohort');
const OUT_DIR = join(__dir, 'out');
const SEED = 20260716;
const STROKE_CODE = '230690007'; // SNOMED CT "Cerebrovascular accident (disorder)"

// --- minimal CSV parser (handles quoted fields) -----------------------------
function parseCsvLine(line) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
function readCsv(path) {
  const text = readFileSync(path, 'utf8');
  const lines = text.split(/\r?\n/).filter(l => l.length);
  const header = parseCsvLine(lines[0]);
  const idx = Object.fromEntries(header.map((h, i) => [h.trim().toUpperCase(), i]));
  return { idx, rows: lines.slice(1) };
}

// --- 1. select stroke patients ---------------------------------------------
console.log(`[1/3] Reading Synthea conditions.csv → selecting stroke (${STROKE_CODE}) patients…`);
const cond = readCsv(join(CSV_DIR, 'conditions.csv'));
const cPat = cond.idx['PATIENT'], cCode = cond.idx['CODE'];
const strokeIds = new Set();
for (const row of cond.rows) {
  const f = parseCsvLine(row);
  if (f[cCode] === STROKE_CODE) strokeIds.add(f[cPat]);
}
console.log(`      ${strokeIds.size} stroke patients found.`);

console.log('[2/3] Reading patients.csv → demographic spine…');
const pat = readCsv(join(CSV_DIR, 'patients.csv'));
const pId = pat.idx['ID'], pBirth = pat.idx['BIRTHDATE'], pGender = pat.idx['GENDER'],
      pFirst = pat.idx['FIRST'], pLast = pat.idx['LAST'];
const base = [];
for (const row of pat.rows) {
  const f = parseCsvLine(row);
  if (!strokeIds.has(f[pId])) continue;
  base.push({
    id: f[pId],
    birthDate: f[pBirth] || undefined,
    gender: (f[pGender] || '').toLowerCase() === 'm' ? 'male'
          : (f[pGender] || '').toLowerCase() === 'f' ? 'female' : 'unknown',
    name: (f[pFirst] || f[pLast]) ? [{ family: f[pLast] || 'Synthetic', given: [f[pFirst] || 'Patient'] }] : undefined,
  });
}
base.sort((a, b) => a.id.localeCompare(b.id)); // deterministic order

// --- 3. generate dysphagia layer + write -----------------------------------
console.log('[3/3] Generating dysphagia layer + FHIR bundles…');
for (const d of [COHORT_DIR, OUT_DIR]) { if (existsSync(d)) rmSync(d, { recursive: true, force: true }); mkdirSync(d, { recursive: true }); }
const rng = makeRng(SEED);
const labels = [];
for (const b of base) {
  const { bundle, label } = generatePatient(b, rng);
  writeFileSync(join(COHORT_DIR, `${b.id}.json`), JSON.stringify(bundle));
  labels.push(label);
}
writeFileSync(join(OUT_DIR, 'labels.json'), JSON.stringify(labels, null, 2));

// --- cohort composition summary (descriptive, NOT performance) --------------
const n = labels.length;
const sum = (f) => labels.filter(f).length;
const pct = (k) => `${k} (${(100 * k / n).toFixed(1)}%)`;
const summary = {
  seed: SEED, strokeCode: STROKE_CODE, syntheaPopulation: 25000, cohortN: n,
  params: PARAMS,
  composition: {
    dysphagia: pct(sum(l => l.dysphagia)),
    screenPositive: pct(sum(l => l.screenPos)),
    flagCoded: pct(sum(l => l.flagCoded)),
    flagUncoded_screenPos: pct(sum(l => l.screenPos && !l.flagCoded)),
    onThinFluids: pct(sum(l => l.onThin)),
    npo: pct(sum(l => l.isNpo)),
  },
  referenceLabels: {
    clinicalUnsafe_screenPos_thin_notNpo: pct(sum(l => l.clinicalUnsafe)),
    cqlEligible_codedFlag_thin_notNpo: pct(sum(l => l.cqlEligible)),
    interopGap_unsafe_but_flag_uncoded: pct(sum(l => l.interopGap)),
  },
};
writeFileSync(join(OUT_DIR, 'cohort-summary.json'), JSON.stringify(summary, null, 2));
console.log(`\n✅ Cohort ready: N=${n} → ${COHORT_DIR}`);
console.log(JSON.stringify(summary.composition, null, 2));
console.log('reference labels:', JSON.stringify(summary.referenceLabels, null, 2));
