// ============================================================================
// validate-negatives-cli.mjs — A2: run the eight NEGATIVE fixtures through the
// second deployment as well.
//
// Why this exists. The eight positive examples were validated on two separately
// deployed servers (the HL7 reference validator that runs inside the build, and
// a separately deployed HAPI server), but the negative fixtures — the load-bearing
// evidence, because they show the profiles *reject* non-conforming data — ran on
// HAPI only. That asymmetry is exactly backwards: portability was demonstrated on
// the accepting side and not on the refusing side. This script closes it by
// running the same fixtures, with the same signature assertions, through
// validator_cli against the built IG package.
//
// It does NOT make the evidence independent: both deployments share the HL7 Java
// validation core, so this is portability across deployments, not independence
// across implementations (manuscript §5.3-3).
//
// Run:  node validate-negatives-cli.mjs        (requires ig/output/package.tgz)
// Out:  conformance/out/negative-conformance-cli.{json,md}
// ============================================================================
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IG = dirname(HERE); // …/ig
const FIXTURES = join(HERE, 'negative-fixtures');
const OUT = join(HERE, 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Same expectations as validate-negatives.mjs: a fixture counts as rejected only
// when the error carries the signature of the constraint under test.
const SPECS = {
  'neg-aspiration-preliminary.json': {
    why: 'status preliminary — profile fixes status to final',
    signature: /status|preliminary|final/i,
  },
  'neg-aspiration-wrongcode.json': {
    why: 'wrong SNOMED code — profile pattern fixes code to 371736008',
    signature: /code|371736008|pattern|fixed/i,
  },
  'neg-screening-noeffective.json': {
    why: 'effective[x] absent — profile requires effective[x] 1..1',
    signature: /effective|minimum required/i,
  },
  'neg-severity-nosubject.json': {
    why: 'subject absent — profile requires subject 1..1',
    signature: /subject|minimum required/i,
  },
  'neg-diet-food-code-on-fluid.json': {
    why: 'food-axis concept on fluidConsistencyType — invariant iddsi-axis-fluid',
    signature: /iddsi-axis-fluid|fluidConsistencyType|drink axis/i,
  },
  'neg-diet-drink-code-on-food.json': {
    why: 'drink-only concept on texture.modifier — invariant iddsi-axis-food',
    signature: /iddsi-axis-food|texture|food axis/i,
  },
  'neg-summary-no-entry.json': {
    why: 'sections without section.entry — invariant dct-has-content',
    signature: /dct-has-content|section\.entry|at least one section/i,
  },
  'neg-instrumental-pas-out-of-range.json': {
    why: 'PAS component value 99 — invariant pas-range (scale is 1–8)',
    signature: /pas-range|Penetration-Aspiration|8-point/i,
  },
};

const pkg = join(IG, 'output', 'package.tgz');
if (!existsSync(pkg)) {
  console.error('FAIL: ig/output/package.tgz not found — build the IG first.');
  process.exit(1);
}

const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.json')).sort();
console.log(`Validating ${fixtures.length} negative fixtures with the HL7 reference validator…\n`);

const rawPath = join(OUT, 'negative-validator-raw.json');
const args = [
  'run', '--rm',
  '-v', `${IG}:/ig`,
  '-v', 'fhir-cache:/root/.fhir',
  'eclipse-temurin:17-jdk',
  'java', '-Xmx4g', '-jar', '/ig/input-cache/validator_cli.jar',
  '/ig/conformance/negative-fixtures',
  '-version', '4.0.1',
  '-ig', '/ig/output/package.tgz',
  '-output', '/ig/conformance/out/negative-validator-raw.json',
];
try {
  execFileSync('docker', args, { stdio: ['ignore', 'inherit', 'inherit'], maxBuffer: 1 << 28 });
} catch (e) {
  // Non-zero exit is EXPECTED here: every fixture must produce an error.
  console.log(`\nvalidator exit code ${e.status ?? 'unknown'} — expected, reading the OperationOutcome\n`);
}

if (!existsSync(rawPath)) { console.error('FAIL: the validator wrote no outcome file.'); process.exit(1); }
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
const outcomes = raw.resourceType === 'Bundle' ? raw.entry.map((e) => e.resource) : [raw];

const results = [];
for (const oc of outcomes) {
  const src = oc.extension?.find((x) => x.url?.endsWith('operationoutcome-file'))?.valueString
    || oc.issue?.[0]?.location?.[0]
    || '';
  const file = fixtures.find((f) => src.includes(basename(f, '.json'))) || basename(src);
  const spec = SPECS[file];
  const issues = oc.issue || [];
  const errors = issues.filter((i) => i.severity === 'error' || i.severity === 'fatal');
  const allErrors = errors.map((i) => `${i.diagnostics || ''} ${i.details?.text || ''}`).join(' | ');
  const profileUnresolved = /unable to resolve (the )?profile|profile[^.]{0,80}could not be resolved|cannot resolve profile/i.test(allErrors);
  const signatureMatched = spec ? spec.signature.test(allErrors) : false;
  const correctlyRejected = errors.length > 0 && signatureMatched && !profileUnresolved;

  results.push({
    fixture: file,
    expected: spec?.why ?? null,
    errorCount: errors.length,
    signatureMatched,
    profileUnresolved,
    correctlyRejected,
    firstError: (errors[0]?.diagnostics || errors[0]?.details?.text || '').slice(0, 300),
  });

  console.log(`${correctlyRejected ? '  ✓ correctly rejected' : '  ✗ NOT rejected for the right reason'}  ${file}`);
  if (spec) console.log(`      expected: ${spec.why}`);
  console.log(`      validator: ${(errors[0]?.diagnostics || errors[0]?.details?.text || '(no error)').slice(0, 140)}`);
}

const pass = results.length === fixtures.length && results.every((r) => r.correctlyRejected);

// A13: stamp every deposited record with the IG version it was produced against and
// when it ran, so a reader can tell whether the evidence matches the reported release.
function igStamp() {
  const cfg = readFileSync(join(dirname(HERE), 'sushi-config.yaml'), 'utf8');
  const v = cfg.match(/^version:\s*(\S+)/m);
  return { igVersion: v ? v[1] : 'unknown', runTimestamp: new Date().toISOString() };
}

const summary = {
  ...igStamp(),
  validator: 'HL7 reference validator (validator_cli.jar), FHIR R4, IG package from ig/output',
  deployment: 'in-toolchain reference validator (the second deployment for the rejection side)',
  note: 'Both this validator and the HAPI server share the HL7 Java validation core: portability across deployments, not independence across implementations.',
  fixtures: results.length,
  correctlyRejected: results.filter((r) => r.correctlyRejected).length,
  pass,
  results,
};
writeFileSync(join(OUT, 'negative-conformance-cli.json'), JSON.stringify(summary, null, 2));

let md = '# Negative fixtures — reference validator (second deployment)\n\n';
md += `${summary.correctlyRejected}/${summary.fixtures} fixtures were rejected for the constraint they target.\n\n`;
md += '| Fixture | Constraint under test | errors | signature matched | correctly rejected |\n|---|---|---|---|---|\n';
for (const r of results) {
  md += `| \`${r.fixture}\` | ${r.expected || '—'} | ${r.errorCount} | ${r.signatureMatched ? 'yes' : 'no'} | ${r.correctlyRejected ? 'yes' : 'NO'} |\n`;
}
md += `\n${summary.note}\n`;
writeFileSync(join(OUT, 'NEGATIVE-CONFORMANCE-CLI.md'), md);

console.log(`\n${pass ? 'PASS' : 'FAIL'}: ${summary.correctlyRejected}/${summary.fixtures} negative fixtures correctly rejected by the reference validator`);
console.log('→ conformance/out/negative-conformance-cli.json + NEGATIVE-CONFORMANCE-CLI.md');
process.exit(pass ? 0 : 1);
