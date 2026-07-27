// ============================================================================
// run-cql.mjs — execute the compiled CQL rule on the synthetic cohort using a
// real CQL engine (cql-execution) over FHIR R4 profile instances (cql-exec-fhir).
//
// This is the executability / round-trip proof: the same AspirationRiskAlert
// rule carried in the IG runs, unmodified, on standard tooling against instances
// that conform to the IG profiles. Output = per-patient rule results (booleans),
// NOT a diagnostic-accuracy metric.
// ============================================================================
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cql from 'cql-execution';
import cqlfhir from 'cql-exec-fhir';

const __dir = dirname(fileURLToPath(import.meta.url));
const ELM = join(__dir, 'elm');
const COHORT = join(__dir, 'cohort');
const OUT = join(__dir, 'out');

// --- load compiled libraries ------------------------------------------------
const mainElm = JSON.parse(readFileSync(join(ELM, 'AspirationRiskAlert.json'), 'utf8'));
const fhirHelpers = JSON.parse(readFileSync(join(ELM, 'FHIRHelpers.json'), 'utf8'));
const library = new cql.Library(mainElm, new cql.Repository({ FHIRHelpers: fhirHelpers }));
const codeService = new cql.CodeService({});           // direct-code retrieves → no ValueSet expansion needed
const executor = new cql.Executor(library, codeService, {});

// --- load cohort bundles ----------------------------------------------------
const files = readdirSync(COHORT).filter(f => f.endsWith('.json'));
const bundles = files.map(f => JSON.parse(readFileSync(join(COHORT, f), 'utf8')));
console.log(`Loaded ${bundles.length} patient bundles.`);

const patientSource = cqlfhir.PatientSource.FHIRv401();
patientSource.loadBundles(bundles);

// --- execute ----------------------------------------------------------------
const result = await executor.exec(patientSource);
const pr = result.patientResults;

const rows = [];
for (const pid of Object.keys(pr)) {
  const r = pr[pid];
  rows.push({
    id: pid,
    hasFlag: !!r.HasAspirationRiskFlag,
    onThin: !!r.OnThinFluids,
    isNpo: !!r.IsNPO,
    alert: !!r.AspirationPrecautionAlert,
    alertText: r.AlertText || null,
  });
}
writeFileSync(join(OUT, 'cql-results.json'), JSON.stringify(rows, null, 2));

const n = rows.length, fired = rows.filter(r => r.alert).length;
console.log(`\n✅ CQL executed on a real engine over ${n} FHIR bundles.`);
console.log(`   Rule fired (AspirationPrecautionAlert) on ${fired}/${n} (${(100 * fired / n).toFixed(1)}%).`);
console.log(`   → out/cql-results.json`);
