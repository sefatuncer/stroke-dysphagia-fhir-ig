# Dysphagia Care-Transition Summary - Stroke Dysphagia Care-Transition FHIR IG v1.1.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Dysphagia Care-Transition Summary**

## Resource Profile: Dysphagia Care-Transition Summary 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-care-transition-summary | *Version*:1.1.1 |
| Active as of 2026-07-29 | *Computable Name*:DysphagiaCareTransitionSummary |
| **Copyright/Legal**: © 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG carries concept identifiers from SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); it redistributes no code system release, national extension or semantic content. Value sets enumerate identifiers, and some members additionally carry the English term as an unmodified display hint; the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences. | |

 
Composition bundling swallowing assessment + severity + aspiration risk + IDDSI diet + precautions for a stroke care transition. 

**Usages:**

* Examples for this Profile: [Composition/ex-care-transition-summary](Composition-ex-care-transition-summary.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/dysphagia.care.transition|current/StructureDefinition/StructureDefinition-dysphagia-care-transition-summary.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots and how the different presentations work](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](StructureDefinition-dysphagia-care-transition-summary.csv), [Excel](StructureDefinition-dysphagia-care-transition-summary.xlsx), [Schematron](StructureDefinition-dysphagia-care-transition-summary.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "dysphagia-care-transition-summary",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-care-transition-summary",
  "version" : "1.1.1",
  "name" : "DysphagiaCareTransitionSummary",
  "title" : "Dysphagia Care-Transition Summary",
  "status" : "active",
  "date" : "2026-07-29T12:05:46+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Composition bundling swallowing assessment + severity + aspiration risk + IDDSI diet + precautions for a stroke care transition.",
  "copyright" : "© 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG carries concept identifiers from SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); it redistributes no code system release, national extension or semantic content. Value sets enumerate identifiers, and some members additionally carry the English term as an unmodified display hint; the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences.",
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "workflow",
    "uri" : "http://hl7.org/fhir/workflow",
    "name" : "Workflow Pattern"
  },
  {
    "identity" : "rim",
    "uri" : "http://hl7.org/v3",
    "name" : "RIM Mapping"
  },
  {
    "identity" : "cda",
    "uri" : "http://hl7.org/v3/cda",
    "name" : "CDA (R2)"
  },
  {
    "identity" : "fhirdocumentreference",
    "uri" : "http://hl7.org/fhir/documentreference",
    "name" : "FHIR DocumentReference"
  },
  {
    "identity" : "w5",
    "uri" : "http://hl7.org/fhir/fivews",
    "name" : "FiveWs Pattern Mapping"
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "Composition",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Composition",
  "derivation" : "constraint",
  "differential" : {
    "element" : [{
      "id" : "Composition",
      "path" : "Composition",
      "constraint" : [{
        "key" : "dct-has-content",
        "severity" : "error",
        "human" : "A care-transition summary must carry at least one section entry. An envelope with no dysphagia content is not a transfer.",
        "expression" : "section.entry.exists()",
        "source" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-care-transition-summary"
      }]
    },
    {
      "id" : "Composition.status",
      "path" : "Composition.status",
      "mustSupport" : true
    },
    {
      "id" : "Composition.type",
      "path" : "Composition.type",
      "patternCodeableConcept" : {
        "coding" : [{
          "system" : "http://loinc.org",
          "code" : "34133-9"
        }]
      }
    },
    {
      "id" : "Composition.subject",
      "path" : "Composition.subject",
      "min" : 1,
      "type" : [{
        "code" : "Reference",
        "targetProfile" : ["http://hl7.org/fhir/StructureDefinition/Patient"]
      }],
      "mustSupport" : true
    },
    {
      "id" : "Composition.section.entry",
      "path" : "Composition.section.entry",
      "type" : [{
        "code" : "Reference",
        "targetProfile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/swallowing-screening-result",
        "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/instrumental-swallow-assessment",
        "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-severity",
        "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/aspiration-risk-flag",
        "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order"]
      }]
    }]
  }
}

```
