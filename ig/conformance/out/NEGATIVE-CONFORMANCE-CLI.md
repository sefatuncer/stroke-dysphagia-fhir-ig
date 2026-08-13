# Negative fixtures — reference validator (second deployment)

8/8 fixtures were rejected for the constraint they target.

| Fixture | Constraint under test | errors | signature matched | correctly rejected |
|---|---|---|---|---|
| `neg-aspiration-preliminary.json` | status preliminary — profile fixes status to final | 1 | yes | yes |
| `neg-aspiration-wrongcode.json` | wrong SNOMED code — profile pattern fixes code to 371736008 | 1 | yes | yes |
| `neg-diet-drink-code-on-food.json` | drink-only concept on texture.modifier — invariant iddsi-axis-food | 1 | yes | yes |
| `neg-diet-food-code-on-fluid.json` | food-axis concept on fluidConsistencyType — invariant iddsi-axis-fluid | 1 | yes | yes |
| `neg-instrumental-pas-out-of-range.json` | PAS component value 99 — invariant pas-range (scale is 1–8) | 1 | yes | yes |
| `neg-screening-noeffective.json` | effective[x] absent — profile requires effective[x] 1..1 | 1 | yes | yes |
| `neg-severity-nosubject.json` | subject absent — profile requires subject 1..1 | 1 | yes | yes |
| `neg-summary-no-entry.json` | sections without section.entry — invariant dct-has-content | 1 | yes | yes |

Both this validator and the HAPI server share the HL7 Java validation core: portability across deployments, not independence across implementations.
