# Phase 2 — Computable-CDS feasibility harness (synthetic)

Executable-CQL feasibility evaluation for the Stroke-Dysphagia Care-Transition IG.
**Synthetic data only. No clinical-benefit, diagnostic-accuracy, or PPV claim.**

## What this shows (and what it deliberately does NOT)
- ✅ **Executability / round-trip:** the IG's `AspirationRiskAlert` CQL compiles to ELM and runs, unmodified, on a real CQL engine over FHIR R4 instances that conform to the IG profiles.
- ✅ **Authoring concordance:** the engine reproduces the intended boolean logic exactly (a correctness check on the profile→code→retrieve→rule chain).
- ✅ **Interoperability dependency (the paper's thesis, quantified as feasibility):** when the aspiration-risk flag is documented as un-coded free text instead of a coded Observation, the computable rule cannot see it — the safety check is only as complete as the standardized representation the IG defines.
- ❌ **NOT** a diagnostic-accuracy / sensitivity / PPV result. Ground truth here is *whether a data element is present/coded*, not a clinical gold standard — computing a "PPV" on rule-derived synthetic data would be circular and is intentionally avoided.

## Pipeline
```
Synthea (Docker)                 → synthetic stroke base population (CSV)
  └─ generate-cohort.mjs         → dysphagia layer → FHIR bundles + reference labels
cql-translation-service (Docker) → CQL → ELM
  └─ compile-cql.mjs             → elm/*.json
  └─ run-cql.mjs                 → cql-execution over bundles → per-patient rule results
  └─ evaluate.mjs                → out/RESULTS.md + results.json
```

## What is deposited, and what is not

| Path | In the archive? | Why |
|---|---|---|
| `cohort/` (333 bundles, 0.7 MB) | **yes** | the evaluation input. Every reported result is reproducible from it. |
| `synthea-out/metadata/` (519 B) | **yes** | the generator run record: build, seeds, parameters (below). |
| `out/` | **yes** | reported results. |
| `synthea-out/csv/`, `synthea-out/fhir/` (232 MB) | no | the raw Synthea export. Only `generate-cohort.mjs` reads it. |
| `.tools/synthea-with-dependencies.jar` (197 MB) | no | third-party binary; identified by build below. |
| `elm/` | no | build product of `compile-cql.mjs`. |

Because the cohort is deposited and everything downstream of it (`compile-cql`,
`run-cql`, `mutation-test`, `evaluate`) reads `cohort/` rather than the Synthea
export, **steps 1–2 below can be skipped** when re-running the evaluation. They
are documented for anyone rebuilding the cohort from scratch.

`sensitivity.mjs` is the one exception: it re-seeds the dysphagia overlay onto
the Synthea demographic spine, so it reads `synthea-out/csv/` and does require
step 1.

### Generator provenance (the run that produced the deposited cohort)

| Field | Value |
|---|---|
| Synthea build | `2b0a55b` (jar manifest `Build-Version`; built 2026-06-30, Gradle 9.2.1, JDK 17.0.19) |
| Run ID | `26c9ee22-3d42-4bf4-aebc-a37ea4f33e77` |
| Population seed | `20260716` |
| Clinician seed | `1784199237551` — time-derived at run time, **not** preset; recorded in `synthea-out/metadata/` and pinned in the command below so a re-run reproduces it |
| Reference / end time | `20260716` |
| Population / age / state | 25,000 · 55–95 · Massachusetts |
| Years of history | 10 |
| Java | 17.0.19 |

## Reproduce
```bash
# 0. deps
npm install

# 1. synthetic base population (stroke-enriched; CSV only)
#    SKIP unless you are rebuilding the cohort or running sensitivity.mjs —
#    cohort/ is deposited. Synthea build 2b0a55b; -cs/-r/-e pin the values the
#    original run derived from the clock (see the provenance table above).
docker run --rm -v "$PWD:/work" -w /work eclipse-temurin:17-jdk \
  java -Xmx5g -jar .tools/synthea-with-dependencies.jar \
  -s 20260716 -cs 1784199237551 -r 20260716 -e 20260716 \
  -p 25000 -a 55-95 \
  --exporter.baseDirectory /work/synthea-out \
  --exporter.fhir.export false --exporter.csv.export true \
  --exporter.csv.included_files "patients.csv,conditions.csv" \
  --generate.only_alive_patients true Massachusetts

# 2. build the evaluation cohort (deterministic, seeded) — SKIP, see above
node generate-cohort.mjs

# 3. compile the CQL (translation service must be running)
docker run -d --name cql-xlate -p 8083:8080 cqframework/cql-translation-service:latest
node compile-cql.mjs

# 4. execute + evaluate
node run-cql.mjs
node evaluate.mjs        # → out/RESULTS.md
```

## The generative model (`src/model.mjs`)
Each Synthea stroke patient (demographic spine) is given a dysphagia layer by a
**documented, seeded** model. Parameters are **illustrative, literature-anchored
plausible values — NOT empirical estimates.**

| Parameter | Value | Anchor |
|---|---|---|
| P(dysphagia \| stroke) | 0.50 | Martino 2005 syst. review (dysphagia ~37-45% clinical, up to 64-78% instrumental) |
| P(screen-positive \| dysphagia) | 0.70 | GUSS / bedside-screen literature (Trapl 2007) |
| P(screen-positive \| no dysphagia) | 0.05 | low false-positive base rate |
| **P(flag recorded as CODED \| screen-positive)** | **0.70** | interoperability variable; clinical anchor: ~45% of discharge summaries omit dysphagia recommendations in transferable form |
| Diet \| screen-positive | NPO .20 / thickened .45 / **thin .35** | care-plan adherence; thin = the under-treatment safety gap |
| Diet \| screen-negative | NPO .02 / thickened .08 / thin .90 | mostly unmodified fluids |

Verified codes (SNOMED CT Intl 20250201, re-checked against a later release with no
change to the classification): GUSS `1289999007`,
VFSS `241149003`, at-risk-for-aspiration `371736008`, IDDSI thin `1231508001` (+ L1-L3).

### Reference labels (NOT a diagnostic gold standard)
- `clinicalUnsafe` — screen-positive + thin fluids + not NPO (situation that should surface at transition, coded or not).
- `cqlEligible` — what a correctly-authored rule *can* fire on (needs the **coded** flag); compared against engine output → concordance.
- `interopGap` — `clinicalUnsafe` cases missed *only* because the flag was un-coded → the interoperability cost.

## Honesty caveats (for the paper's Limitations)
- Synthetic data; parameters are plausible, not measured. Results characterize the *tooling/representation*, not clinical performance.
- `cql-execution` + `cql-exec-fhir` are one engine family; broader engine independence (e.g., Firely/.NET) is future work, as is the multi-server *validation* being HL7-Java-core.
- The interoperability-dependency finding is a **feasibility demonstration**, not evidence that standardization reduces real information loss or aspiration events.
