# Positive conformance results

Server: **HAPI FHIR Server 8.10.0** (FHIR 4.0.1) at `http://localhost:8080/fhir`

**8/8 examples conform** — PASS

Of these, **6** declare an IG profile and were validated against it; **2** (Patient, Organization) declare no profile and were validated against base FHIR.

| Resource | Validated against | Worst severity | Conforms |
|---|---|---|---|
| `Composition/ex-care-transition-summary` | `dysphagia-care-transition-summary` | warning | yes |
| `NutritionOrder/ex-dysphagia-diet` | `dysphagia-nutrition-order` | warning | yes |
| `Observation/ex-aspiration-risk` | `aspiration-risk-flag` | warning | yes |
| `Observation/ex-dysphagia-severity` | `dysphagia-severity` | warning | yes |
| `Observation/ex-instrumental-swallow` | `instrumental-swallow-assessment` | warning | yes |
| `Observation/ex-swallow-screening` | `swallowing-screening-result` | warning | yes |
| `Organization/ex-org` | base FHIR | warning | yes |
| `Patient/ex-patient` | base FHIR | warning | yes |
