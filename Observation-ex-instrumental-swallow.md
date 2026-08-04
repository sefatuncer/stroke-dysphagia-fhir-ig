# Example ??? VFSS with Penetration-Aspiration Scale (synthetic) - Stroke Dysphagia Care-Transition FHIR IG v1.2.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Example ??? VFSS with Penetration-Aspiration Scale (synthetic)**

## Example Observation: Example ??? VFSS with Penetration-Aspiration Scale (synthetic)

Profile: [Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale](StructureDefinition-instrumental-swallow-assessment.md)

**status**: Final

**code**: Videofluoroscopy swallow

**subject**: [Ornek Sentetik Female, DoB: 1957-05-12](Patient-ex-patient.md)

**effective**: 2026-03-09

### Components

| | | |
| :--- | :--- | :--- |
| - | **Code** | **Value[x]** |
| * | Penetration-Aspiration Scale (Rosenbek 1996) — score 1–8 | 6 |



## Resource Content

```json
{
  "resourceType" : "Observation",
  "id" : "ex-instrumental-swallow",
  "meta" : {
    "profile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/instrumental-swallow-assessment"]
  },
  "status" : "final",
  "code" : {
    "coding" : [{
      "system" : "http://snomed.info/sct",
      "code" : "241149003",
      "display" : "Videofluoroscopy swallow"
    }]
  },
  "subject" : {
    "reference" : "Patient/ex-patient"
  },
  "effectiveDateTime" : "2026-03-09",
  "component" : [{
    "code" : {
      "coding" : [{
        "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
        "code" : "PAS"
      }]
    },
    "valueInteger" : 6
  }]
}

```
