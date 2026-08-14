// ============================================================================
// validate-with-firely.mjs — the third deployment, and the first one that does
// NOT share the HL7 Java validation core.
//
// Why this exists. Both other deployments (the HL7 reference validator and the
// HAPI server) run the same Java validation core, so agreement between them
// shows portability across deployments and nothing about independence across
// implementations: a misreading of the specification that the Java core happens
// to share would survive both. Firely Terminal runs the Firely .NET SDK, a
// separately written implementation of the same specification, so a profile
// that behaves the same way here is behaving the same way in two independent
// engines.
//
// The suite is the same one the other two deployments run: eight positive
// examples that must validate, and ten negative fixtures that must be rejected
// for the constraint each targets — judged by the same signature rule, applied
// to Firely's own wording rather than the Java core's.
//
// Everything runs in a digest-pinned container and the tool version is pinned,
// so the run needs no .NET install on the host. One honest caveat: the tool is
// fetched from nuget.org at run time rather than baked into an image we publish,
// so this step needs network access, exactly as the reference validator needs
// its jar in input-cache. Pin and container fix *what* runs, not where it is
// fetched from.
//
// Run:  node validate-with-firely.mjs      (requires Docker)
// Out:  conformance/out/firely-conformance.{json,md}
// ============================================================================
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IG = dirname(HERE);
const OUT = join(HERE, 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const IMAGE = 'mcr.microsoft.com/dotnet/sdk@sha256:306301580fcaa5b445180e759db59309979002d1000669cb4cf58a567d0014bc';
const TOOL_VERSION = '3.5.0';

// The same acceptance rule as the other two deployments: a fixture counts as
// rejected only when the error carries the signature of the constraint under
// test. The patterns are matched against Firely's message *and* its location,
// because Firely reports cardinality failures as a generic message with the
// element in the location line.
const SPECS = {
  'neg-aspiration-preliminary.json': { why: 'status preliminary — profile fixes status to final', signature: /preliminary|fixed value 'final'|Observation\.status/i },
  'neg-aspiration-wrongcode.json': { why: 'wrong SNOMED code — profile pattern fixes code to 371736008', signature: /371736008|does not match pattern|Observation\.code/i },
  'neg-screening-noeffective.json': { why: 'effective[x] absent — profile requires effective[x] 1..1', signature: /effective/i },
  'neg-severity-nosubject.json': { why: 'subject absent — profile requires subject 1..1', signature: /subject/i },
  'neg-diet-food-code-on-fluid.json': { why: 'food-axis concept on fluidConsistencyType — invariant iddsi-axis-fluid', signature: /iddsi-axis-fluid/i },
  'neg-diet-drink-code-on-food.json': { why: 'drink-only concept on texture.modifier — invariant iddsi-axis-food', signature: /iddsi-axis-food/i },
  'neg-summary-no-entry.json': { why: 'sections without section.entry — invariant dct-has-content', signature: /dct-has-content/i },
  'neg-instrumental-pas-out-of-range.json': { why: 'PAS component value 99 — invariant pas-range (scale is 1-8)', signature: /pas-range/i },
  'neg-summary-wrong-type.json': { why: 'wrong Composition.type code — profile fixes type to LOINC 34133-9', signature: /34133-9|Composition\.type/i },
  'neg-summary-foreign-entry.json': { why: 'section.entry references a Condition — profile restricts entries to the IG profiles', signature: /target profiles|Condition/i },
};

const RES = join(IG, 'fsh-generated', 'resources');
const CONFORMANCE = new Set(['CodeSystem', 'ValueSet', 'StructureDefinition', 'ImplementationGuide']);
const examples = [];
for (const f of readdirSync(RES).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(RES, f), 'utf8'));
  if (!r.resourceType || CONFORMANCE.has(r.resourceType)) continue;
  examples.push({ file: f, profile: r.meta?.profile?.[0] || null, resourceType: r.resourceType });
}
examples.sort((a, b) => a.file.localeCompare(b.file));
const fixtures = readdirSync(join(HERE, 'negative-fixtures')).filter((f) => f.endsWith('.json')).sort();

console.log(`Firely .NET SDK via Firely Terminal ${TOOL_VERSION}`);
console.log(`  ${examples.length} positive examples must validate; ${fixtures.length} negative fixtures must be rejected\n`);

// One container run does the whole suite: installing the tool per file would
// dominate the wall clock and buy nothing.
const script = `
set -e
dotnet tool install -g firely.terminal --version ${TOOL_VERSION} >/dev/null 2>&1
export PATH=$PATH:/root/.dotnet/tools
mkdir -p /w && cd /w
cp /ig/fsh-generated/resources/*.json .
cp /ig/conformance/negative-fixtures/*.json .
fhir install hl7.fhir.r4.core 4.0.1 >/dev/null 2>&1
for f in ${[...examples.map((e) => e.file), ...fixtures].join(' ')}; do
  echo "@@FILE $f"
  fhir push "$f" >/dev/null 2>&1
  fhir validate 2>&1 | sed 's/^/@@OUT /'
done
`;

