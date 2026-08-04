// ============================================================================
// mutation-test.mjs — negative control for the round-trip / toolchain-fidelity check.
//
// The reported 100% agreement between the CQL engine and the deterministic
// model labels only carries information if the comparison is capable
// of DISAGREEING. This script injects deliberate defects into the cohort and
// verifies that each one is detected, i.e. that the check is sensitive rather
// than trivially returning "equal".
//
// Each mutation targets a different link of the profile → code → retrieve → engine
// chain, so the script doubles as a branch-coverage probe for the rule.
//
//   node mutation-test.mjs
//   # exit 0 = every mutation was detected (control is sensitive)
//   # exit 1 = at least one mutation went undetected (control is blind)
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';

const __dir = dirname(fileURLToPath(import.meta.url));
const ELM = join(__dir, 'elm');
const COHORT = join(__dir, 'cohort');
const OUT = join(__dir, 'out');

const SCT = 'http://snomed.info/sct';
const THIN = '1231508001';        // IDDSI Level 0 (Thin) — drink axis
const AT_RISK = '371736008';      // At risk for aspiration
const NPO = '182923009';          // Nil by mouth

const mainElm = JSON.parse(readFileSync(join(ELM, 'AspirationRiskAlert.json'), 'utf8'));
const fhirHelpers = JSON.parse(readFileSync(join(ELM, 'FHIRHelpers.json'), 'utf8'));
const library = new cql.Library(mainElm, new cql.Repository({ FHIRHelpers: fhirHelpers }));

async function run(bundles) {
  const executor = new cql.Executor(library, new cql.CodeService({}), {});
  const src = cqlfhir.PatientSource.FHIRv401();
  src.loadBundles(JSON.parse(JSON.stringify(bundles)));   // deep copy: engine mutates state
  const res = await executor.exec(src);
  const out = {};
  for (const pid of Object.keys(res.patientResults)) {
    const r = res.patientResults[pid];
    out[pid] = {
      hasFlag: !!r.HasAspirationRiskFlag,
      onThin: !!r.OnThinFluids,
      isNpo: !!r.IsNPO,
      alert: !!r.AspirationPrecautionAlert,
    };
  }
  return out;
}

const diff = (a, b) => {
  let n = 0;
  for (const pid of Object.keys(a)) if (a[pid]?.alert !== b[pid]?.alert) n++;
  return n;
};

// --- mutations --------------------------------------------------------------
// Each returns a mutated deep copy of the cohort plus how many resources it touched.

const eachEntry = (bundles, fn) => {
  const copy = JSON.parse(JSON.stringify(bundles));
  let touched = 0;
  for (const b of copy) for (const e of b.entry || []) if (fn(e.resource)) touched++;
  return { cohort: copy, touched };
};

