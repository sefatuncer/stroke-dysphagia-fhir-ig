# Example ??? dysphagia care-transition summary bundling the transfer package (synthetic) - Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold) v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Example ??? dysphagia care-transition summary bundling the transfer package (synthetic)**

## Example Composition: Example ??? dysphagia care-transition summary bundling the transfer package (synthetic)

Profile: [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md)

**status**: Final

**type**: Summary of episode note

**date**: 2026-03-10

**author**: [Organization Synthetic Stroke Rehabilitation Service](Organization-ex-org.md)

**title**: Dysphagia Care-Transition Summary



## Resource Content

```json
{
  "resourceType" : "Composition",
  "id" : "ex-care-transition-summary",
  "meta" : {
    "profile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-care-transition-summary"]
  },
  "status" : "final",
  "type" : {
    "coding" : [{
      "system" : "http://loinc.org",
      "code" : "34133-9",
      "display" : "Summary of episode note"
    }]
  },
  "subject" : {
    "reference" : "Patient/ex-patient"
  },
  "date" : "2026-03-10",
  "author" : [{
    "reference" : "Organization/ex-org"
  }],
  "title" : "Dysphagia Care-Transition Summary",
  "section" : [{
    "title" : "Aspiration risk",
    "entry" : [{
      "reference" : "Observation/ex-aspiration-risk"
    }]
  },
  {
    "title" : "Swallowing severity",
    "entry" : [{
      "reference" : "Observation/ex-dysphagia-severity"
    }]
  },
  {
    "title" : "Diet and fluid consistency (IDDSI)",
    "entry" : [{
      "reference" : "NutritionOrder/ex-dysphagia-diet"
    }]
  }]
}

```
