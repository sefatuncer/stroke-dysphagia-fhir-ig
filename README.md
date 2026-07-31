# Stroke–Dysphagia Care-Transition FHIR Implementation Guide

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21629526.svg)](https://doi.org/10.5281/zenodo.21629526)

**Published IG:** <https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/>

An open, standards-aligned **HL7 FHIR R4 Implementation Guide (IG)** that makes stroke–dysphagia
care-transition data computable across the acute → inpatient-rehabilitation → home/tele-rehabilitation
journey, together with a **structured terminology-gap analysis** and an **executable decision-support
feasibility evaluation** (Clinical Quality Language, run on a real engine over a synthetic cohort).

This repository is the reference artifact accompanying the manuscript
*"Making Stroke–Dysphagia Care-Transition Data Computable: A FHIR Implementation Guide with a
Structured Terminology Gap Analysis and Decision-Support Feasibility Evaluation."*

> **Scope and claims.** All data are **synthetic** (generated with Synthea) or drawn from the
> published literature. **No human or animal subjects, no patient data, and no clinical-benefit or
> diagnostic claim** are involved. The evaluation demonstrates *interoperability and computability
> feasibility*, not clinical validity.

## What the IG contributes

- Six FHIR R4 profiles: `SwallowingScreeningResult`, `InstrumentalSwallowAssessment`,
  `DysphagiaSeverity`, `AspirationRiskFlag` (all Observation), `DysphagiaNutritionOrder`
  (NutritionOrder, with an axis-separated **IDDSI** binding base FHIR leaves at *example* strength),
  and `DysphagiaCareTransitionSummary` (Composition).
- Six ValueSets (including two IDDSI axes: **fluid/drink 0–4** and **food 4–7**) and a small local
  CodeSystem for instruments that currently lack terminology (PAS, FOIS, DIGEST, EAT-10, ...).
- Alignment (not structural derivation) to **IPS 2.0.1** and **PACIO PFE 2.0.0**.
- An `AspirationRiskAlert` **CQL** rule and a fully containerized, seeded evaluation pipeline.

## Repository layout

```
ig/
  sushi-config.yaml         IG configuration (id, canonical, dependencies)
  ig.ini, Dockerfile.igbuild
  input/
    fsh/dysphagia-ct.fsh    FHIR Shorthand: profiles, value sets, code system, examples
    cql/AspirationRiskAlert.cql
    pagecontent/index.md
  conformance/              Independent-server conformance harness + negative fixtures
    negative-fixtures/      Eight should-fail instances, one per constraint under test
    out/                    Deposited conformance evidence (positive + negative, .json/.md)
  evaluation/               Synthea → cohort → CQL→ELM → execution pipeline
    cohort/                 The 333 deposited evaluation bundles every reported result reads
    synthea-out/metadata/   Generator run record: build, seeds, generation parameters
    mutation-test.mjs       Two-way rule-mutation control (suppressing and alarm-raising)
    out/                    Reported results, sensitivity sweep, mutation control
submission/
  supplement/               Supplementary files S2-S6 (checklist, terminology log, search log,
                            negative-fixture signatures, terminology license inventory)
figures/                    Editable draw.io sources + exported PNGs (≥300 dpi)
```

Build outputs (`ig/output`, `ig/temp`, `ig/fsh-generated`, `ig/input-cache`, `ig/template`),
package caches, downloaded JARs, and `node_modules` are intentionally **not** committed; they are
reproduced by the toolchain below.

## Reproduce

Everything runs on CPU in Docker/Node; no proprietary services are required.

```bash
# 1. Author → validate the FSH (SUSHI)
cd ig && sushi .

# 2. Build the IG (HL7 IG Publisher, containerized) — see ig/Dockerfile.igbuild and ig/README.md
#    Result: 0 errors; terminology validated against tx.fhir.org.

# 3. Conformance: the eight positive examples on both deployments (the reference
#    validator, which runs inside step 2, and a separately deployed HAPI FHIR
#    server); the eight negative ("should-fail") fixtures on the HAPI server
#    — see ig/conformance/README.md

# 4. Decision-support feasibility evaluation (synthetic data only)
#    The 333-bundle cohort is deposited, and every step below reads it rather than
#    the Synthea export, so this is the whole reproduction path:
cd ig/evaluation && npm ci && node compile-cql.mjs && node run-cql.mjs
node evaluate.mjs && node mutation-test.mjs
#    Reported metrics are in ig/evaluation/out/: RESULTS.md, MUTATION-TEST.md
#
#    generate-cohort.mjs and sensitivity.mjs are the two exceptions: they read the
#    232 MB Synthea export, which is not deposited (see ig/evaluation/README.md for
#    the command that rebuilds it). Note that generate-cohort.mjs CLEARS cohort/ and
#    out/ before writing, so run it only when rebuilding the cohort from scratch.
```

## Terminology notice

This IG carries SNOMED CT, LOINC, and IDDSI concept identifiers — and, for a few concepts, an
unmodified English display term. It does **not** redistribute any code system: no SNOMED CT
release, national extension, or semantic content (relationships, hierarchies, reference sets).
The identifiers and English terms carried here fall within SNOMED International's
[Global Patient Set](https://www.snomed.org/gps), published at no cost under CC BY-ND 4.0, which
does not require SNOMED CT membership or an Affiliate License. Anyone loading SNOMED CT itself
into a terminology server to expand these value sets needs their own Affiliate/member license for
their territory. LOINC is used under the LOINC license; the IDDSI framework is © The IDDSI
Committee (CC BY-SA, used unmodified). See [`LICENSE`](LICENSE) for the full notice.

## License

Source code and the IG artifacts authored here are released under the **MIT License** (see
[`LICENSE`](LICENSE)). This does not extend to third-party terminologies referenced above.

## Citation

If you use this work, please cite the archived release:

> Kapan Tunçer N, Tunçer S. Stroke–Dysphagia Care-Transition FHIR Implementation Guide (v1.1.2). Zenodo; 2026. DOI: 10.5281/zenodo.21629526.

The DOI above is the *concept* DOI: it always resolves to the latest archived version.

**Release 1.1.2** leaves every IG artifact byte-identical to 1.1.1 — the profiles, value sets,
invariants and examples the reported conformance and evaluation runs were made against are
unchanged. It adds what those runs consume and produce: the 333-bundle evaluation cohort, the
Synthea run record, the reference validator's QA output, and supplementary files S5 and S6.

**Authors:**
Nazife Kapan Tunçer (ORCID 0000-0002-8161-5669). Department of Physical Medicine and Rehabilitation, Faculty of Medicine, Kırşehir Ahi Evran University, Kırşehir, Türkiye.
Sefa Tunçer (ORCID 0000-0001-6672-3605). Independent Researcher, Ankara, Türkiye.
