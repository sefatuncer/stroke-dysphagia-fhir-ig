# Example ??? FOIS functional oral-intake level (synthetic) - Stroke Dysphagia Care-Transition FHIR IG v1.2.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Example ??? FOIS functional oral-intake level (synthetic)**

## Example Observation: Example ??? FOIS functional oral-intake level (synthetic)

Profile: [Dysphagia Severity](StructureDefinition-dysphagia-severity.md)

**status**: Final

**code**: Functional Oral Intake Scale — level 1–7

**subject**: [Ornek Sentetik Female, DoB: 1957-05-12](Patient-ex-patient.md)

**effective**: 2026-03-09

**value**: 4



## Resource Content

```json
{
  "resourceType" : "Observation",
  "id" : "ex-dysphagia-severity",
  "meta" : {
    "profile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-severity"]
  },
  "status" : "final",
  "code" : {
    "coding" : [{
      "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
      "code" : "FOIS"
    }]
  },
  "subject" : {
    "reference" : "Patient/ex-patient"
  },
  "effectiveDateTime" : "2026-03-09",
  "valueInteger" : 4
}

```
