// ============================================================================
// differential-check.mjs — a second implementation of the rule, and a
// disagreement count against the first.
// ----------------------------------------------------------------------------
// What problem this addresses. The round-trip check compares the CQL engine's
// verdicts with the generative model's own labels. Both come from the same
// specification applied by the same authors, so agreement cannot distinguish a
// correct rule from a misreading that was made twice. The manuscript declared
// that as a limitation: "there is no second implementation, so a misreading of
// the specification survives the round-trip check."
//
// This file is that second implementation. Three things make it independent of
// the first in the only sense available here:
//
//   * it is written from the RULE STATEMENT AS PRINTED in the manuscript
//     (§3.6, the three numbered conditions), not from the CQL source;
//   * it shares no code with the first: no CQL, no ELM, no cql-execution, no
//     cql-exec-fhir — it walks the serialized FHIR JSON directly;
//   * it is compared on inputs neither implementation was tuned to: the
//     deposited cohort AND the hand-authored branch-coverage fixtures.
//
// What it is NOT. It is not an independent party's implementation. The same
// authors wrote both, so a misconception about the CLINICAL question would
// survive in both. What this measures is narrower and worth stating exactly:
// whether the CQL, as compiled and executed, does what the manuscript says it
// does. That is specification-to-code fidelity, not clinical validity.
//
// The rule statement this implementation was written from, verbatim:
//
//   "alerting when three conditions hold:
//    1. a coded aspiration-risk flag (an Observation with SNOMED 371736008,
//       status final or amended);
//    2. an active nutrition order prescribing thin (unmodified, IDDSI Level 0,
//       SNOMED 1231508001) fluid consistency; and
//    3. no nil-by-mouth status (no NPO observation, no active non-oral order)."
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const COHORT = join(HERE, 'cohort');
const FIXTURES = join(HERE, 'branch-fixtures');

const SCT = 'http://snomed.info/sct';
const AT_RISK = '371736008';
const NIL_BY_MOUTH = '182923009';
const IDDSI_THIN = '1231508001';

// --- the second implementation ----------------------------------------------
// It is evaluated under TWO readings of condition 3, and both are reported.
//
//   'as-printed'  — literal: "no NPO observation", with no status qualification,
//                   because the printed sentence carries none.
//   'as-specified' — the reading the CQL implements: the same status filter as
//                   the risk-flag branch, so that a retracted or preliminary
//                   nil-by-mouth record cannot silence a safety alert.
//
// The first run is what found the difference between them, and it is kept in
// the record rather than replaced by the run that agrees. A differential check
// whose losing reading is deleted afterwards proves nothing.
//
// Adjudication, stated once: the CQL is right and the sentence was incomplete.
// Suppressing an alert on the strength of an `entered-in-error` record is the
// unsafe direction, the CQL source says so in a comment at that branch, and the
// manuscript now states the filter. The artifact was not changed.

const resourcesOf = (bundle) => (bundle.entry || []).map((e) => e.resource).filter(Boolean);

const hasCoding = (codeableConcept, system, code) =>
  ((codeableConcept && codeableConcept.coding) || []).some((c) => c.system === system && c.code === code);

function evaluate(bundle, reading) {
  const resources = resourcesOf(bundle);
  const observations = resources.filter((r) => r.resourceType === 'Observation');
  const orders = resources.filter((r) => r.resourceType === 'NutritionOrder');

  // 1. a coded aspiration-risk flag, status final or amended
  const codedRiskFlag = observations.some(
    (o) => hasCoding(o.code, SCT, AT_RISK) && (o.status === 'final' || o.status === 'amended')
  );

  // 2. an active nutrition order prescribing thin (IDDSI Level 0) fluids
  const activeThinFluidOrder = orders.some(
    (o) => o.status === 'active'
      && (((o.oralDiet || {}).fluidConsistencyType) || []).some((fc) => hasCoding(fc, SCT, IDDSI_THIN))
  );

  // 3. no nil-by-mouth status: no NPO observation, no active non-oral order
  const npoObservation = observations.some(
    (o) => hasCoding(o.code, SCT, NIL_BY_MOUTH)
      && (reading === 'as-printed' || o.status === 'final' || o.status === 'amended')
  );
  const activeNonOralOrder = orders.some((o) => o.status === 'active' && !o.oralDiet);
  const nilByMouth = npoObservation || activeNonOralOrder;

  return {
    codedRiskFlag,
    activeThinFluidOrder,
    nilByMouth,
    alert: codedRiskFlag && activeThinFluidOrder && !nilByMouth,
  };
}

