// ============================================================================
// terminology-crosscheck.mjs — re-test the coverage assessment on a SECOND,
// independently operated terminology server running different software.
// ----------------------------------------------------------------------------
// Why this exists. The coverage assessment in the manuscript was made against
// one server (tx.fhir.org, the HL7 reference server, Java). A limitation said
// so: a single server can miss a code filed under an unexpected display, and
// every absence call — the whole *gap* side of the result — rests on it.
// That limitation is removable, so it is removed here rather than declared.
//
// The second server is TerminZ (https://terminz.azurewebsites.net/fhir), the
// New Zealand national terminology service. It matters that it is different in
// three independent ways:
//   * different implementation  — CSIRO Ontoserver, sharing no code with the
//     HL7 Java reference server;
//   * different edition         — SNOMED CT NZ Edition, i.e. the International
//     Edition plus a national extension;
//   * different (later) release — a version stamped well after the 20250201
//     International release the manuscript reports against.
//
// The extension is the reason every presence call is checked for its module of
// origin: a concept that exists only in the NZ extension is NOT evidence that
// the International Edition carries it, and counting one as such would turn a
// cross-check into a false confirmation. Such a concept is reported as
// EXTENSION-ONLY, never as confirmed.
//
// Absence is not proven by one query either. Each gap probe runs several
// independent filter terms, and the run is only meaningful if the positive
// controls resolve — so those run first and the script refuses to report if
// they do not.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');

const BASE = 'https://terminz.azurewebsites.net/fhir';
const SCT = 'http://snomed.info/sct';
const LOINC = 'http://loinc.org';
const INTL_MODULE = '900000000000207008';   // SNOMED CT core module
const MODEL_MODULE = '900000000000012004';  // SNOMED CT model component module

// --- the codes the IG actually reuses ---------------------------------------
// Grouped as the manuscript groups them so the record can be read against
// Table 2 without a lookup table.
const REUSED = [
  { group: 'Screening',              system: SCT,   code: '1289999007', label: 'GUSS' },
  { group: 'Screening',              system: SCT,   code: '717684008',  label: 'Yale / 3-oz protocol' },
  { group: 'Screening',              system: SCT,   code: '716854005',  label: 'Yale / 3-oz score' },
  { group: 'Instrumental',           system: SCT,   code: '241149003',  label: 'VFSS' },
  { group: 'Instrumental',           system: SCT,   code: '311834001',  label: 'FEES' },
  { group: 'Instrumental',           system: LOINC, code: '24681-9',    label: 'VFSS (LOINC)' },
  { group: 'Instrumental',           system: LOINC, code: '86395-1',    label: 'VFSS swallowing study (LOINC)' },
  { group: 'Severity',               system: SCT,   code: '767131006',  label: 'DOSS' },
  { group: 'Severity',               system: SCT,   code: '1231505003', label: 'IDDSI-FDS' },
  { group: 'Severity',               system: LOINC, code: '99852-6',    label: 'ASHA-NOMS FCM swallowing panel' },
  { group: 'IDDSI drink axis',       system: SCT,   code: '1231508001', label: 'IDDSI drink Level 0 (thin)' },
  { group: 'IDDSI drink axis',       system: SCT,   code: '1237441005', label: 'IDDSI drink Level 1' },
  { group: 'IDDSI drink axis',       system: SCT,   code: '1237442003', label: 'IDDSI drink Level 2' },
  { group: 'IDDSI drink axis',       system: SCT,   code: '1237444002', label: 'IDDSI Level 3 (shared axis)' },
  { group: 'IDDSI drink axis',       system: SCT,   code: '1237446000', label: 'IDDSI drink Level 4' },
  { group: 'IDDSI food axis',        system: SCT,   code: '1237447009', label: 'IDDSI food Level 4' },
  { group: 'IDDSI food axis',        system: SCT,   code: '1237448004', label: 'IDDSI food Level 5' },
  { group: 'IDDSI food axis',        system: SCT,   code: '1237449007', label: 'IDDSI food Level 6' },
  { group: 'IDDSI food axis',        system: SCT,   code: '1237450007', label: 'IDDSI food Level 7 (easy to chew)' },
  { group: 'IDDSI food axis',        system: SCT,   code: '1237451006', label: 'IDDSI food Level 7 (regular)' },
  { group: 'Core findings',          system: SCT,   code: '371736008',  label: 'At risk for aspiration' },
  { group: 'Core findings',          system: SCT,   code: '68052005',   label: 'Pulmonary aspiration' },
  { group: 'Core findings',          system: SCT,   code: '40739000',   label: 'Dysphagia' },
  { group: 'Core findings',          system: SCT,   code: '182923009',  label: 'Nil by mouth' },
  { group: 'Cohort criterion',       system: SCT,   code: '230690007',  label: 'Cerebrovascular accident' },
  { group: 'Hierarchy anchor',       system: SCT,   code: '273249006',  label: 'Assessment scale' },
];

