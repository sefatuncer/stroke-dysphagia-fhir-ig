// Negative ("should-fail") conformance check.
//
// Positive conformance (validate-on-server.mjs) shows the intended-to-pass examples
// conform. That alone does NOT show the profiles actually CONSTRAIN anything — an
// over-permissive profile would pass everything. This harness proves the constraints
// bite: each fixture in negative-fixtures/ violates ONE profile rule and MUST be
// REJECTED with an error/fatal by an independent server's $validate.
//
//   node validate-negatives.mjs [baseUrl]
//   # default baseUrl = http://localhost:8080/fhir
//
// Exit code 0 = every negative fixture was correctly rejected (error/fatal);
//           1 = at least one negative fixture slipped through (ok/warning) → constraint missing.

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// A13: stamp the deposited record with the IG version it was produced against and when it
// ran, so a reader can tell whether the evidence matches the release the paper reports.
function igStamp(hereDir) {
  const cfg = readFileSync(join(dirname(hereDir), 'sushi-config.yaml'), 'utf8');
  const v = cfg.match(/^version:\s*(\S+)/m);
  return { igVersion: v ? v[1] : 'unknown', runTimestamp: new Date().toISOString() };
}

const base = (process.argv[2] || 'http://localhost:8080/fhir').replace(/\/+$/, '');
const here = dirname(fileURLToPath(import.meta.url));
const resDir = join(here, '..', 'fsh-generated', 'resources');
const negDir = join(here, 'negative-fixtures');
const FHIR_JSON = 'application/fhir+json';

// What each fixture is SUPPOSED to violate, and the signature the server's error
// MUST carry. Asserting the signature (not merely "some error occurred") is what
// makes this a real negative test: a server that cannot resolve the profile also
// returns an error, and without this check that failure would be miscounted as a
// correct rejection.
const EXPECTED = {
  'neg-aspiration-preliminary.json': {
    why: 'status=preliminary — profile fixes status to final',
    signature: /status|preliminary|final/i,
  },
  'neg-aspiration-wrongcode.json': {
    why: 'code≠371736008 — profile fixes the at-risk-for-aspiration code',
    signature: /code|371736008|fixed/i,
  },
  'neg-screening-noeffective.json': {
    why: 'effective[x] absent — profile requires effective[x] 1..1',
    signature: /effective|minimum required/i,
  },
  'neg-severity-nosubject.json': {
    why: 'subject absent — profile requires subject 1..1 (tightened from base 0..1)',
    signature: /subject|minimum required/i,
  },
  'neg-diet-food-code-on-fluid.json': {
    why: 'food-axis IDDSI concept on fluidConsistencyType — violates invariant iddsi-axis-fluid',
    signature: /iddsi-axis-fluid|fluidConsistencyType|drink axis/i,
  },
  'neg-diet-drink-code-on-food.json': {
    why: 'drink-axis IDDSI concept on texture.modifier — violates invariant iddsi-axis-food',
    signature: /iddsi-axis-food|texture|food axis/i,
  },
  'neg-summary-no-entry.json': {
    why: 'sections carry narrative but no section.entry — violates invariant dct-has-content (empty envelope)',
    signature: /dct-has-content|section\.entry|at least one section/i,
  },
  'neg-instrumental-pas-out-of-range.json': {
    why: 'PAS component value 99 — violates invariant pas-range (scale is 1-8)',
    signature: /pas-range|Penetration-Aspiration|8-point/i,
  },
};

// If the error is only about the profile itself being unresolvable, the fixture was
// NOT rejected for the reason under test. Treat that as a failure, not a pass.
// Kept deliberately narrow. An earlier, looser version ("profile .* not found")
// misfired on HAPI's pattern-violation message — "The pattern [...] defined in the
// profile <url> not found" — where "not found" refers to the pattern, not the profile.
const UNRESOLVED_PROFILE =
  /could not be resolved|unable to resolve|unknown profile|failed to resolve|profile reference .*(not found|could not be)/i;

const load = (dir, f) => JSON.parse(readFileSync(join(dir, f), 'utf8'));
const confOrder = { CodeSystem: 0, ValueSet: 1, StructureDefinition: 2 };
const conf = readdirSync(resDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => load(resDir, f))
  .filter((r) => r.resourceType in confOrder)
  .sort((a, b) => confOrder[a.resourceType] - confOrder[b.resourceType]);

const worst = (oo) => {
  const sev = (oo?.issue || []).map((i) => i.severity);
  if (sev.includes('fatal')) return 'fatal';
  if (sev.includes('error')) return 'error';
  if (sev.includes('warning')) return 'warning';
  return 'ok';
};
const errorTexts = (oo) =>
  (oo?.issue || [])
    .filter((i) => i.severity === 'error' || i.severity === 'fatal')
    .map((i) => i.diagnostics || i.details?.text || '');
const firstError = (oo) => (errorTexts(oo)[0] || '').slice(0, 140);

