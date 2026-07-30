# Conformance — cross-implementation validation (not self-validation)

**Claim for the paper:** the IG's eight synthetic examples validate on **two independently
deployed servers** — not only the reference validator / IG Publisher we author against. The
eight negative fixtures were run on the separately deployed HAPI server. Both servers share
the HL7 Java validation core, so this is portability across deployments, not independence
across implementations (see below).

| # | Server | Implementation | Status |
|---|--------|----------------|--------|
| 0 | FHIR reference validator (`validator_cli.jar`) | HL7 (Java) | **used** — runs during the IG build, 0 errors |
| 1 | **HAPI FHIR** (local Docker, digest-pinned = 8.10.0) | HAPI / Smile CDR OSS (Java) | **used** — `docker-compose.hapi.yml` |
| 2 | Firely Server (.NET, different vendor) | Firely | **not used — future work** |

**What this establishes, and what it does not.** Servers 0 and 1 are two *independently
deployed* servers, and passing both shows the artifacts are portable across deployments and
are not merely self-validating against the toolchain that produced them. However, both are
built on the **HL7 Java validation core**, so this is *not* independence across
implementations: a misreading shared by that core would pass on both. Validation against a
genuinely different implementation (Firely/.NET) remains future work and is reported as a
limitation in the manuscript.

## Run

```bash
# 1) start HAPI (server #1)
docker compose -f docker-compose.hapi.yml up -d
#    wait until http://localhost:8080/fhir/metadata answers

# 2) validate every synthetic example against its profile on HAPI (8/8 must PASS)
node validate-on-server.mjs http://localhost:8080/fhir

# 2b) NEGATIVE test — prove the profiles CONSTRAIN, not merely accept:
#     8 should-fail fixtures (negative-fixtures/) must ALL be rejected, and each
#     rejection must carry the signature of the constraint under test (not merely
#     "some error"), covering all six profiles.
node validate-negatives.mjs http://localhost:8080/fhir

# Both scripts deposit machine-readable evidence under conformance/out/
# (positive-conformance.json / negative-conformance.json + .md summaries).
#
# The reference validator leaves its own record there too: ig-publisher-qa.txt
# and ig-publisher-qa.json are the IG Publisher's validation summary for the
# reported build (0 errors, 22 warnings, IG 1.1.1). That run happens inside the
# authoring toolchain, so it is deposited for audit, not as independent evidence.

# 3) OPTIONAL, not part of the reported results: a genuinely independent
#    implementation (Firely/.NET). Reported as future work.
# node validate-on-server.mjs https://server.fire.ly

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
