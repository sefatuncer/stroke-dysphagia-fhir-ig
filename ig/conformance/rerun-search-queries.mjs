// ============================================================================
// rerun-search-queries.mjs — A9: run the bibliographic queries the original
// artifact search left out, and record them machine-readably.
//
// Why. The novelty claim rests on finding no dysphagia-specific FHIR artifact,
// but the original search crossed swallowing terms with FHIR terms only — it
// never queried the vocabulary of the contribution the paper calls its strongest
// (the IDDSI diet/consistency binding). Two reviewers of the seven-reviewer round
// raised this independently. These queries close that gap; each is run against
// PubMed E-utilities so the counts and PMIDs are reproducible rather than
// browsed.
//
// Run:  node rerun-search-queries.mjs
// Out:  conformance/out/search-queries.json  (+ a table on stdout for S4)
// ============================================================================
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const QUERIES = [
  { id: 'Q1', q: 'IDDSI AND (FHIR OR HL7 OR interoperability)', why: 'the diet/consistency axis in its own vocabulary' },
  { id: 'Q2', q: '"texture-modified" AND (FHIR OR SNOMED)', why: 'texture-modified diets against terminology/standards' },
  { id: 'Q3', q: '("nutrition order" OR "diet order") AND FHIR', why: 'the FHIR resource this IG profiles' },
  { id: 'Q4', q: 'dysphagia AND SNOMED', why: 'dysphagia against SNOMED CT generally' },
  { id: 'Q5', q: 'dysphagia AND LOINC', why: 'dysphagia against LOINC generally' },
  { id: 'Q6', q: '(dysphagia OR swallowing) AND HL7', why: 'swallowing against HL7 without naming FHIR' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function esearch(term) {
  const url = `${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&retmax=25&term=${encodeURIComponent(term)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`esearch ${r.status}`);
  const j = await r.json();
  return { count: Number(j.esearchresult.count), ids: j.esearchresult.idlist || [], translation: j.esearchresult.querytranslation };
}

async function esummary(ids) {
  if (!ids.length) return [];
  const url = `${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`esummary ${r.status}`);
  const j = await r.json();
  return ids.map((id) => {
    const d = j.result?.[id] || {};
    return { pmid: id, title: d.title || '', journal: d.fulljournalname || d.source || '', year: (d.pubdate || '').slice(0, 4) };
  });
}

const accessed = new Date().toISOString().slice(0, 10);
const results = [];
for (const { id, q, why } of QUERIES) {
  const s = await esearch(q);
  const hits = await esummary(s.ids);
  results.push({ id, query: q, rationale: why, count: s.count, translation: s.translation, hits });
  console.log(`\n${id}  ${q}\n     hits: ${s.count}`);
  for (const h of hits.slice(0, 8)) console.log(`     · ${h.pmid} (${h.year}) ${h.title.slice(0, 95)}`);
  await sleep(400); // NCBI asks for <= 3 requests/second without a key
}

writeFileSync(
  join(OUT, 'search-queries.json'),
  JSON.stringify({ source: 'PubMed E-utilities', accessed, queries: results }, null, 2)
);
console.log(`\n→ conformance/out/search-queries.json (accessed ${accessed})`);
