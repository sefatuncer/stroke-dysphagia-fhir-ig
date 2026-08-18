# Example ??? aspiration risk present (synthetic) - Stroke Dysphagia Care-Transition FHIR IG v1.3.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Example ??? aspiration risk present (synthetic)**

## Example Observation: Example ??? aspiration risk present (synthetic)

Profile: [Aspiration Risk Flag](StructureDefinition-aspiration-risk-flag.md)

**status**: Final

**code**: At risk for aspiration

**subject**: [Ornek Sentetik Female, DoB: 1957-05-12](Patient-ex-patient.md)

**effective**: 2026-03-10



## Resource Content

```json
{
  "resourceType" : "Observation",
  "id" : "ex-aspiration-risk",
  "meta" : {
    "profile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/aspiration-risk-flag"]
  },
  "status" : "final",
  "code" : {
    "coding" : [{
      "system" : "http://snomed.info/sct",
      "code" : "371736008",
      "display" : "At risk for aspiration"
    }]
  },
  "subject" : {
    "reference" : "Patient/ex-patient"
  },
  "effectiveDateTime" : "2026-03-10"
}

```