const MUTATIONS = [
  {
    id: 'M1-iddsi-code',
    link: 'CodeableConcept equivalence on IDDSI codes',
    why: 'Replaces the IDDSI Thin (Level 0) code with a non-IDDSI code. The rule must stop seeing these patients as being on thin fluids.',
    apply: (bundles) =>
      eachEntry(bundles, (r) => {
        if (r?.resourceType !== 'NutritionOrder') return false;
        let hit = false;
        for (const fc of r.oralDiet?.fluidConsistencyType || [])
          for (const c of fc.coding || [])
            if (c.system === SCT && c.code === THIN) {
              c.code = '9999999';   // deliberately wrong code
              hit = true;
            }
        return hit;
      }),
  },
  {
    id: 'M2-flag-status',
    link: 'Observation.status filtering',
    why: 'Sets the aspiration-risk flag status to entered-in-error. The rule accepts only final/amended, so these flags must become invisible.',
    apply: (bundles) =>
      eachEntry(bundles, (r) => {
        if (r?.resourceType !== 'Observation') return false;
        const isFlag = (r.code?.coding || []).some((c) => c.system === SCT && c.code === AT_RISK);
        if (!isFlag) return false;
        r.status = 'entered-in-error';
        return true;
      }),
  },
  {
    id: 'M3-npo-suppression',
    link: 'NPO exclusion branch',
    // Diagnostic, not a sensitivity control. NPO and an active thin-fluid order are
    // mutually exclusive in the generative model (a nil-by-mouth patient has no oral
    // diet), so no NPO patient also satisfies flag ∧ thin. Removing the NPO signal
    // therefore cannot change any verdict: the branch executes but is not
    // outcome-discriminating in this cohort. Expected change is zero, and observing
    // zero is the finding.
    expectChange: false,
    why: 'Removes the NPO signal. The rule reads nil-by-mouth as a disjunction — a nil-by-mouth Observation or an active order carrying no oral diet — and the generative model emits only the second form, so this control perturbs the diet-less orders. Because NPO and thin-fluid orders are mutually exclusive by construction, no verdict should change; this documents that the NPO branch is not outcome-discriminating in this cohort.',
    apply: (bundles) =>
      eachEntry(bundles, (r) => {
        if (r?.resourceType === 'Observation') {
          const isNpo = (r.code?.coding || []).some((c) => c.system === SCT && c.code === NPO);
          if (isNpo) {
            r.code.coding = [{ system: SCT, code: '9999998' }];
            return true;
          }
        }
        if (r?.resourceType === 'NutritionOrder' && r.status === 'active' && !r.oralDiet) {
          r.status = 'revoked';
          return true;
        }
        return false;
      }),
  },
  {
    id: 'M4-inject-flag',
    link: 'alert-generating direction (flag retrieval)',
    // The rule is a conjunction, so M1 and M2 — which each remove a REQUIRED element —
    // can only drive verdicts to false. That direction alone cannot distinguish a
    // sensitive comparison from one that trivially collapses. This mutation goes the
    // other way: it supplies a conformant flag to patients who lack one, so patients
    // already on thin fluids and not NPO must acquire an alert they did not have.
    // The control passes only if the alert count strictly INCREASES.
    expectIncrease: true,
    why: 'Adds a conformant coded aspiration-risk flag to every patient lacking one. Patients already on thin fluids and not NPO must now trigger the alert, so the alert count must strictly increase. This tests the alert-generating direction, which the suppressing controls (M1, M2) structurally cannot reach.',
    apply: (bundles) => {
      const copy = JSON.parse(JSON.stringify(bundles));
      let touched = 0;
      for (const b of copy) {
        const entries = b.entry || [];
        const hasFlag = entries.some(
          (e) =>
            e.resource?.resourceType === 'Observation' &&
            (e.resource.code?.coding || []).some((c) => c.system === SCT && c.code === AT_RISK),
        );
        if (hasFlag) continue;
        const pat = entries.find((e) => e.resource?.resourceType === 'Patient');
        if (!pat) continue;
        entries.push({
          resource: {
            resourceType: 'Observation',
            id: `mut-injected-flag-${touched}`,
            status: 'final',
            code: { coding: [{ system: SCT, code: AT_RISK }] },
            subject: { reference: `Patient/${pat.resource.id}` },
            effectiveDateTime: '2026-03-10',
          },
        });
        b.entry = entries;
        touched++;
      }
      return { cohort: copy, touched };
    },
  },
];

