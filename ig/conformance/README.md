# Conformance — cross-implementation validation (not self-validation)

**Claim for the paper:** both suites — the eight synthetic examples and the ten negative
fixtures — run on **three deployments outside the authoring build**: the HL7 reference
validator invoked standalone against the built package, a separately deployed HAPI FHIR server,
and Firely Terminal on the Firely .NET SDK. Six machine-readable records are deposited. The
first two share the HL7 Java validation core; the third shares no code with it, so agreement
across them is independence across implementations, not only portability across deployments.

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
#     10 should-fail fixtures (negative-fixtures/) must ALL be rejected, and each
#     rejection must carry the signature of the constraint under test (not merely
#     "some error"), covering all six profiles and every constraint Table 1 names.
node validate-negatives.mjs http://localhost:8080/fhir

# 2c) the same two suites on the second deployment: the HL7 reference validator
#     invoked standalone against the built package (requires ig/output/package.tgz).
node validate-positives-cli.mjs
node validate-negatives-cli.mjs

# 2d) the same two suites on a THIRD deployment that shares no code with the Java
#     core: Firely Terminal on the Firely .NET SDK, in a digest-pinned container.
#     This is what turns portability across deployments into independence across
#     implementations.
node validate-with-firely.mjs

# The four scripts deposit machine-readable evidence under conformance/out/
# (positive-/negative-conformance.json for HAPI, positive-/negative-conformance-cli.json
# for the reference validator, each with a .md summary).
#
# The reference validator leaves its own record there too: ig-publisher-qa.txt
# and ig-publisher-qa.json are the IG Publisher's validation summary for the
# reported build. That run happens inside the authoring toolchain, so it is
# deposited for audit, not counted as one of the two deployments above.

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
- The Firely step runs in a digest-pinned container with the tool version pinned, but it
  fetches that tool from nuget.org at run time rather than from an image we publish, so it
  needs network access — the same shape of dependency as the reference validator's jar in
  `input-cache/`. The pin fixes *what* runs, not where it is fetched from.
- Agreement between the two implementations shows they read the profiles the same way. It
  does not show the profiles say what we meant them to say; that limit is the co-design one
  the manuscript records separately.
