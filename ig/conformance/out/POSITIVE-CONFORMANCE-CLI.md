# Positive examples — reference validator (second deployment)

**8/8 examples conform** — PASS. 6 were validated against a declared IG profile; 2 (Patient, Organization) declare no profile and were validated against base FHIR.

| Example | Declared profile | errors | warnings |
|---|---|---|---|
| `Composition-ex-care-transition-summary.json` | dysphagia-care-transition-summary | 0 | 1 |
| `NutritionOrder-ex-dysphagia-diet.json` | dysphagia-nutrition-order | 0 | 1 |
| `Observation-ex-aspiration-risk.json` | aspiration-risk-flag | 0 | 2 |
| `Observation-ex-dysphagia-severity.json` | dysphagia-severity | 0 | 2 |
| `Observation-ex-instrumental-swallow.json` | instrumental-swallow-assessment | 0 | 2 |
| `Observation-ex-swallow-screening.json` | swallowing-screening-result | 0 | 2 |
| `Organization-ex-org.json` | — (base FHIR) | 0 | 1 |
| `Patient-ex-patient.json` | — (base FHIR) | 0 | 1 |

Both this validator and the HAPI server share the HL7 Java validation core: portability across deployments, not independence across implementations.
