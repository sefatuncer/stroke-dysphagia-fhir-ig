// ============================================================================
// summarize-cohort-warnings.mjs — A7: make the cohort's 2,731 warnings auditable.
//
// The validator's per-resource output for 333 bundles is ~4 MB of
// OperationOutcomes and is deliberately not deposited. Reporting only "0 errors,
// warnings only" leaves a reader unable to check what those warnings were, so
// this script reduces them to a category × count table that IS deposited, and
// writes it into cohort-conformance.{json,md}.
//
// Run after validate-cohort.mjs (it reads the raw output that run leaves behind).
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const RAW = join(OUT, 'cohort-validator-raw.json');

if (!existsSync(RAW)) {
  console.error('FAIL: cohort-validator-raw.json not found — run validate-cohort.mjs first.');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(RAW, 'utf8'));
const outcomes = raw.resourceType === 'Bundle' ? raw.entry.map((e) => e.resource) : [raw];

// Categories are matched on the validator's own wording. Anything unmatched is
// reported verbatim rather than swept into an "other" bucket, so a new warning
// class cannot hide inside this summary.
const RULES = [
  [/dom-6|should have a narrative|text.*SHOULD be present/i, 'dom-6: resource has no narrative (Bundle entries carry data, not display)'],
  [/performer/i, 'best practice: Observation should name a performer'],
  [/nor-1|nutrition ?order/i, 'nor-1: NutritionOrder best-practice constraint'],
  [/wrong display name/i, 'display name differs from the terminology server'],
  [/unable to (check|validate) code|terminology server/i, 'terminology check deferred'],
];

const counts = new Map();
let total = 0;
for (const oc of outcomes) {
  for (const i of oc.issue || []) {
    if (i.severity !== 'warning') continue;
    total++;
    const text = `${i.diagnostics || ''} ${i.details?.text || ''}`;
    const hit = RULES.find(([re]) => re.test(text));
    const key = hit ? hit[1] : `unclassified: ${text.trim().slice(0, 90)}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
}

const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.log(`${total} warnings across ${outcomes.length} bundles:`);
for (const [k, v] of rows) console.log(`  ${String(v).padStart(5)}  ${k}`);

// --- fold the breakdown into the deposited record ---------------------------
const jsonPath = join(OUT, 'cohort-conformance.json');
const summary = JSON.parse(readFileSync(jsonPath, 'utf8'));
summary.warningCategories = Object.fromEntries(rows);
writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

const mdPath = join(OUT, 'cohort-conformance.md');
let md = readFileSync(mdPath, 'utf8').replace(/\n## Warning categories[\s\S]*$/, '').trimEnd();
md += '\n\n## Warning categories\n\n';
md += 'No bundle produced an error. The warnings break down as follows; the raw per-resource\n';
md += 'output (~4 MB) is not deposited, so this table is the auditable record of what they were.\n\n';
md += '| Warnings | Category |\n|---:|---|\n';
for (const [k, v] of rows) md += `| ${v} | ${k} |\n`;
md += `| **${total}** | **total** |\n`;
writeFileSync(mdPath, md + '\n');
console.log('\n→ cohort-conformance.json (warningCategories) + cohort-conformance.md (table)');
