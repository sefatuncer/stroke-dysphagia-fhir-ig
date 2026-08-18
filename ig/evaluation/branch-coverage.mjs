// ============================================================================
// branch-coverage.mjs — exercise the rule's logic on inputs the generative
// model does not and cannot produce.
// ----------------------------------------------------------------------------
// Why this exists. Every quantitative result in the evaluation so far comes
// from one cohort produced by one generative model that was designed alongside
// the rule. Two consequences were declared as limitations rather than measured:
//
//   * two branches of the rule are never activated by that cohort — the
//     nil-by-mouth exclusion in its Observation form, and the `amended` arm of
//     the status filter (the profile fixes status to `final`);
//   * because the model emits exactly what the rule retrieves, agreement
//     between them cannot distinguish a correct rule from a matched pair of
//     mistakes.
//
// The fixtures below are written by hand, from the rule's stated behaviour in
// the manuscript rather than from the cohort, and each one isolates one cell of
// the rule's truth table: flag x thin fluids x nil-by-mouth, plus the cases the
// cohort cannot generate (an amended flag, a cancelled order, a years-old
// flag, a subsumed IDDSI concept). The expected verdict for each is recorded
// here BEFORE the engine runs, so a disagreement is a finding rather than
// something to be explained afterwards.
//
// Two of these fixtures are deliberately NOT conformant to the IG profiles
// (F07 carries status `amended`, which the AspirationRiskFlag profile fixes to
// `final`; F09 carries an IDDSI concept the drink-axis value set does not
// enumerate at Level 0). They are included because the rule's behaviour on
// them is what the manuscript claims, and they are flagged as non-conformant
// in the record so that no reader mistakes them for conformance evidence.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';

const HERE = dirname(fileURLToPath(import.meta.url));
const ELM = join(HERE, 'elm');
const OUT = join(HERE, 'out');
const FIXTURES = join(HERE, 'branch-fixtures');

const SCT = 'http://snomed.info/sct';
const BASE = 'https://synthetic.invalid/fhir';
const IG = 'https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition';

// --- fixture builders --------------------------------------------------------
const patient = (id) => ({
  resourceType: 'Patient', id,
  meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
  gender: 'unknown', birthDate: '1950-01-01',
  name: [{ family: 'Fixture', given: ['Branch'] }],
});

const riskFlag = (id, { status = 'final', when = '2026-03-08' } = {}) => ({
  resourceType: 'Observation', id: `${id}-flag`,
  meta: { profile: [`${IG}/aspiration-risk-flag`] },
  status,
  code: { coding: [{ system: SCT, code: '371736008' }] },
  subject: { reference: `Patient/${id}` },
  effectiveDateTime: when,
});

const npoObservation = (id) => ({
  resourceType: 'Observation', id: `${id}-npo`,
  status: 'final',
  code: { coding: [{ system: SCT, code: '182923009' }] },
  subject: { reference: `Patient/${id}` },
  effectiveDateTime: '2026-03-09',
});

const dietOrder = (id, { status = 'active', fluidCode = '1231508001', oralDiet = true } = {}) => {
  const order = {
    resourceType: 'NutritionOrder', id: `${id}-diet`,
    meta: { profile: [`${IG}/dysphagia-nutrition-order`] },
    status, intent: 'order',
    patient: { reference: `Patient/${id}` },
    dateTime: '2026-03-10',
  };
  if (oralDiet) order.oralDiet = { fluidConsistencyType: [{ coding: [{ system: SCT, code: fluidCode }] }] };
  return order;
};

const bundle = (id, resources) => ({
  resourceType: 'Bundle', id: `bundle-${id}`, type: 'collection',
  entry: resources.map((r) => ({ resource: r, fullUrl: `${BASE}/${r.resourceType}/${r.id}` })),
});