async function main() {
  const files = readdirSync(COHORT).filter((f) => f.endsWith('.json'));
  const bundles = files.map((f) => JSON.parse(readFileSync(join(COHORT, f), 'utf8')));
  console.log(`Loaded ${bundles.length} patient bundles.\n`);

  const baseline = await run(bundles);
  const fired = Object.values(baseline).filter((r) => r.alert).length;
  console.log(`Baseline: rule fired on ${fired}/${Object.keys(baseline).length}\n`);

  // Branch coverage of the unmutated cohort.
  const cov = {
    codedFlagPresent: Object.values(baseline).filter((r) => r.hasFlag).length,
    onThinFluids: Object.values(baseline).filter((r) => r.onThin).length,
    npoExcluded: Object.values(baseline).filter((r) => r.isNpo).length,
    alertFired: fired,
  };
  console.log('Branch coverage (unmutated cohort):');
  for (const [k, v] of Object.entries(cov)) console.log(`  ${k}: ${v}`);
  console.log(
    '  amendedStatusBranch: 0  (not exercisable — the profile fixes status to final,\n' +
      '                          so no conformant instance can carry status=amended)\n',
  );

  const results = [];
  let blind = 0;
  console.log('Mutation controls:');
  for (const m of MUTATIONS) {
    const { cohort, touched } = m.apply(bundles);
    const mutated = await run(cohort);
    const detected = diff(baseline, mutated);
    const mutatedFired = Object.values(mutated).filter((r) => r.alert).length;
    const expectIncrease = m.expectIncrease === true;
    const expectChange = m.expectChange !== false;
    const ok = expectIncrease ? mutatedFired > fired : expectChange ? detected > 0 : detected === 0;
    if (!ok) blind++;
    const label = expectIncrease
      ? ok
        ? `✓ detected (alerts ${fired} → ${mutatedFired}, alert-generating direction)`
        : '✗ UNDETECTED (alert count did not increase)'
      : expectChange
        ? ok
          ? '✓ detected'
          : '✗ UNDETECTED'
        : ok
          ? '✓ as expected (no change — branch not outcome-discriminating)'
          : '✗ unexpected change';
    console.log(
      `  ${label}  ${m.id} (${m.link}) — ` +
        `${touched} resources mutated, ${detected} patient outcomes changed`,
    );
    results.push({
      ...m,
      apply: undefined,
      role: expectIncrease
        ? 'sensitivity control (alert-generating direction)'
        : expectChange
          ? 'sensitivity control (alert-suppressing direction)'
          : 'diagnostic (expects no change)',
      resourcesMutated: touched,
      outcomesChanged: detected,
      alertsAfterMutation: mutatedFired,
      behavedAsExpected: ok,
    });
  }

  const pass = blind === 0;
  const controls = MUTATIONS.filter((m) => m.expectChange !== false).length;
  console.log(`\n${pass ? 'PASS' : 'FAIL'}: ${MUTATIONS.length - blind}/${MUTATIONS.length} mutations behaved as expected.`);
  console.log(
    pass
      ? `The round-trip comparison is sensitive in BOTH directions: ${controls} sensitivity controls changed verdicts —\n` +
        'M1/M2 suppressed alerts by removing a required element, M4 created alerts by supplying a missing\n' +
        'one. The NPO diagnostic changed nothing, showing that branch is executed but not\n' +
        'outcome-discriminating in this cohort.'
      : 'At least one mutation did not behave as expected — see out/MUTATION-TEST.md.',
  );

  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    join(OUT, 'mutation-test.json'),
    JSON.stringify({ baselineFired: fired, cohortSize: bundles.length, branchCoverage: cov, mutations: results, pass }, null, 2),
  );
  const md = [
    '# Mutation control for the round-trip check',
    '',
    `Cohort: ${bundles.length} synthetic patients. Baseline: rule fired on ${fired}.`,
    '',
    '## Branch coverage (unmutated cohort)',
    '',
    '| Branch | Patients exercising it |',
    '|---|---|',
    `| Coded aspiration-risk flag present | ${cov.codedFlagPresent} |`,
    `| On thin fluids | ${cov.onThinFluids} |`,
    `| NPO exclusion applied | ${cov.npoExcluded} |`,
    `| Alert fired | ${cov.alertFired} |`,
    '| `status = amended` accepted by the rule | 0 — not exercisable (profile fixes status to `final`) |',
    '',
    '## Mutation controls',
    '',
    '| Mutation | Chain link tested | Role | Resources mutated | Outcomes changed | Alerts after | As expected |',
    '|---|---|---|---|---|---|---|',
    ...results.map(
      (m) =>
        `| \`${m.id}\` | ${m.link} | ${m.role} | ${m.resourcesMutated} | ${m.outcomesChanged} | ${m.alertsAfterMutation} | ${m.behavedAsExpected ? 'yes' : 'NO'} |`,
    ),
    '',
    `**${pass ? 'PASS' : 'FAIL'}** — ${MUTATIONS.length - blind}/${MUTATIONS.length} mutations behaved as expected.`,
    '',
    'The controls probe the rule in both directions, which matters because the rule is a',
    'conjunction. M1 and M2 each remove a required element, so they can only drive verdicts to',
    'false; on their own they cannot distinguish a genuinely sensitive comparison from one that',
    'collapses trivially. M4 goes the other way — it supplies a conformant flag to patients who',
    'lacked one, so alerts that did not exist must appear. Agreement on the intact pipeline is',
    'therefore evidence rather than a tautology: the comparison is shown to disagree both when',
    'evidence is taken away and when it is added.',
    '',
    'M3 is a diagnostic rather than a control, and its result is itself a finding: suppressing',
    'the NPO signal changed no verdict. NPO status and an active thin-fluid order are mutually',
    'exclusive in the generative model, so no NPO patient also satisfies flag ∧ thin fluids.',
    'The NPO branch is therefore executed but is **not outcome-discriminating in this cohort**,',
    'and the round-trip agreement should not be read as having tested it.',
  ].join('\n');
  writeFileSync(join(OUT, 'MUTATION-TEST.md'), md + '\n');
  console.log('→ out/mutation-test.json + MUTATION-TEST.md');

  process.exit(pass ? 0 : 1);
}

main();