let raw = '';
try {
  raw = execFileSync('docker', ['run', '--rm', '-v', `${IG}:/ig`, IMAGE, 'bash', '-c', script],
    { encoding: 'utf8', maxBuffer: 1 << 28 });
} catch (e) {
  raw = (e.stdout || '') + (e.stderr || '');
  if (!raw.includes('@@FILE')) { console.error('FAIL: the container produced no results.\n' + raw.slice(-2000)); process.exit(1); }
}

// ---- parse ----------------------------------------------------------------
const blocks = new Map();
let current = null;
for (const line of raw.split(/\r?\n/)) {
  const f = line.match(/^@@FILE (.+)$/);
  if (f) { current = f[1].trim(); blocks.set(current, []); continue; }
  const o = line.match(/^@@OUT ?(.*)$/);
  if (o && current) blocks.get(current).push(o[1]);
}

const results = [];
for (const e of examples) {
  const out = (blocks.get(e.file) || []).join('\n');
  const valid = /Result:\s*VALID/i.test(out);
  results.push({ kind: 'positive', file: e.file, declaredProfile: e.profile, valid, pass: valid,
    firstIssue: (out.match(/^Error:.*$/m) || [''])[0].slice(0, 300) });
  console.log(`  ${valid ? '✓ valid  ' : '✗ INVALID'}  ${e.file}${e.profile ? '  → ' + e.profile.split('/').pop() : '  → base FHIR'}`);
}
console.log();
for (const f of fixtures) {
  const out = (blocks.get(f) || []).join('\n');
  const invalid = /Result:\s*INVALID/i.test(out);
  const spec = SPECS[f];
  // Firely prints "Error: <message>" then "At: <location>"; the signature is
  // matched against both, since cardinality failures name the element only in
  // the location line.
  const issue = (out.match(/Error:[\s\S]*?(?=\nResult:)/) || [''])[0];
  const signatureMatched = spec ? spec.signature.test(issue) : false;
  const pass = invalid && signatureMatched;
  results.push({ kind: 'negative', file: f, expected: spec?.why ?? null, invalid, signatureMatched,
    correctlyRejected: pass, pass, firstIssue: issue.replace(/\s+/g, ' ').trim().slice(0, 300) });
  console.log(`  ${pass ? '✓ correctly rejected' : '✗ NOT rejected for the right reason'}  ${f}`);
  if (spec) console.log(`      expected: ${spec.why}`);
  console.log(`      firely: ${issue.replace(/\s+/g, ' ').trim().slice(0, 150) || '(no error)'}`);
}

function igStamp() {
  const cfg = readFileSync(join(IG, 'sushi-config.yaml'), 'utf8');
  const v = cfg.match(/^version:\s*(\S+)/m);
  return { igVersion: v ? v[1] : 'unknown', runTimestamp: new Date().toISOString() };
}

const pos = results.filter((r) => r.kind === 'positive');
const neg = results.filter((r) => r.kind === 'negative');
const pass = results.every((r) => r.pass);

const summary = {
  ...igStamp(),
  validator: `Firely .NET SDK via Firely Terminal ${TOOL_VERSION} (image ${IMAGE})`,
  deployment: 'independent implementation — does NOT share the HL7 Java validation core',
  note: 'Unlike the reference validator and the HAPI server, this engine is a separately written implementation of the same specification. Agreement here is independence across implementations, not only portability across deployments.',
  positives: { tested: pos.length, valid: pos.filter((r) => r.valid).length },
  negatives: { tested: neg.length, correctlyRejected: neg.filter((r) => r.correctlyRejected).length },
  pass,
  results,
};
writeFileSync(join(OUT, 'firely-conformance.json'), JSON.stringify(summary, null, 2));

let md = '# Independent implementation — Firely .NET SDK\n\n';
md += `${summary.positives.valid}/${summary.positives.tested} positive examples validated and `;
md += `${summary.negatives.correctlyRejected}/${summary.negatives.tested} negative fixtures were rejected for the constraint they target — ${pass ? 'PASS' : 'FAIL'}.\n\n`;
md += `${summary.note}\n\n## Negative fixtures\n\n| Fixture | Constraint under test | rejected | signature matched | Firely's own message |\n|---|---|---|---|---|\n`;
for (const r of neg) md += `| \`${r.file}\` | ${r.expected || '—'} | ${r.invalid ? 'yes' : 'NO'} | ${r.signatureMatched ? 'yes' : 'NO'} | ${r.firstIssue.replace(/\|/g, '\\|').slice(0, 160)} |\n`;
md += `\n## Positive examples\n\n| Example | Declared profile | valid |\n|---|---|---|\n`;
for (const r of pos) md += `| \`${r.file}\` | ${r.declaredProfile ? r.declaredProfile.split('/').pop() : '— (base FHIR)'} | ${r.valid ? 'yes' : 'NO'} |\n`;
writeFileSync(join(OUT, 'FIRELY-CONFORMANCE.md'), md);

console.log(`\n${pass ? 'PASS' : 'FAIL'}: ${summary.positives.valid}/${summary.positives.tested} positives valid, ${summary.negatives.correctlyRejected}/${summary.negatives.tested} negatives correctly rejected on an independent implementation`);
console.log('→ conformance/out/firely-conformance.json + FIRELY-CONFORMANCE.md');
process.exit(pass ? 0 : 1);