// --- comparison sets ---------------------------------------------------------
function loadDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ file: f, bundle: JSON.parse(readFileSync(join(dir, f), 'utf8')) }));
}

const patientIdOf = (bundle) => {
  const p = resourcesOf(bundle).find((r) => r.resourceType === 'Patient');
  return p ? p.id : null;
};

// First implementation's verdicts, as recorded by the engine runs.
const cohortVerdicts = new Map();
const cqlResultsPath = join(OUT, 'cql-results.json');
if (!existsSync(cqlResultsPath)) {
  console.error('Missing out/cql-results.json — run `npm run run-cql` first so there is a first implementation to compare against.');
  process.exit(1);
}
for (const r of JSON.parse(readFileSync(cqlResultsPath, 'utf8'))) cohortVerdicts.set(r.id, !!r.alert);

const fixtureVerdicts = new Map();
const branchPath = join(OUT, 'branch-coverage.json');
if (existsSync(branchPath)) {
  for (const r of JSON.parse(readFileSync(branchPath, 'utf8')).results) fixtureVerdicts.set(r.id, !!r.observed);
}

function compare(label, items, firstVerdicts, reading) {
  const rows = [];
  for (const { file, bundle } of items) {
    const id = patientIdOf(bundle);
    if (id === null || !firstVerdicts.has(id)) {
      rows.push({ id: id || file, skipped: true, reason: 'no verdict from the first implementation' });
      continue;
    }
    const second = evaluate(bundle, reading);
    const first = firstVerdicts.get(id);
    rows.push({ id, first, second: second.alert, agrees: first === second.alert, detail: second });
  }
  const compared = rows.filter((r) => !r.skipped);
  const disagreements = compared.filter((r) => !r.agrees);
  return { label, reading, compared: compared.length, agreements: compared.length - disagreements.length, disagreements, rows };
}

const cohortItems = loadDir(COHORT);
const fixtureItems = loadDir(FIXTURES);
const READINGS = ['as-printed', 'as-specified'];
const runs = READINGS.map((reading) => ({
  reading,
  cohort: compare('deposited cohort', cohortItems, cohortVerdicts, reading),
  fixtures: compare('hand-authored branch fixtures', fixtureItems, fixtureVerdicts, reading),
}));
const [cohort, fixtures] = [runs[1].cohort, runs[1].fixtures];

