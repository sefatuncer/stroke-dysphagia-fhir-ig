// ============================================================================
// validate-positives-cli.mjs — run the eight POSITIVE examples through the
// reference validator as well.
//
// Why this exists. The negative fixtures carried a machine-readable record for
// both deployments (HAPI and the reference validator), but the positive examples
// carried one only for HAPI. The manuscript said "on both deployments" for both
// suites, and for the positive side the second leg was the in-toolchain IG
// Publisher run — which §3.5 itself declines to count as independent evidence.
// One sentence therefore covered two runs of different evidential weight, and a
// reader could not tell them apart from the archive. This script closes that gap
// by running the same eight examples, each against its declared profile, through
// validator_cli against the built IG package.
//
// It does NOT make the evidence independent: both deployments share the HL7 Java
// validation core, so this is portability across deployments, not independence
// across implementations (manuscript §5.3-3).
//
// Run:  node validate-positives-cli.mjs        (requires ig/output/package.tgz)
// Out:  conformance/out/positive-conformance-cli.{json,md}
// ============================================================================
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IG = dirname(HERE); // …/ig
const RES = join(IG, 'fsh-generated', 'resources');
const OUT = join(HERE, 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const pkg = join(IG, 'output', 'package.tgz');
if (!existsSync(pkg)) {
  console.error('FAIL: ig/output/package.tgz not found — build the IG first.');
  process.exit(1);
}

// The examples are everything in fsh-generated that is not a conformance resource.
// Same partition as validate-on-server.mjs, so the two records describe one suite.
const CONFORMANCE = new Set(['CodeSystem', 'ValueSet', 'StructureDefinition', 'ImplementationGuide']);
const examples = [];
for (const f of readdirSync(RES).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(RES, f), 'utf8'));
  if (!r.resourceType || CONFORMANCE.has(r.resourceType)) continue;
  examples.push({ file: f, id: r.id, resourceType: r.resourceType, profile: r.meta?.profile?.[0] || null });
}
examples.sort((a, b) => a.file.localeCompare(b.file));

const profiled = examples.filter((e) => e.profile).length;
console.log(`Validating ${examples.length} positive examples with the HL7 reference validator`);
console.log(`  (${profiled} declare an IG profile, ${examples.length - profiled} validate against base FHIR)\n`);

const rawPath = join(OUT, 'positive-validator-raw.json');
const args = [
  'run', '--rm',
  '-v', `${IG}:/ig`,
  '-v', 'fhir-cache:/root/.fhir',
  'eclipse-temurin:17-jdk',
  'java', '-Xmx4g', '-jar', '/ig/input-cache/validator_cli.jar',
  ...examples.map((e) => `/ig/fsh-generated/resources/${e.file}`),
  '-version', '4.0.1',
  '-ig', '/ig/output/package.tgz',
  '-output', '/ig/conformance/out/positive-validator-raw.json',
];
try {
  execFileSync('docker', args, { stdio: ['ignore', 'inherit', 'inherit'], maxBuffer: 1 << 28 });
} catch (e) {
  // A non-zero exit means at least one error was found; that is a FAIL here, but
  // the outcome file still has to be read before saying so.
  console.log(`\nvalidator exit code ${e.status ?? 'unknown'} — reading the OperationOutcome\n`);
}

if (!existsSync(rawPath)) { console.error('FAIL: the validator wrote no outcome file.'); process.exit(1); }
const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
const outcomes = raw.resourceType === 'Bundle' ? raw.entry.map((e) => e.resource) : [raw];

const results = [];
for (const oc of outcomes) {
  const src = oc.extension?.find((x) => x.url?.endsWith('operationoutcome-file'))?.valueString
    || oc.issue?.[0]?.location?.[0] || '';
  const ex = examples.find((e) => src.includes(basename(e.file, '.json'))) || null;
  const issues = oc.issue || [];
  const errors = issues.filter((i) => i.severity === 'error' || i.severity === 'fatal');
  results.push({
    example: ex?.file ?? basename(src),
    resourceType: ex?.resourceType ?? null,
    declaredProfile: ex?.profile ?? null,
    errorCount: errors.length,
    warningCount: issues.filter((i) => i.severity === 'warning').length,
    conforms: errors.length === 0,
    firstError: (errors[0]?.diagnostics || errors[0]?.details?.text || '').slice(0, 300),
  });
  console.log(`${errors.length === 0 ? '  ✓ 0 errors' : `  ✗ ${errors.length} error(s)`}  ${ex?.file ?? basename(src)}` +
    `${ex?.profile ? `  → ${ex.profile.split('/').pop()}` : '  → base FHIR'}`);
  if (errors.length) console.log(`      ${(errors[0]?.diagnostics || errors[0]?.details?.text || '').slice(0, 160)}`);
}

const conforming = results.filter((r) => r.conforms).length;
const pass = results.length === examples.length && conforming === examples.length;

// Every deposited record is stamped with the IG version it was produced against
// and when it ran, so a reader can tell whether the evidence matches the release.
function igStamp() {
  const cfg = readFileSync(join(IG, 'sushi-config.yaml'), 'utf8');
  const v = cfg.match(/^version:\s*(\S+)/m);
  return { igVersion: v ? v[1] : 'unknown', runTimestamp: new Date().toISOString() };
}

const summary = {
  ...igStamp(),
  validator: 'HL7 reference validator (validator_cli.jar), FHIR R4, IG package from ig/output',
  deployment: 'in-toolchain reference validator (the second deployment for the accepting side)',
  note: 'Both this validator and the HAPI server share the HL7 Java validation core: portability across deployments, not independence across implementations.',
  examplesTested: results.length,
  conforming,
  validatedAgainstDeclaredProfile: results.filter((r) => r.declaredProfile).length,
  validatedAgainstBaseFhir: results.filter((r) => !r.declaredProfile).length,
  pass,
  results,
};
writeFileSync(join(OUT, 'positive-conformance-cli.json'), JSON.stringify(summary, null, 2));

let md = '# Positive examples — reference validator (second deployment)\n\n';
md += `**${conforming}/${results.length} examples conform** — ${pass ? 'PASS' : 'FAIL'}. `;
md += `${summary.validatedAgainstDeclaredProfile} were validated against a declared IG profile; `;
md += `${summary.validatedAgainstBaseFhir} (Patient, Organization) declare no profile and were validated against base FHIR.\n\n`;
md += '| Example | Declared profile | errors | warnings |\n|---|---|---|---|\n';
for (const r of results) {
  md += `| \`${r.example}\` | ${r.declaredProfile ? r.declaredProfile.split('/').pop() : '— (base FHIR)'} | ${r.errorCount} | ${r.warningCount} |\n`;
}
md += `\n${summary.note}\n`;
writeFileSync(join(OUT, 'POSITIVE-CONFORMANCE-CLI.md'), md);

console.log(`\n${pass ? 'PASS' : 'FAIL'}: ${conforming}/${results.length} examples validated at 0 errors by the reference validator`);
console.log('→ conformance/out/positive-conformance-cli.json + POSITIVE-CONFORMANCE-CLI.md');
process.exit(pass ? 0 : 1);
