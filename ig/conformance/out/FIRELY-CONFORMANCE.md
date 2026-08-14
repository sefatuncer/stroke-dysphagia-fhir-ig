# Independent implementation — Firely .NET SDK

8/8 positive examples validated and 10/10 negative fixtures were rejected for the constraint they target — PASS.

Unlike the reference validator and the HAPI server, this engine is a separately written implementation of the same specification. Agreement here is independence across implementations, not only portability across deployments.

## Negative fixtures

| Fixture | Constraint under test | rejected | signature matched | Firely's own message |
|---|---|---|---|---|
| `neg-aspiration-preliminary.json` | status preliminary — profile fixes status to final | yes | yes | Error: Value 'preliminary' is not exactly equal to fixed value 'final' At: Observation.status[0] http://hl7.org/fhir/dotnet-api-operation-outcome\|1008 |
| `neg-aspiration-wrongcode.json` | wrong SNOMED code — profile pattern fixes code to 371736008 | yes | yes | Error: Value '{"coding":[{"system":"http://snomed.info/sct","code":"40739000","display":"Dysphagia"}]}' does not match pattern '{"coding":[{"system":"http://sno |
| `neg-diet-drink-code-on-food.json` | drink-only concept on texture.modifier — invariant iddsi-axis-food | yes | yes | Error: Instance failed constraint iddsi-axis-food "A drink-only IDDSI concept must not be used on texture.modifier, which carries the food axis. IDDSI Level 3 ( |
| `neg-diet-food-code-on-fluid.json` | food-axis concept on fluidConsistencyType — invariant iddsi-axis-fluid | yes | yes | Error: Instance failed constraint iddsi-axis-fluid "A food-axis IDDSI concept must not be used on fluidConsistencyType, which carries the drink axis (IDDSI Leve |
| `neg-instrumental-pas-out-of-range.json` | PAS component value 99 — invariant pas-range (scale is 1-8) | yes | yes | Error: Instance failed constraint pas-range "The Penetration-Aspiration Scale is an 8-point ordinal scale; a PAS grade outside 1-8 is not a valid score." (for s |
| `neg-screening-noeffective.json` | effective[x] absent — profile requires effective[x] 1..1 | yes | yes | Error: Instance count is 0, which is not within the specified cardinality of 1..1 At: Observation.effective[x] http://hl7.org/fhir/dotnet-api-operation-outcome\ |
| `neg-severity-nosubject.json` | subject absent — profile requires subject 1..1 | yes | yes | Error: Instance count is 0, which is not within the specified cardinality of 1..1 At: Observation.subject http://hl7.org/fhir/dotnet-api-operation-outcome\|1028 |
| `neg-summary-foreign-entry.json` | section.entry references a Condition — profile restricts entries to the IG profiles | yes | yes | Error: Referenced resource '' does not validate against any of the expected target profiles (https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefi |
| `neg-summary-no-entry.json` | sections without section.entry — invariant dct-has-content | yes | yes | Error: Instance failed constraint dct-has-content "A care-transition summary must carry at least one section entry. An envelope with no dysphagia content is not |
| `neg-summary-wrong-type.json` | wrong Composition.type code — profile fixes type to LOINC 34133-9 | yes | yes | Error: Value '{"coding":[{"system":"http://loinc.org","code":"11488-4"}]}' does not match pattern '{"coding":[{"system":"http://loinc.org","code":"34133-9"}]}'  |

## Positive examples

| Example | Declared profile | valid |
|---|---|---|
| `Composition-ex-care-transition-summary.json` | dysphagia-care-transition-summary | yes |
| `NutritionOrder-ex-dysphagia-diet.json` | dysphagia-nutrition-order | yes |
| `Observation-ex-aspiration-risk.json` | aspiration-risk-flag | yes |
| `Observation-ex-dysphagia-severity.json` | dysphagia-severity | yes |
| `Observation-ex-instrumental-swallow.json` | instrumental-swallow-assessment | yes |
| `Observation-ex-swallow-screening.json` | swallowing-screening-result | yes |
| `Organization-ex-org.json` | — (base FHIR) | yes |
| `Patient-ex-patient.json` | — (base FHIR) | yes |
