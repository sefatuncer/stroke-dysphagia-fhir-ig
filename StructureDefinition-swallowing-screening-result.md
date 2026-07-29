# Swallowing Screening Result - Stroke Dysphagia Care-Transition FHIR IG v1.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Swallowing Screening Result**

## Resource Profile: Swallowing Screening Result 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/swallowing-screening-result | *Version*:1.1.0 |
| Active as of 2026-07-29 | *Computable Name*:SwallowingScreeningResult |
| **Copyright/Legal**: © 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG references but does not redistribute SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); value sets enumerate concept identifiers only, so display terms are supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences. | |

 
Bedside dysphagia screening (GUSS/EAT-10/TOR-BSST). GUSS reuses SNOMED 1289999007. 

**Usages:**

* Refer to this Profile: [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md)
* Examples for this Profile: [Observation/ex-swallow-screening](Observation-ex-swallow-screening.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/dysphagia.care.transition|current/StructureDefinition/StructureDefinition-swallowing-screening-result.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots and how the different presentations work](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](StructureDefinition-swallowing-screening-result.csv), [Excel](StructureDefinition-swallowing-screening-result.xlsx), [Schematron](StructureDefinition-swallowing-screening-result.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "swallowing-screening-result",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/swallowing-screening-result",
  "version" : "1.1.0",
  "name" : "SwallowingScreeningResult",
  "title" : "Swallowing Screening Result",
  "status" : "active",
  "date" : "2026-07-29T08:35:16+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Bedside dysphagia screening (GUSS/EAT-10/TOR-BSST). GUSS reuses SNOMED 1289999007.",
  "copyright" : "© 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG references but does not redistribute SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); value sets enumerate concept identifiers only, so display terms are supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences.",
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
      "fixedCode" : "final",
      "mustSupport" : true
    },
    {
      "id" : "Observation.code",
      "path" : "Observation.code",
      "mustSupport" : true,
      "binding" : {
        "strength" : "extensible",
        "valueSet" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/swallow-screening-type-vs"
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
