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
import { mkdirSync, writeFileSync } from 'node:fs';
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
  let server = { name: 'unknown', version: 'unknown', fhirVersion: 'unknown' };
  try {
    const cap = await fetch(`${base}/metadata`, { headers: { Accept: FHIR_JSON } });
    const j = await cap.json();
    server = {
      name: j.software?.name || 'server',
      version: j.software?.version || 'unknown',
      fhirVersion: j.fhirVersion || 'unknown',
    };
    console.log(`  ${server.name} ${server.version} — FHIR ${server.fhirVersion}\n`);
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
  const results = [];
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
    results.push({
      resource: `${r.resourceType}/${r.id}`,
      profile: profile || null,
      validatedAgainst: profile ? 'declared IG profile' : 'base FHIR (no profile declared)',
      worstSeverity: w,
      conforms: !bad,
    });
  }

  const passed = examples.length - failed;
  const profiled = results.filter((x) => x.profile).length;
  console.log(
    `\n${failed === 0 ? 'PASS' : 'FAIL'}: ${passed}/${examples.length} examples conform on ${base}` +
      `  (${profiled} validated against a declared IG profile, ${examples.length - profiled} against base FHIR)`,
  );

  // Deposit machine-readable evidence: the headline count alone does not show which
  // examples carry a profile, so the split is recorded explicitly.
  const outDir = join(here, 'out');
  mkdirSync(outDir, { recursive: true });
  const report = {
    kind: 'positive-conformance',
    ...igStamp(here),
    server: { baseUrl: base, ...server },
    examplesTested: examples.length,
    conforming: passed,
    validatedAgainstDeclaredProfile: profiled,
    validatedAgainstBaseFhir: examples.length - profiled,
    pass: failed === 0,
    results,
  };
  writeFileSync(join(outDir, 'positive-conformance.json'), JSON.stringify(report, null, 2));
  const md = [
    '# Positive conformance results',
    '',
    `Server: **${server.name} ${server.version}** (FHIR ${server.fhirVersion}) at \`${base}\``,
    '',
    `**${passed}/${examples.length} examples conform** — ${failed === 0 ? 'PASS' : 'FAIL'}`,
    '',
    `Of these, **${profiled}** declare an IG profile and were validated against it; ` +
      `**${examples.length - profiled}** (Patient, Organization) declare no profile and were validated against base FHIR.`,
    '',
    '| Resource | Validated against | Worst severity | Conforms |',
    '|---|---|---|---|',
    ...results.map(
      (x) =>
        `| \`${x.resource}\` | ${x.profile ? `\`${x.profile.split('/').pop()}\`` : 'base FHIR'} | ${x.worstSeverity} | ${x.conforms ? 'yes' : 'NO'} |`,
    ),
  ].join('\n');
  writeFileSync(join(outDir, 'POSITIVE-CONFORMANCE.md'), md + '\n');
  console.log(`→ conformance/out/positive-conformance.json + POSITIVE-CONFORMANCE.md`);

  process.exit(failed === 0 ? 0 : 1);
}

main();