// --- the truth table ---------------------------------------------------------
// `expected` is the verdict the manuscript's statement of the rule requires.
// It is written here, in the fixture definition, and compared with the engine
// afterwards — never adjusted to match what the engine produced.
const CASES = [
  {
    id: 'F01', name: 'flag + thin fluids + not nil-by-mouth',
    covers: 'the conjunction satisfied — the alert-raising cell',
    conformant: true, expected: true,
    build: (id) => [patient(id), riskFlag(id), dietOrder(id)],
  },
  {
    id: 'F02', name: 'flag + thickened fluids (IDDSI Level 2)',
    covers: 'the thin-fluid conjunct false',
    conformant: true, expected: false,
    build: (id) => [patient(id), riskFlag(id), dietOrder(id, { fluidCode: '1237442003' })],
  },
  {
    id: 'F03', name: 'flag + thin fluids + nil-by-mouth as an Observation',
    covers: 'the nil-by-mouth exclusion in its Observation form — never emitted by the cohort',
    conformant: true, expected: false,
    build: (id) => [patient(id), riskFlag(id), dietOrder(id), npoObservation(id)],
  },
  {
    id: 'F04', name: 'flag + thin fluids + an active order carrying no oral diet',
    covers: 'the nil-by-mouth exclusion in its order form',
    conformant: true, expected: false,
    build: (id) => [
      patient(id), riskFlag(id), dietOrder(id),
      { ...dietOrder(id, { oralDiet: false }), id: `${id}-npo-order` },
    ],
  },
  {
    id: 'F05', name: 'no flag + thin fluids',
    covers: 'the flag conjunct false',
    conformant: true, expected: false,
    build: (id) => [patient(id), dietOrder(id)],
  },
  {
    id: 'F06', name: 'flag + thin fluids on a cancelled order',
    covers: 'the order status filter',
    conformant: true, expected: false,
    build: (id) => [patient(id), riskFlag(id), dietOrder(id, { status: 'cancelled' })],
  },
  {
    id: 'F07', name: 'flag with status `amended` + thin fluids',
    covers: 'the `amended` arm of the status filter — unreachable for profile-conformant data',
    conformant: false,
    nonConformanceReason: 'AspirationRiskFlag fixes Observation.status to `final`; this fixture violates that on purpose to reach the branch.',
    expected: true,
    build: (id) => [patient(id), riskFlag(id, { status: 'amended' }), dietOrder(id)],
  },
  {
    id: 'F08', name: 'flag recorded years earlier + thin fluids',
    covers: 'temporal scope: the rule carries no validity period, so a stale flag still fires',
    conformant: true, expected: true,
    build: (id) => [patient(id), riskFlag(id, { when: '2019-01-05' }), dietOrder(id)],
  },
  {
    id: 'F09', name: 'flag + a subsumed IDDSI concept instead of the Level 0 code',
    covers: 'code-level matching: the rule matches the thin-fluid code directly, not by value-set membership or subsumption',
    conformant: false,
    nonConformanceReason: 'The drink-axis value set enumerates Level 0 as 1231508001; this fixture uses the IDDSI Framework parent concept, which the binding does not enumerate.',
    expected: false,
    build: (id) => [patient(id), riskFlag(id), dietOrder(id, { fluidCode: '1231504004' })],
  },
  {
    id: 'F10', name: 'flag with status `preliminary` + thin fluids',
    covers: 'the status filter in the alert-raising direction',
    conformant: false,
    nonConformanceReason: 'AspirationRiskFlag fixes Observation.status to `final`.',
    expected: false,
    build: (id) => [patient(id), riskFlag(id, { status: 'preliminary' }), dietOrder(id)],
  },
  {
    id: 'F11', name: 'nil-by-mouth Observation with status `entered-in-error` + flag + thin fluids',
    covers: 'the suppressing branch must not be silenced by a retracted record',
    conformant: true, expected: true,
    build: (id) => [
      patient(id), riskFlag(id), dietOrder(id),
      { ...npoObservation(id), status: 'entered-in-error' },
    ],
  },
  {
    id: 'F12', name: 'no flag, no order',
    covers: 'the empty case',
    conformant: true, expected: false,
    build: (id) => [patient(id)],
  },
];

// --- write the fixtures, then run the compiled rule over them ----------------
mkdirSync(FIXTURES, { recursive: true });
mkdirSync(OUT, { recursive: true });

const bundles = [];
for (const c of CASES) {
  const b = bundle(c.id, c.build(c.id));
  writeFileSync(join(FIXTURES, `${c.id}.json`), JSON.stringify(b, null, 2));
  bundles.push(b);
}