async function main() {
  process.stdout.write(`Server: ${base}\n`);
  let server = { name: 'unknown', version: 'unknown', fhirVersion: 'unknown' };
  try {
    const cap = await (await fetch(`${base}/metadata`, { headers: { Accept: FHIR_JSON } })).json();
    server = {
      name: cap.software?.name || 'server',
      version: cap.software?.version || 'unknown',
      fhirVersion: cap.fhirVersion || 'unknown',
    };
    console.log(`  ${server.name} ${server.version} — FHIR ${server.fhirVersion}\n`);
  } catch (e) {
    console.error(`  UNREACHABLE: ${e.message}`);
    process.exit(2);
  }

  console.log(`Uploading ${conf.length} conformance resources (CS/VS/SD)...`);
  for (const r of conf) {
    const res = await fetch(`${base}/${r.resourceType}/${r.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': FHIR_JSON, Accept: FHIR_JSON },
      body: JSON.stringify(r),
    });
    if (!res.ok) console.log(`  ✗ ${r.resourceType}/${r.id} (HTTP ${res.status})`);
  }

  const negFiles = readdirSync(negDir).filter((f) => f.endsWith('.json'));
  console.log(`\nValidating ${negFiles.length} NEGATIVE fixtures (each MUST be rejected):`);
  let slipped = 0;
  const results = [];
  for (const f of negFiles) {
    const r = load(negDir, f);
    const profile = r.meta?.profile?.[0];
    const q = profile ? `?profile=${encodeURIComponent(profile)}` : '';
    let oo;
    try {
      const res = await fetch(`${base}/${r.resourceType}/$validate${q}`, {
        method: 'POST',
        headers: { 'Content-Type': FHIR_JSON, Accept: FHIR_JSON },
        body: JSON.stringify(r),
      });
      oo = await res.json();
    } catch (e) {
      console.log(`  ? ${f} — request failed: ${e.message}`);
      slipped++;
      continue;
    }
    const w = worst(oo);
    const errored = w === 'error' || w === 'fatal';
    const allErrors = errorTexts(oo).join(' | ');
    const spec = EXPECTED[f];

    // A rejection counts only if (a) the server errored, (b) the error carries the
    // signature of the constraint under test, and (c) it is not merely an
    // unresolvable-profile complaint.
    const signatureMatched = spec ? spec.signature.test(allErrors) : false;
    const profileUnresolved = UNRESOLVED_PROFILE.test(allErrors);
    const rejected = errored && signatureMatched && !profileUnresolved;

    if (!rejected) slipped++;
    let verdict = '✓ correctly rejected';
    if (!errored) verdict = '✗ SLIPPED THROUGH (no error)';
    else if (profileUnresolved) verdict = '✗ WRONG REASON (profile unresolved)';
    else if (!signatureMatched) verdict = '✗ WRONG REASON (signature not matched)';

    console.log(`  ${verdict}  ${f}  → ${w}`);
    console.log(`      expected: ${spec?.why || '(unspecified)'}`);
    if (errored) console.log(`      server error: ${firstError(oo)}`);

    results.push({
      fixture: f,
      resourceType: r.resourceType,
      profile,
      expected: spec?.why || null,
      worstSeverity: w,
      signatureMatched,
      profileUnresolved,
      correctlyRejected: rejected,
      firstError: firstError(oo),
      allErrors,
    });
  }

  const ok = negFiles.length - slipped;
  const pass = slipped === 0;
  console.log(`\n${pass ? 'PASS' : 'FAIL'}: ${ok}/${negFiles.length} negative fixtures correctly rejected on ${base}`);

  // Deposit machine-readable evidence so the reported figure is reproducible from
  // the archive rather than only from a console session.
  const outDir = join(here, 'out');
  mkdirSync(outDir, { recursive: true });
  const report = {
    kind: 'negative-conformance',
    ...igStamp(here),
    server: { baseUrl: base, ...server },
    fixturesTested: negFiles.length,
    correctlyRejected: ok,
    pass,
    results,
  };
  writeFileSync(join(outDir, 'negative-conformance.json'), JSON.stringify(report, null, 2));
  const md = [
    '# Negative conformance results',
    '',
    `Server: **${server.name} ${server.version}** (FHIR ${server.fhirVersion}) at \`${base}\``,
    '',
    `**${ok}/${negFiles.length} negative fixtures correctly rejected** — ${pass ? 'PASS' : 'FAIL'}`,
    '',
    '| Fixture | Profile constraint under test | Worst severity | Signature matched | Correctly rejected |',
    '|---|---|---|---|---|',
    ...results.map(
      (x) =>
        `| \`${x.fixture}\` | ${x.expected || '—'} | ${x.worstSeverity} | ${x.signatureMatched ? 'yes' : 'no'} | ${x.correctlyRejected ? 'yes' : 'NO'} |`,
    ),
    '',
    'A fixture counts as correctly rejected only when the server errors, the error carries the',
    'signature of the constraint under test, and the error is not merely an unresolvable-profile',
    'complaint. This prevents a profile-resolution failure from being miscounted as a rejection.',
  ].join('\n');
  writeFileSync(join(outDir, 'NEGATIVE-CONFORMANCE.md'), md + '\n');
  console.log(`→ conformance/out/negative-conformance.json + NEGATIVE-CONFORMANCE.md`);

  process.exit(pass ? 0 : 1);
}

main();
