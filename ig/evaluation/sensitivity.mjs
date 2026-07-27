// ============================================================================
// sensitivity.mjs — Z1 revision: show that the "interoperability-gap" rate is,
// by construction, the complement of the coding-completeness parameter, and
// quantify sampling uncertainty (multi-seed) + a 95% CI on the primary run.
//
// This DEMONSTRATES THE MECHANISM (invisibility tracks 1 - P(coded)); it is not
// an empirical measurement. Synthetic data only. No fabricated numbers — the
// tables below are produced by running the same generative model used in the paper.
// ============================================================================
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readBasePatients } from './src/base.mjs';
import { generatePatient, makeRng, PARAMS } from './src/model.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const CSV_DIR = join(__dir, 'synthea-out', 'csv');
const OUT = join(__dir, 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const base = readBasePatients(CSV_DIR);
const N = base.length;
const PRIMARY_SEED = 20260716;

function runCohort(pFlagCoded, seed) {
  const params = { ...PARAMS, pFlagCoded };
  const rng = makeRng(seed);
  let unsafe = 0, gap = 0, eligible = 0, coded = 0, screenPos = 0;
  for (const b of base) {
    const { label } = generatePatient(b, rng, params);
    if (label.screenPos) screenPos++;
    if (label.flagCoded) coded++;
    if (label.clinicalUnsafe) unsafe++;
    if (label.interopGap) gap++;
    if (label.cqlEligible) eligible++;
  }
  return { unsafe, gap, eligible, invis: unsafe ? gap / unsafe : NaN, trigger: eligible / N };
}

const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
const sd = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };

// Wilson score interval for a binomial proportion (k/n), 95% (z=1.96).
function wilson(k, n, z = 1.96) {
  if (n === 0) return [NaN, NaN];
  const p = k / n, z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (z / denom) * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n));
  return [Math.max(0, centre - half), Math.min(1, centre + half)];
}

// --- Multi-seed sweep over coding-completeness ------------------------------
const SEEDS = Array.from({ length: 40 }, (_, i) => PRIMARY_SEED + i);
const PS = [0.50, 0.60, 0.70, 0.80, 0.90];
const sweep = PS.map(p => {
  const runs = SEEDS.map(s => runCohort(p, s));
  const invis = runs.map(r => r.invis);
  const unsafe = runs.map(r => r.unsafe);
  const trig = runs.map(r => r.trigger);
  return {
    pFlagCoded: p,
    expectedInvis: 1 - p,
    meanInvis: mean(invis), sdInvis: sd(invis),
    minInvis: Math.min(...invis), maxInvis: Math.max(...invis),
    meanUnsafe: mean(unsafe), meanTrigger: mean(trig),
  };
});

// --- Primary run (paper's headline config) ----------------------------------
const primary = runCohort(0.70, PRIMARY_SEED);
const [lo, hi] = wilson(primary.gap, primary.unsafe);

const pct = x => (100 * x).toFixed(1);
const out = { N, seeds: SEEDS.length, primary: { seed: PRIMARY_SEED, ...primary, wilson95: [lo, hi] }, sweep };
writeFileSync(join(OUT, 'sensitivity.json'), JSON.stringify(out, null, 2));

// --- Human-readable report --------------------------------------------------
let md = `# Sensitivity analysis — interoperability-gap vs coding-completeness (synthetic)\n\n`;
md += `Cohort N = ${N} synthetic stroke patients. 40 seeds per parameter value. **The invisibility rate among clinically-unsafe cases tracks (1 − P(coded)) by construction; this demonstrates the mechanism, it is not an empirical estimate.**\n\n`;
md += `## Primary run (paper's headline; seed ${PRIMARY_SEED}, P(coded)=0.70)\n`;
md += `- clinically-unsafe cases: **${primary.unsafe}**; invisible (un-coded flag): **${primary.gap}**\n`;
md += `- invisibility rate = ${primary.gap}/${primary.unsafe} = **${pct(primary.invis)}%** (Wilson 95% CI **${pct(lo)}%–${pct(hi)}%**)\n`;
md += `- expected by design: 1 − 0.70 = 30.0%\n\n`;
md += `## Sweep over coding-completeness P(coded) — 40 seeds each\n\n`;
md += `| P(coded) | expected 1−P | mean invisibility (±SD) | range | mean unsafe n | mean trigger |\n|---|---|---|---|---|---|\n`;
for (const r of sweep) {
  md += `| ${r.pFlagCoded.toFixed(2)} | ${pct(r.expectedInvis)}% | **${pct(r.meanInvis)}% (±${pct(r.sdInvis)})** | ${pct(r.minInvis)}–${pct(r.maxInvis)}% | ${r.meanUnsafe.toFixed(0)} | ${pct(r.meanTrigger)}% |\n`;
}
md += `\n**Interpretation:** invisibility rate ≈ (1 − P(coded)) across the whole range — the rule cannot see un-coded flags, so the yield of the computable safety check is a direct, monotone function of documentation-coding completeness. The single headline figure is one point on this line, not an independent measurement.\n`;
writeFileSync(join(OUT, 'SENSITIVITY.md'), md);
console.log(md);
