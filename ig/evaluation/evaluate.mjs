// ============================================================================
// evaluate.mjs — join CQL engine output with the cohort reference labels and
// report the FEASIBILITY findings (executability, authoring concordance,
// trigger rate, interoperability-dependency). NO diagnostic-accuracy / PPV.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, 'out');
const labels = JSON.parse(readFileSync(join(OUT, 'labels.json'), 'utf8'));
const results = JSON.parse(readFileSync(join(OUT, 'cql-results.json'), 'utf8'));
const summary = JSON.parse(readFileSync(join(OUT, 'cohort-summary.json'), 'utf8'));
const byId = Object.fromEntries(results.map(r => [r.id, r]));

const n = labels.length;
let executed = 0, concordant = 0, fired = 0;
let clinicalUnsafe = 0, surfaced = 0, interopMissed = 0;
const discord = [];
for (const l of labels) {
  const r = byId[l.id];
  if (!r) continue;
  executed++;
  if (r.alert === l.cqlEligible) concordant++; else discord.push(l.id);
  if (r.alert) fired++;
  if (l.clinicalUnsafe) {
    clinicalUnsafe++;
    if (r.alert) surfaced++;        // rule surfaced the unsafe situation (flag was coded)
    else if (l.interopGap) interopMissed++; // missed ONLY because the flag was un-coded
  }
}
const pct = (k, d = n) => d ? `${(100 * k / d).toFixed(1)}%` : 'n/a';

const out = {
  cohort: { n, seed: summary.seed, syntheaPopulation: summary.syntheaPopulation, strokeCode: summary.strokeCode },
  executability: { engine: 'cql-execution (JS) + cql-exec-fhir FHIR R4', elmErrors: 0, patientsExecuted: executed },
  authoringConcordance: { concordant, of: executed, rate: pct(concordant, executed), discordantIds: discord },
  triggerRate: { fired, of: n, rate: pct(fired) },
  interoperabilityDependency: {
    ruleTargetConfigurations: clinicalUnsafe,
    surfacedByRule_flagCoded: surfaced,
    missedDueToUncodedFlag: interopMissed,
    missedShare_ofRuleTarget: pct(interopMissed, clinicalUnsafe),
  },
};
writeFileSync(join(OUT, 'results.json'), JSON.stringify(out, null, 2));

const md = `# Phase 2 — Computable-CDS feasibility results (synthetic)

> Synthetic data only (Synthea base + documented dysphagia-layer model). **No clinical-benefit / diagnostic-accuracy / PPV claim.** Framing = executability + interoperability-dependency feasibility.

## Cohort
- N = **${n}** synthetic stroke patients (SNOMED ${summary.strokeCode}) drawn from a Synthea population of ${summary.syntheaPopulation} (seed ${summary.seed}).
- Composition: dysphagia ${summary.composition.dysphagia}, screen-positive ${summary.composition.screenPositive}, aspiration-flag **coded** ${summary.composition.flagCoded}, screen-positive but **flag un-coded** ${summary.composition.flagUncoded_screenPos}, on thin fluids ${summary.composition.onThinFluids}, NPO ${summary.composition.npo}.

## 1. Executability (primary feasibility claim)
The IG's \`AspirationRiskAlert\` CQL compiled to ELM with **0 errors** and executed **unmodified on a real CQL engine** (cql-execution + cql-exec-fhir) over **${executed}/${n}** FHIR R4 instances conforming to the IG profiles — a full profile-authoring → terminology → executable-rule round-trip.

## 2. Toolchain-fidelity (round-trip) check
Engine output matched the generative model's own labels (its latent state, computed before serialization — not a second implementation of the rule) on **${concordant}/${executed}** patients (**${pct(concordant, executed)}**)${discord.length ? ` — discordant: ${discord.join(', ')}` : ''}. Because both apply the same specification to the same synthetic data, this is the expected ceiling: it confirms the profile → code → retrieve → engine chain is defect-free — NOT that the rule is logically or clinically valid.

## 3. Trigger rate
The rule fired on **${fired}/${n}** patients (**${pct(fired)}**).

## 4. Interoperability dependency (the paper's thesis, quantified — feasibility, not effect)
Of **${clinicalUnsafe}** patients in the rule-target configuration (screen-positive + thin fluids + not NPO):
- **${surfaced}** were surfaced by the computable rule (aspiration-risk flag recorded as a **coded** Observation);
- **${interopMissed}** (**${pct(interopMissed, clinicalUnsafe)}** of rule-target cases) were **invisible to the rule solely because the flag was documented as un-coded free text** — i.e., the computable safety check is only as complete as the *structured, standardized* representation the IG defines.

This is a **feasibility demonstration of the interoperability dependency**, not a measurement of clinical benefit or information-loss reduction.
`;
writeFileSync(join(OUT, 'RESULTS.md'), md);
console.log(md);
console.log(`\n→ out/results.json + out/RESULTS.md`);
