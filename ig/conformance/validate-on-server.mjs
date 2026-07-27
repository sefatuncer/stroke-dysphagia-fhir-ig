// Cross-implementation conformance check.
//
// Uploads the IG's conformance resources (CodeSystem/ValueSet/StructureDefinition)
// to an INDEPENDENT FHIR server, then validates each synthetic example against its
// declared profile via that server's $validate operation. This demonstrates the
// examples conform on a server we did NOT author (not self-validation).
//
//   node validate-on-server.mjs [baseUrl]
//   # default baseUrl = http://localhost:8080/fhir
//
// Exit code 0 = every example passed (no error/fatal issues); 1 = at least one failed.

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = (process.argv[2] || 'http://localhost:8080/fhir').replace(/\/+$/, '');
const here = dirname(fileURLToPath(import.meta.url));
const resDir = join(here, '..', 'fsh-generated', 'resources');
const FHIR_JSON = 'application/fhir+json';

const files = readdirSync(resDir).filter((f) => f.endsWith('.json'));
const load = (f) => JSON.parse(readFileSync(join(resDir, f), 'utf8'));

const confOrder = { CodeSystem: 0, ValueSet: 1, StructureDefinition: 2 };
const conf = [];
const examples = [];
for (const f of files) {
  const r = load(f);
  if (!r.resourceType || r.resourceType === 'ImplementationGuide') continue;
  if (r.resourceType in confOrder) conf.push(r);
  else examples.push(r);
}
conf.sort((a, b) => confOrder[a.resourceType] - confOrder[b.resourceType]);

const worst = (oo) => {
  const sev = (oo?.issue || []).map((i) => i.severity);
  if (sev.includes('fatal')) return 'fatal';
  if (sev.includes('error')) return 'error';
  if (sev.includes('warning')) return 'warning';
  return 'ok';
};
const issuesText = (oo) =>
  (oo?.issue || [])
    .filter((i) => i.severity === 'error' || i.severity === 'fatal')
    .map((i) => `      · ${i.severity}: ${i.diagnostics || i.details?.text || ''}`)
    .join('\n');

async function main() {
  // 0) sanity: server reachable
  process.stdout.write(`Server: ${base}\n`);
  try {
    const cap = await fetch(`${base}/metadata`, { headers: { Accept: FHIR_JSON } });
    const j = await cap.json();
    console.log(`  ${j.software?.name || 'server'} ${j.software?.version || ''} — FHIR ${j.fhirVersion || '?'}\n`);
  } catch (e) {
    console.error(`  UNREACHABLE: ${e.message}`);
    process.exit(2);
  }

  // 1) upload conformance resources
  console.log(`Uploading ${conf.length} conformance resources (CS/VS/SD)...`);
  for (const r of conf) {
    const url = `${base}/${r.resourceType}/${r.id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': FHIR_JSON, Accept: FHIR_JSON },
      body: JSON.stringify(r),
    });
    const tag = res.ok ? 'ok' : `HTTP ${res.status}`;
    console.log(`  ${res.ok ? '✓' : '✗'} ${r.resourceType}/${r.id} (${tag})`);
  }

  // 2) validate each example against its declared profile
  console.log(`\nValidating ${examples.length} examples via $validate:`);
  let failed = 0;
  for (const r of examples) {
    const profile = r.meta?.profile?.[0];
    const q = profile ? `?profile=${encodeURIComponent(profile)}` : '';
    const url = `${base}/${r.resourceType}/$validate${q}`;
    let oo;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': FHIR_JSON, Accept: FHIR_JSON },
        body: JSON.stringify(r),
      });
      oo = await res.json();
    } catch (e) {
      console.log(`  ✗ ${r.resourceType}/${r.id} — request failed: ${e.message}`);
      failed++;
      continue;
    }
    const w = worst(oo);
    const bad = w === 'error' || w === 'fatal';
    if (bad) failed++;
    const label = r.meta?.profile?.[0]?.split('/').pop() || '(base)';
    console.log(`  ${bad ? '✗' : '✓'} ${r.resourceType}/${r.id}  [${label}]  → ${w}`);
    if (bad) console.log(issuesText(oo));
  }

  console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'}: ${examples.length - failed}/${examples.length} examples conform on ${base}`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
