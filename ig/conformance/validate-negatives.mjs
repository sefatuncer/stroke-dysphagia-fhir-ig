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

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = (process.argv[2] || 'http://localhost:8080/fhir').replace(/\/+$/, '');
const here = dirname(fileURLToPath(import.meta.url));
const resDir = join(here, '..', 'fsh-generated', 'resources');
const negDir = join(here, 'negative-fixtures');
const FHIR_JSON = 'application/fhir+json';

// What each fixture is SUPPOSED to violate (for readable output).
const EXPECTED = {
  'neg-aspiration-preliminary.json': 'status=preliminary — profile fixes status to final',
  'neg-aspiration-wrongcode.json': 'code≠371736008 — profile fixes the at-risk-for-aspiration code',
  'neg-screening-noeffective.json': 'effective[x] absent — profile requires effective[x] 1..1',
  'neg-severity-nosubject.json': 'subject absent — profile requires subject 1..1 (tightened from base 0..1)',
};

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
const firstError = (oo) =>
  (oo?.issue || [])
    .filter((i) => i.severity === 'error' || i.severity === 'fatal')
    .map((i) => (i.diagnostics || i.details?.text || '').slice(0, 140))[0] || '';

async function main() {
  process.stdout.write(`Server: ${base}\n`);
  try {
    const cap = await (await fetch(`${base}/metadata`, { headers: { Accept: FHIR_JSON } })).json();
    console.log(`  ${cap.software?.name || 'server'} ${cap.software?.version || ''} — FHIR ${cap.fhirVersion || '?'}\n`);
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
    const rejected = w === 'error' || w === 'fatal';
    if (!rejected) slipped++;
    console.log(`  ${rejected ? '✓ correctly rejected' : '✗ SLIPPED THROUGH'}  ${f}  → ${w}`);
    console.log(`      expected: ${EXPECTED[f] || '(unspecified)'}`);
    if (rejected) console.log(`      server error: ${firstError(oo)}`);
  }

  const ok = negFiles.length - slipped;
  console.log(`\n${slipped === 0 ? 'PASS' : 'FAIL'}: ${ok}/${negFiles.length} negative fixtures correctly rejected on ${base}`);
  process.exit(slipped === 0 ? 0 : 1);
}

main();
