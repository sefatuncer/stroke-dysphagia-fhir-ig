// ============================================================================
// validate-cohort.mjs — validate the 333 deposited evaluation bundles against
// the IG.
//
// Why this exists: the Methods describe the synthetic cohort as IG-conforming,
// and until now that was an assertion. The CQL retrieves by code and ignores
// meta.profile, so the rule would run identically over non-conforming data —
// which means the evaluation on its own says nothing about whether the profiles
// carry the data. This harness closes that gap: it runs the HL7 reference
// validator over every deposited bundle and deposits the verdict.
//
// Run (from ig/):  node conformance/validate-cohort.mjs
// Output:          conformance/out/cohort-conformance.json + .md
// ============================================================================
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IG = dirname(HERE);
const OUT = join(HERE, 'out');
const COHORT = join(IG, 'evaluation', 'cohort');
const PACKAGE = join(IG, 'output', 'package.tgz');

if (!existsSync(PACKAGE)) {
  console.error(`FAIL: ${PACKAGE} not found — build the IG first (see ig/README.md).`);
  process.exit(1);
}
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const bundles = readdirSync(COHORT).filter((f) => f.endsWith('.json'));
console.log(`Validating ${bundles.length} deposited bundles against the IG package…`);

// One JVM for the whole directory: 333 separate invocations would spend all their
// time on start-up and terminology cache warm-up.
const args = [
  'run', '--rm',
  '-v', `${IG}:/ig`,
  '-v', 'fhir-cache:/root/.fhir',
  'eclipse-temurin:17-jdk',
  'java', '-Xmx4g', '-jar', '/ig/input-cache/validator_cli.jar',
  '/ig/evaluation/cohort',
  '-version', '4.0.1',
  '-ig', '/ig/output/package.tgz',
  '-output', '/ig/conformance/out/cohort-validator-raw.json',
];

try {
  execFileSync('docker', args, { stdio: ['ignore', 'inherit', 'inherit'], maxBuffer: 1 << 28 });
} catch (e) {
  // The validator exits non-zero when any resource has an error; the outcome
  // file still tells us what happened, so keep going and report from it.
  console.log(`validator exit code ${e.status ?? 'unknown'} — reading the OperationOutcome`);
}

const rawPath = join(OUT, 'cohort-validator-raw.json');
if (!existsSync(rawPath)) { console.error('FAIL: the validator wrote no outcome file.'); process.exit(1); }
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
const outcomes = raw.resourceType === 'Bundle' ? raw.entry.map((e) => e.resource) : [raw];

const bySeverity = { fatal: 0, error: 0, warning: 0, information: 0 };
const errorSignatures = new Map();
let filesWithError = 0;

for (const oc of outcomes) {
  let hasError = false;
  for (const issue of oc.issue || []) {
    if (issue.severity in bySeverity) bySeverity[issue.severity]++;
    if (issue.severity === 'error' || issue.severity === 'fatal') {
      hasError = true;
      const text = (issue.details?.text || issue.diagnostics || '').slice(0, 160);
      errorSignatures.set(text, (errorSignatures.get(text) || 0) + 1);
    }
  }
  if (hasError) filesWithError++;
}


// A13: stamp every deposited record with the IG version it was produced against and
// when it ran, so a reader can tell whether the evidence matches the reported release.
function igStamp() {
  const cfg = readFileSync(join(dirname(HERE), 'sushi-config.yaml'), 'utf8');
  const v = cfg.match(/^version:\s*(\S+)/m);
  return { igVersion: v ? v[1] : 'unknown', runTimestamp: new Date().toISOString() };
}

const summary = {
  ...igStamp(),
  bundles: bundles.length,
  outcomes: outcomes.length,
  bundlesWithError: filesWithError,
  issues: bySeverity,
  errorSignatures: [...errorSignatures.entries()].map(([signature, count]) => ({ signature, count })),
  validator: 'HL7 reference validator (validator_cli.jar), FHIR R4, IG package from ig/output',
};
writeFileSync(join(OUT, 'cohort-conformance.json'), JSON.stringify(summary, null, 2) + '\n');

const md = [
  '# Cohort conformance — the deposited evaluation bundles',
  '',
  'The evaluation retrieves by code and ignores `meta.profile`, so executing the rule does',
  'not by itself show that the synthetic cohort conforms to the profiles it claims. This run',
  'checks that separately: every deposited bundle is validated against the built IG package.',
  '',
  `- Bundles validated: **${bundles.length}**`,
  `- Bundles with an error-severity issue: **${filesWithError}**`,
  `- Issues by severity: error ${bySeverity.error}, warning ${bySeverity.warning}, information ${bySeverity.information}`,
  '',
  filesWithError
    ? '## Error signatures\n\n' + summary.errorSignatures.map((e) => `- ${e.count}× \`${e.signature}\``).join('\n')
    : 'No error-severity issue was raised on any bundle.',
  '',
  'The warnings are the expected shape for generated data and are reported rather than',
  'suppressed: `dom-6` (no narrative — these resources are machine-generated and never',
  'rendered), the base-FHIR best practice that observations carry a performer (the model',
  'does not simulate clinicians), and `nor-1` on the nil-by-mouth orders, which by design',
  'carry no oral diet, supplement or enteral formula.',
  '',
].join('\n');
writeFileSync(join(OUT, 'cohort-conformance.md'), md);

console.log(`\n${bundles.length} bundles, ${filesWithError} with errors → conformance/out/cohort-conformance.{json,md}`);
process.exit(filesWithError ? 1 : 0);
