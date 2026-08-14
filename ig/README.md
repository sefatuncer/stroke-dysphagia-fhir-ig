# Dysphagia Care-Transition IG — source & build

FHIR R4 Implementation Guide source for the stroke–dysphagia care-transition artifact.
See the [repository README](../README.md) for scope, contribution summary, and the
synthetic-data-only / no-clinical-claim statement.

Codes are validated against SNOMED CT International 20250201, LOINC, and the HL7 reference
terminology server (tx.fhir.org).

## Contents
- `sushi-config.yaml` — IG configuration. Canonical: `https://sefatuncer.github.io/stroke-dysphagia-fhir-ig`.
  Dependencies: **IPS 2.0.1** and **PACIO PFE 2.0.0** (declared as alignment references).
- `input/fsh/dysphagia-ct.fsh` — all definitions:
  - `DysphagiaScalesTemp` (temporary local codes for instruments lacking terminology; upstream submission pending)
  - Two axis-separated IDDSI value sets: **`IDDSIFluidLevels`** (drink axis, 0–4) and
    **`IDDSIFoodLevels`** (food axis, 4–7), plus four assessment value sets
  - Observation profiles: `SwallowingScreeningResult`, `InstrumentalSwallowAssessment`,
    `DysphagiaSeverity`, `AspirationRiskFlag`
  - `DysphagiaNutritionOrder` (extensible IDDSI binding base FHIR leaves at *example* strength)
  - `DysphagiaCareTransitionSummary` (Composition)
  - Eight synthetic examples
- `input/cql/AspirationRiskAlert.cql` — decision-support rule
- `conformance/` — independent-server conformance harness + negative fixtures (see its README)
- `evaluation/` — Synthea → cohort → CQL feasibility pipeline (see its README)

## Build
Everything runs on CPU. The host needs Node.js (for SUSHI); the IG Publisher runs in Docker
(no host Java required).

```bash
# 1) SUSHI: FSH -> FHIR resources (run from the repo root)
sushi ig            # expect: 0 errors, 0 warnings

# 2) IG Publisher (containerized). See Dockerfile.igbuild; the FHIR package cache is a
#    named Docker volume (fhir-cache) so terminology downloads are cached across runs.
#    Result: 0 errors; terminology validated against tx.fhir.org.
```

> Build note: the containerized IG Publisher writes `fsh-generated/` as root. Before a host
> `sushi` run, clear it first:
> `docker run --rm -v "$PWD/ig:/ig" alpine rm -rf /ig/fsh-generated`.

## Status
Validated: SUSHI 0/0; IG Publisher 0 errors. Both suites — the eight positive examples and the
ten negative fixtures — ran on three deployments outside the build: the HL7 reference validator
(`validator_cli.jar`, run standalone against `output/package.tgz`), a separately deployed HAPI
FHIR server, and Firely Terminal on the Firely .NET SDK, which shares no code with the Java
core. All six machine-readable records are in `conformance/out/`. Build outputs (`output/`, `temp/`, `fsh-generated/`,
`input-cache/`, `template/`) are regenerated and not committed.
