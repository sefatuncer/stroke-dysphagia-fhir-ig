# Stroke–Dysphagia Care-Transition FHIR Implementation Guide

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21629526.svg)](https://doi.org/10.5281/zenodo.21629526)

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
  evaluation/               Synthea → cohort → CQL→ELM → execution pipeline (+ reported results in out/)
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

# 3. Conformance on two independent servers (reference validator + HAPI FHIR)
#    plus negative ("should-fail") fixtures — see ig/conformance/README.md

# 4. Decision-support feasibility evaluation (synthetic data only)
cd ig/evaluation && npm ci && node generate-cohort.mjs && node compile-cql.mjs && node run-cql.mjs
#    Reported metrics are in ig/evaluation/out/RESULTS.md and SENSITIVITY.md
```

## Terminology notice

This IG **references** SNOMED CT, LOINC, and IDDSI codes; it does **not** redistribute their code
systems. SNOMED CT content is licensed by SNOMED International (affiliate/member terms apply);
LOINC is used under the LOINC license; the IDDSI framework is © The IDDSI Committee (CC BY-SA,
used unmodified). Users are responsible for their own terminology licensing.

## License

Source code and the IG artifacts authored here are released under the **MIT License** (see
[`LICENSE`](LICENSE)). This does not extend to third-party terminologies referenced above.

## Citation

If you use this work, please cite the archived release:

> Kapan Tunçer N, Tunçer S. Stroke–Dysphagia Care-Transition FHIR Implementation Guide (v1.0.1). Zenodo; 2026. DOI: 10.5281/zenodo.21629526.

The DOI above is the *concept* DOI: it always resolves to the latest archived version.

**Authors:**
Nazife Kapan Tunçer (ORCID 0000-0002-8161-5669). Department of Physical Medicine and Rehabilitation, Faculty of Medicine, Kırşehir Ahi Evran University, Kırşehir, Türkiye.
Sefa Tunçer (ORCID 0000-0001-6672-3605). Independent Researcher, Ankara, Türkiye.