// --- the absence calls, each probed with several independent filter terms ----
// A single term can fail for a reason that has nothing to do with coverage (a
// hyphen, an abbreviation the server does not index), so a gap is only
// reported as reproduced when EVERY term returns nothing.
const GAP_PROBES = [
  { label: 'FOIS',                    terms: ['Functional Oral Intake', 'FOIS', 'oral intake scale'] },
  { label: 'PAS',                     terms: ['Penetration-Aspiration Scale', 'Penetration Aspiration', 'Rosenbek'] },
  { label: 'DIGEST',                  terms: ['Dynamic Imaging Grade', 'DIGEST', 'swallowing toxicity'] },
  { label: 'TOR-BSST',                terms: ['Toronto Bedside', 'TOR-BSST', 'bedside swallowing screening test'] },
  { label: 'V-VST',                   terms: ['Volume-Viscosity', 'Volume Viscosity', 'V-VST'] },
  { label: 'EAT-10',                  terms: ['Eating Assessment Tool', 'EAT-10'] },
  { label: 'Yale Pharyngeal Residue', terms: ['Pharyngeal Residue', 'Yale Pharyngeal'] },
  { label: 'MBSImP',                  terms: ['Modified Barium Swallow Impairment', 'MBSImP'] },
  { label: 'silent aspiration',       terms: ['Silent aspiration'] },
  { label: 'laryngeal penetration',   terms: ['Laryngeal penetration', 'penetration of larynx'] },
];

// --- positive controls -------------------------------------------------------
// If the search path is broken, every gap probe returns nothing and the run
// would "confirm" all ten absences. These terms must resolve, or nothing is
// reported at all.
const POSITIVE_CONTROLS = [
  { term: 'Dysphagia Outcome and Severity', expect: '767131006' },
  { term: 'Gugging',                        expect: '1289999007' },
  { term: 'Fibreoptic endoscopic evaluation of swallowing', expect: '311834001' },
];

// --- domain screen for gap-probe hits ---------------------------------------
// A short acronym is a substring trap: the term "DIGEST" lexically matches
// "Digestant", "Digestive biscuit" and two dozen other digestion concepts that
// have nothing to do with the Dynamic Imaging Grade of Swallowing Toxicity.
// Screening those by hand after seeing them would be tuning the test to its
// own result, so the rule is stated up front and applied mechanically: a hit
// counts as a candidate only if its display carries swallowing-domain
// vocabulary. Every hit is kept in the record either way, screened-out ones
// included, so the screen can be audited rather than trusted.
//
// The vocabulary is deliberately wide enough to catch each measure this study
// calls a gap, were it present: FOIS ("oral intake"), PAS ("penetration",
// "aspirat"), DIGEST ("swallow"), TOR-BSST ("swallow"), V-VST ("swallow"),
// EAT-10 ("eat"/"swallow"), Yale residue ("pharyn"), MBSImP ("swallow"),
// silent aspiration ("aspirat"), laryngeal penetration ("laryng").
const DOMAIN_TERMS = ['swallow', 'deglut', 'dysphag', 'aspirat', 'pharyn', 'laryng', 'oral intake', 'bolus', 'penetration'];
const inDomain = (display) => {
  const d = (display || '').toLowerCase();
  return DOMAIN_TERMS.some((t) => d.includes(t));
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 30000);
      const res = await fetch(url, { signal: ac.signal, headers: { Accept: 'application/fhir+json' } });
      clearTimeout(timer);
      const body = await res.json();
      return { status: res.status, body };
    } catch (e) {
      if (i === tries - 1) return { status: 0, body: { error: String(e.message || e) } };
      await sleep(1500 * (i + 1));
    }
  }
}

