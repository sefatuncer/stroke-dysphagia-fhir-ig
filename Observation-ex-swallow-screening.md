# Example ??? GUSS bedside screening result (synthetic) - Stroke Dysphagia Care-Transition FHIR IG v1.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Example ??? GUSS bedside screening result (synthetic)**

## Example Observation: Example ??? GUSS bedside screening result (synthetic)

Profile: [Swallowing Screening Result](StructureDefinition-swallowing-screening-result.md)

**status**: Final

**code**: Gugging swallowing screen

**subject**: [Ornek Sentetik Female, DoB: 1957-05-12](Patient-ex-patient.md)

**effective**: 2026-03-08

**value**: 14



## Resource Content

```json
{
  "resourceType" : "Observation",
  "id" : "ex-swallow-screening",
  "meta" : {
    "profile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/swallowing-screening-result"]
  },
  "status" : "final",
  "code" : {
    "coding" : [{
      "system" : "http://snomed.info/sct",
      "code" : "1289999007",
      "display" : "Gugging swallowing screen"
    }]
  },
  "subject" : {
    "reference" : "Patient/ex-patient"
  },
  "effectiveDateTime" : "2026-03-08",
  "valueInteger" : 14
}

```