// --- record ------------------------------------------------------------------
mkdirSync(OUT, { recursive: true });
const record = {
  runTimestamp: new Date().toISOString(),
  firstImplementation: 'AspirationRiskAlert.cql compiled to ELM, executed on cql-execution with cql-exec-fhir',
  secondImplementation: 'direct traversal of the serialized FHIR JSON, written from the rule statement printed in the manuscript (§3.6); shares no library with the first',
  independenceCaveat: 'Both implementations were written by the same authors. This measures specification-to-code fidelity, not clinical validity, and does not remove the co-design limitation.',
  readings: {
    'as-printed': 'condition 3 read literally from the manuscript sentence, with no status qualification on the nil-by-mouth observation',
    'as-specified': 'condition 3 with the same status filter the risk-flag branch carries, which is what the CQL implements',
  },
  runs: runs.map((r) => ({
    reading: r.reading,
    sets: [r.cohort, r.fixtures].map((s) => ({
      set: s.label,
      compared: s.compared,
      agreements: s.agreements,
      disagreements: s.disagreements.map((d) => ({ id: d.id, first: d.first, second: d.second, secondDetail: d.detail })),
    })),
    totalCompared: r.cohort.compared + r.fixtures.compared,
    totalDisagreements: r.cohort.disagreements.length + r.fixtures.disagreements.length,
  })),
  sets: [cohort, fixtures].map((s) => ({
    set: s.label,
    compared: s.compared,
    agreements: s.agreements,
    disagreements: s.disagreements.map((d) => ({ id: d.id, first: d.first, second: d.second, secondDetail: d.detail })),
  })),
};
record.totalCompared = cohort.compared + fixtures.compared;
record.totalDisagreements = cohort.disagreements.length + fixtures.disagreements.length;
record.finding = record.runs[0].totalDisagreements === record.runs[1].totalDisagreements
  ? 'Both readings of condition 3 agree with the first implementation; the printed sentence was already determinate on these inputs.'
  : 'The literal reading of condition 3 disagreed with the first implementation, on inputs where a retracted nil-by-mouth record is present. The CQL applies a status filter the printed sentence omitted. Adjudicated in favour of the artifact — suppressing an alert on an entered-in-error record is the unsafe direction — and the manuscript sentence was corrected. No change was made to the rule.';
writeFileSync(join(OUT, 'differential-check.json'), JSON.stringify(record, null, 2));

const md = [
  '# Differential check: a second implementation of the rule',
  '',
  'The first implementation is the CQL library compiled to ELM and executed on',
  '`cql-execution` with `cql-exec-fhir`. The second walks the serialized FHIR JSON',
  'directly and was written from the rule statement printed in the manuscript (§3.6),',
  'not from the CQL source; it shares no library with the first.',
  '',
  '**What this does and does not establish.** Both implementations were written by the',
  'same authors, so a misconception about the clinical question would survive in both.',
  'What is measured is whether the CQL, as compiled and executed, does what the paper',
  'says it does — specification-to-code fidelity. The co-design limitation is unaffected.',
  '',
  'Condition 3 was run under two readings and both are reported, because the first',
  'run is what located the difference between them.',
  '',
  '| Reading of condition 3 | Comparison set | Compared | Agreements | Disagreements |',
  '|---|---|---|---|---|',
  ...record.runs.flatMap((r) => r.sets.map((s) =>
    `| ${r.reading} | ${s.set} | ${s.compared} | ${s.agreements} | ${s.disagreements.length} |`)),
  '',
  '## What the difference was',
  '',
  record.finding,
  '',
  ...record.runs.flatMap((r) => r.sets.flatMap((s) => s.disagreements.map((d) =>
    `- *${r.reading}* — **${d.id}** (${s.set}): first implementation ${d.first ? 'alert' : 'no alert'}, second ${d.second ? 'alert' : 'no alert'}.`
    + ` Second implementation saw: coded risk flag ${d.secondDetail.codedRiskFlag}, active thin-fluid order ${d.secondDetail.activeThinFluidOrder}, nil-by-mouth ${d.secondDetail.nilByMouth}.`))),
  '',
].join('\n');
writeFileSync(join(OUT, 'DIFFERENTIAL-CHECK.md'), md);

for (const r of record.runs) {
  console.log(`\nreading: ${r.reading}`);
  for (const s of r.sets) {
    console.log(`  ${s.set}: ${s.agreements}/${s.compared} agree, ${s.disagreements.length} disagree`);
    for (const d of s.disagreements) {
      console.log(`    DISAGREE ${d.id}: first=${d.first ? 'alert' : 'no alert'} second=${d.second ? 'alert' : 'no alert'} | ${JSON.stringify(d.secondDetail)}`);
    }
  }
}
console.log(`\n${record.finding}`);
console.log(`→ ${join(OUT, 'differential-check.json')}`);