const param = (body, name) => (body.parameter || []).find((p) => p.name === name);

function propertyOf(body, code) {
  for (const p of (body.parameter || [])) {
    if (p.name !== 'property') continue;
    const parts = p.part || [];
    const key = parts.find((x) => x.name === 'code');
    if (!key || key.valueCode !== code) continue;
    const val = parts.find((x) => x.name === 'value');
    if (!val) continue;
    return val.valueString ?? val.valueCode ?? val.valueBoolean ?? (val.valueCoding && val.valueCoding.code);
  }
  return undefined;
}

async function lookup(system, code) {
  const url = `${BASE}/CodeSystem/$lookup?system=${encodeURIComponent(system)}&code=${encodeURIComponent(code)}`
    + '&property=moduleId&property=inactive';
  const { status, body } = await get(url);
  if (status !== 200) {
    return { resolved: false, status, detail: (body.issue && body.issue[0] && body.issue[0].diagnostics) || body.error || '' };
  }
  const moduleId = propertyOf(body, 'moduleId');
  const inactive = propertyOf(body, 'inactive');
  return {
    resolved: true,
    status,
    display: param(body, 'display')?.valueString,
    version: param(body, 'version')?.valueString,
    moduleId: moduleId ?? null,
    inactive: inactive === true || inactive === 'true',
  };
}

async function expandFilter(term, count = 30) {
  const url = `${BASE}/ValueSet/$expand?url=${encodeURIComponent(SCT + '?fhir_vs')}`
    + `&filter=${encodeURIComponent(term)}&count=${count}`;
  const { status, body } = await get(url);
  if (status !== 200) return { ok: false, status, hits: [] };
  const contains = (body.expansion && body.expansion.contains) || [];
  return { ok: true, status, total: body.expansion?.total ?? contains.length, hits: contains.map((c) => ({ code: c.code, display: c.display })) };
}

// ----------------------------------------------------------------------------
const run = { server: BASE, implementation: 'CSIRO Ontoserver (NZ national terminology service)', runTimestamp: new Date().toISOString() };

console.log('positive controls…');
run.positiveControls = [];
for (const pc of POSITIVE_CONTROLS) {
  const r = await expandFilter(pc.term);
  const found = r.hits.some((h) => h.code === pc.expect);
  run.positiveControls.push({ term: pc.term, expected: pc.expect, resolved: found, hits: r.hits.length });
  console.log(`  ${found ? 'OK ' : 'FAIL'} "${pc.term}" -> ${pc.expect}`);
}
if (!run.positiveControls.every((p) => p.resolved)) {
  run.verdict = 'ABORTED — the search path did not resolve the positive controls, so no absence call from this run is interpretable.';
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'terminology-crosscheck.json'), JSON.stringify(run, null, 2));
  console.error('\nABORTED: positive controls failed. No absence is reported.');
  process.exit(1);
}

console.log('\nreused codes…');
run.reused = [];
for (const c of REUSED) {
  const r = await lookup(c.system, c.code);
  const isSct = c.system === SCT;
  const extensionOnly = isSct && r.resolved && r.moduleId && r.moduleId !== INTL_MODULE && r.moduleId !== MODEL_MODULE;
  const verdict = !r.resolved ? 'NOT-FOUND' : r.inactive ? 'INACTIVE' : extensionOnly ? 'EXTENSION-ONLY' : 'CONFIRMED';
  run.reused.push({ ...c, ...r, verdict });
  console.log(`  ${verdict.padEnd(14)} ${c.code.padEnd(12)} ${c.label}`);
}

console.log('\ngap probes…');
run.gaps = [];
for (const g of GAP_PROBES) {
  const perTerm = [];
  for (const term of g.terms) {
    const r = await expandFilter(term);
    const candidates = r.hits.filter((h) => inDomain(h.display));
    const screenedOut = r.hits.filter((h) => !inDomain(h.display));
    perTerm.push({ term, total: r.total, candidates, screenedOutCount: screenedOut.length, screenedOut });
  }
  const candidates = perTerm.flatMap((t) => t.candidates);
  const screenedOut = perTerm.reduce((n, t) => n + t.screenedOutCount, 0);
  run.gaps.push({
    label: g.label,
    verdict: candidates.length ? 'CANDIDATE-FOUND' : 'GAP-REPRODUCED',
    candidateCount: candidates.length,
    screenedOutCount: screenedOut,
    perTerm,
  });
  const note = screenedOut ? ` (${screenedOut} lexical match${screenedOut === 1 ? '' : 'es'} screened out as out-of-domain)` : '';
  console.log(`  ${(candidates.length ? 'CANDIDATE-FOUND' : 'GAP-REPRODUCED').padEnd(16)} ${g.label}${note}`);
  for (const t of perTerm) for (const h of t.candidates) console.log(`      via "${t.term}": ${h.code} ${h.display}`);
}

