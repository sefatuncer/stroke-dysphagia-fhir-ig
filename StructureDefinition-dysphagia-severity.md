# Dysphagia Severity - Stroke Dysphagia Care-Transition FHIR IG v1.1.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Dysphagia Severity**

## Resource Profile: Dysphagia Severity 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-severity | *Version*:1.1.1 |
| Active as of 2026-07-29 | *Computable Name*:DysphagiaSeverity |
| **Copyright/Legal**: © 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG carries concept identifiers from SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); it redistributes no code system release, national extension or semantic content. Value sets enumerate identifiers, and some members additionally carry the English term as an unmodified display hint; the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences. | |

 
Overall severity / oral-intake level (FOIS, DIGEST, or IDDSI FDS). 

**Usages:**

* Refer to this Profile: [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md)
* Examples for this Profile: [Observation/ex-dysphagia-severity](Observation-ex-dysphagia-severity.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/dysphagia.care.transition|current/StructureDefinition/StructureDefinition-dysphagia-severity.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots and how the different presentations work](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](StructureDefinition-dysphagia-severity.csv), [Excel](StructureDefinition-dysphagia-severity.xlsx), [Schematron](StructureDefinition-dysphagia-severity.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "dysphagia-severity",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-severity",
  "version" : "1.1.1",
  "name" : "DysphagiaSeverity",
  "title" : "Dysphagia Severity",
  "status" : "active",
  "date" : "2026-07-29T12:05:46+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Overall severity / oral-intake level (FOIS, DIGEST, or IDDSI FDS).",
  "copyright" : "© 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG carries concept identifiers from SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); it redistributes no code system release, national extension or semantic content. Value sets enumerate identifiers, and some members additionally carry the English term as an unmodified display hint; the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences.",
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "workflow",
    "uri" : "http://hl7.org/fhir/workflow",
    "name" : "Workflow Pattern"
  },
  {
    "identity" : "sct-concept",
    "uri" : "http://snomed.info/conceptdomain",
    "name" : "SNOMED CT Concept Domain Binding"
  },
  {
    "identity" : "v2",
    "uri" : "http://hl7.org/v2",
    "name" : "HL7 v2 Mapping"
  },
  {
    "identity" : "rim",
    "uri" : "http://hl7.org/v3",
    "name" : "RIM Mapping"
  },
  {
    "identity" : "w5",
    "uri" : "http://hl7.org/fhir/fivews",
    "name" : "FiveWs Pattern Mapping"
  },
  {
    "identity" : "sct-attr",
    "uri" : "http://snomed.org/attributebinding",
    "name" : "SNOMED CT Attribute Binding"
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "Observation",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Observation",
  "derivation" : "constraint",
  "differential" : {
    "element" : [{
      "id" : "Observation",
      "path" : "Observation"
    },
    {
      "id" : "Observation.status",
      "path" : "Observation.status",
      "mustSupport" : true
    },
    {
      "id" : "Observation.code",
      "path" : "Observation.code",
      "mustSupport" : true,
      "binding" : {
        "strength" : "extensible",
        "valueSet" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/dysphagia-severity-type-vs"
      }
    },
    {
      "id" : "Observation.subject",
      "path" : "Observation.subject",
      "min" : 1,
      "type" : [{
        "code" : "Reference",
        "targetProfile" : ["http://hl7.org/fhir/StructureDefinition/Patient"]
      }],
      "mustSupport" : true
    },
    {
      "id" : "Observation.effective[x]",
      "path" : "Observation.effective[x]",
      "min" : 1,
      "mustSupport" : true
    },
    {
      "id" : "Observation.value[x]",
      "path" : "Observation.value[x]",
      "mustSupport" : true
    }]
  }
}

```