const mainElm = JSON.parse(readFileSync(join(ELM, 'AspirationRiskAlert.json'), 'utf8'));
const fhirHelpers = JSON.parse(readFileSync(join(ELM, 'FHIRHelpers.json'), 'utf8'));
const library = new cql.Library(mainElm, new cql.Repository({ FHIRHelpers: fhirHelpers }));
const executor = new cql.Executor(library, new cql.CodeService({}), {});

const source = cqlfhir.PatientSource.FHIRv401();
source.loadBundles(bundles);
const result = await executor.exec(source);

const rows = [];
for (const c of CASES) {
  const r = result.patientResults[c.id];
  if (!r) { rows.push({ ...c, observed: null, agrees: false, note: 'engine returned no result for this patient' }); continue; }
  const observed = !!r.AspirationPrecautionAlert;
  rows.push({
    id: c.id, name: c.name, covers: c.covers,
    conformant: c.conformant, nonConformanceReason: c.nonConformanceReason || null,
    expected: c.expected, observed,
    branches: { hasFlag: !!r.HasAspirationRiskFlag, onThin: !!r.OnThinFluids, isNpo: !!r.IsNPO },
    agrees: observed === c.expected,
  });
}

const agreed = rows.filter((r) => r.agrees).length;
const record = {
  runTimestamp: new Date().toISOString(),
  engine: 'cql-execution + cql-exec-fhir, the same compiled ELM used for the cohort run',
  provenance: 'fixtures authored by hand from the rule statement, not produced by the generative model',
  fixtures: rows.length,
  agreements: agreed,
  disagreements: rows.filter((r) => !r.agrees),
  branchesReached: {
    alertRaised: rows.filter((r) => r.observed).length,
    npoExclusionApplied: rows.filter((r) => r.branches?.isNpo).length,
    amendedStatusAccepted: rows.filter((r) => r.id === 'F07' && r.branches?.hasFlag).length,
  },
  pass: agreed === rows.length,
  results: rows,
};
writeFileSync(join(OUT, 'branch-coverage.json'), JSON.stringify(record, null, 2));

const md = [
  '# Branch coverage of the AspirationRiskAlert rule',
  '',
  'Twelve fixtures written by hand from the rule statement — not produced by the',
  'generative model that supplies the cohort — each isolating one cell of the rule\'s',
  'truth table. The expected verdict was recorded in the fixture definition before the',
  'engine ran. The same compiled ELM and the same engine as the cohort run are used.',
  '',
  'Three fixtures are marked non-conformant: they violate a profile constraint on',
  'purpose in order to reach a branch that conformant data cannot reach. They are',
  'evidence about the rule, not about the profiles.',
  '',
  '| # | Fixture | Branch covered | Conformant | Expected | Observed | Agrees |',
  '|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.id} | ${r.name} | ${r.covers} | ${r.conformant ? 'yes' : 'no'} | ${r.expected ? 'alert' : 'no alert'} | ${r.observed ? 'alert' : 'no alert'} | ${r.agrees ? 'yes' : '**NO**'} |`),
  '',
  `**${agreed}/${rows.length} fixtures behaved as specified.**`,
  '',
  ...(rows.filter((r) => !r.agrees).length
    ? ['## Disagreements', '', ...rows.filter((r) => !r.agrees).map((r) => `- **${r.id}** ${r.name}: expected ${r.expected}, observed ${r.observed}.`), '']
    : ['No fixture disagreed with its pre-recorded expectation.', '']),
  '## Non-conformant fixtures and why they are here',
  '',
  ...rows.filter((r) => !r.conformant).map((r) => `- **${r.id}** — ${r.nonConformanceReason}`),
  '',
].join('\n');
writeFileSync(join(OUT, 'BRANCH-COVERAGE.md'), md);

console.log(`\n${agreed}/${rows.length} fixtures behaved as specified.`);
for (const r of rows) console.log(`  ${r.agrees ? 'ok  ' : 'FAIL'} ${r.id} ${r.expected ? 'alert' : 'no alert'} / observed ${r.observed ? 'alert' : 'no alert'}  — ${r.name}`);
console.log(`→ ${join(OUT, 'branch-coverage.json')}`);
if (!record.pass) process.exitCode = 1;