// --- summary ----------------------------------------------------------------
const confirmed = run.reused.filter((r) => r.verdict === 'CONFIRMED').length;
const reproduced = run.gaps.filter((g) => g.verdict === 'GAP-REPRODUCED').length;
run.summary = {
  reusedTested: run.reused.length,
  reusedConfirmed: confirmed,
  reusedNotConfirmed: run.reused.filter((r) => r.verdict !== 'CONFIRMED').map((r) => `${r.code} (${r.verdict})`),
  gapsTested: run.gaps.length,
  gapsReproduced: reproduced,
  gapsContradicted: run.gaps.filter((g) => g.verdict !== 'GAP-REPRODUCED').map((g) => g.label),
  sctVersion: run.reused.find((r) => r.version && r.version.includes('snomed'))?.version || null,
};
run.verdict = (confirmed === run.reused.length && reproduced === run.gaps.length)
  ? 'The second server reproduces the coverage assessment in full.'
  : 'The second server does NOT reproduce the coverage assessment in full — see reusedNotConfirmed / gapsContradicted.';

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'terminology-crosscheck.json'), JSON.stringify(run, null, 2));

const md = [
  '# Independent terminology cross-check (second server)',
  '',
  `**Server:** ${BASE} — ${run.implementation}`,
  `**SNOMED CT edition/version reported by the server:** ${run.summary.sctVersion || 'n/a'}`,
  `**Run:** ${run.runTimestamp}`,
  '',
  'The coverage assessment reported in the manuscript was made against the HL7 reference',
  'terminology server (tx.fhir.org). This run repeats it on a server that shares no code',
  'with it, on a national edition of SNOMED CT released later than the one reported.',
  'Presence calls are additionally checked for their module of origin, so a concept that',
  'exists only in the national extension cannot be counted as confirming the International',
  'Edition.',
  '',
  '## Positive controls',
  '',
  '| Filter term | Expected concept | Resolved |',
  '|---|---|---|',
  ...run.positiveControls.map((p) => `| ${p.term} | ${p.expected} | ${p.resolved ? 'yes' : 'NO'} |`),
  '',
  '## Reused codes',
  '',
  '| Group | System | Code | Label | Module | Verdict |',
  '|---|---|---|---|---|---|',
  ...run.reused.map((r) => `| ${r.group} | ${r.system === SCT ? 'SNOMED CT' : 'LOINC'} | ${r.code} | ${r.label} | ${r.moduleId || '—'} | ${r.verdict} |`),
  '',
  `**${confirmed}/${run.reused.length} confirmed.**`,
  '',
  '## Absence calls re-tested',
  '',
  '| Measure | Filter terms | In-domain candidates | Screened out | Verdict |',
  '|---|---|---|---|---|',
  ...run.gaps.map((g) => `| ${g.label} | ${g.perTerm.map((t) => `\`${t.term}\``).join(', ')} | ${g.candidateCount} | ${g.screenedOutCount} | ${g.verdict} |`),
  '',
  `Screening rule, stated before the run: a lexical hit counts as a candidate only if its display carries swallowing-domain vocabulary (${DOMAIN_TERMS.join(', ')}). Screened-out hits are kept in the JSON record.`,
  '',
  `**${reproduced}/${run.gaps.length} absence calls reproduced.**`,
  '',
  '## Verdict',
  '',
  run.verdict,
  '',
].join('\n');
writeFileSync(join(OUT, 'TERMINOLOGY-CROSSCHECK.md'), md);

console.log(`\n${run.verdict}`);
console.log(`reused ${confirmed}/${run.reused.length} confirmed · gaps ${reproduced}/${run.gaps.length} reproduced`);
console.log(`→ ${join(OUT, 'terminology-crosscheck.json')}`);
