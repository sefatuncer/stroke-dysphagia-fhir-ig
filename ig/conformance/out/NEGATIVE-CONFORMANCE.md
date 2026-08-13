# Negative conformance results

Server: **HAPI FHIR Server 8.10.0** (FHIR 4.0.1) at `http://localhost:8080/fhir`

**10/10 negative fixtures correctly rejected** — PASS

| Fixture | Profile constraint under test | Worst severity | Signature matched | Correctly rejected |
|---|---|---|---|---|
| `neg-aspiration-preliminary.json` | status=preliminary — profile fixes status to final | error | yes | yes |
| `neg-aspiration-wrongcode.json` | code≠371736008 — profile fixes the at-risk-for-aspiration code | error | yes | yes |
| `neg-diet-drink-code-on-food.json` | drink-axis IDDSI concept on texture.modifier — violates invariant iddsi-axis-food | error | yes | yes |
| `neg-diet-food-code-on-fluid.json` | food-axis IDDSI concept on fluidConsistencyType — violates invariant iddsi-axis-fluid | error | yes | yes |
| `neg-instrumental-pas-out-of-range.json` | PAS component value 99 — violates invariant pas-range (scale is 1-8) | error | yes | yes |
| `neg-screening-noeffective.json` | effective[x] absent — profile requires effective[x] 1..1 | error | yes | yes |
| `neg-severity-nosubject.json` | subject absent — profile requires subject 1..1 (tightened from base 0..1) | error | yes | yes |
| `neg-summary-foreign-entry.json` | section.entry references a Condition — profile restricts entries to the IG profiles | error | yes | yes |
| `neg-summary-no-entry.json` | sections carry narrative but no section.entry — violates invariant dct-has-content (empty envelope) | error | yes | yes |
| `neg-summary-wrong-type.json` | wrong Composition.type code — profile fixes type to LOINC 34133-9 | error | yes | yes |

A fixture counts as correctly rejected only when the server errors, the error carries the
signature of the constraint under test, and the error is not merely an unresolvable-profile
complaint. This prevents a profile-resolution failure from being miscounted as a rejection.
