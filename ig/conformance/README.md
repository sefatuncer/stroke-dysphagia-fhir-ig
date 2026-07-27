# Conformance — cross-implementation validation (not self-validation)

**Claim for the paper:** the IG's synthetic examples validate against **≥2 independent
FHIR server implementations**' `$validate` operation — not only the reference validator /
IG Publisher we author against.

| # | Server | Implementation | How |
|---|--------|----------------|-----|
| 0 | FHIR reference validator (`validator_cli.jar`) | HL7 (Java) | done during build — 0 errors |
| 1 | **HAPI FHIR** (local Docker) | HAPI / Smile CDR OSS (Java) | `docker-compose.hapi.yml` |
| 2 | **Firely Server** (public `server.fire.ly`) or a 2nd local server | Firely (.NET) — *different vendor* | point the script at its base URL |

Servers 1 and 2 are **different codebases/vendors**, so passing both is genuine
cross-implementation conformance.

## Run

```bash
# 1) start HAPI (server #1)
docker compose -f docker-compose.hapi.yml up -d
#    wait until http://localhost:8080/fhir/metadata answers

# 2) validate every synthetic example against its profile on HAPI (8/8 must PASS)
node validate-on-server.mjs http://localhost:8080/fhir

# 2b) NEGATIVE test — prove the profiles CONSTRAIN, not merely accept:
#     4 should-fail fixtures (negative-fixtures/) must ALL be rejected with an error.
node validate-negatives.mjs http://localhost:8080/fhir

# 3) repeat against an independent 2nd server (Firely, different vendor)
node validate-on-server.mjs https://server.fire.ly

# teardown
docker compose -f docker-compose.hapi.yml down
```

The script uploads the IG's CodeSystem/ValueSet/StructureDefinition resources from
`../fsh-generated/resources`, then POSTs each example to `[type]/$validate?profile=…`
and reports the worst issue severity. Exit code 0 = all examples conform.

## Notes / honesty
- Examples are **fully synthetic** (no patient data) — safe to POST to public test servers.
- Server terminology support varies (SNOMED/LOINC): a server without a SNOMED license may
  emit terminology *warnings*; the conformance claim is about **structural + binding**
  validity (error-level), consistent with the reference-validator result.
- This is **feasibility/interoperability** evidence, **not** a clinical-benefit claim.
