# Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale - Stroke Dysphagia Care-Transition FHIR IG v1.2.2

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale**

## Resource Profile: Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/instrumental-swallow-assessment | *Version*:1.2.2 |
| Active as of 2026-08-13 | *Computable Name*:InstrumentalSwallowAssessment |
| **Copyright/Legal**: Profile definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). This profile carries third-party concept identifiers rather than the terminologies themselves. SNOMED CT® is a registered trademark of SNOMED International; concept identifiers and English terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. LOINC® is a registered trademark of Regenstrief Institute, Inc.; LOINC codes are used under the LOINC License (http://loinc.org/license). Implementers remain responsible for holding the applicable third-party licences in their own territory. | |

 
VFSS/FEES result incl. PAS (Rosenbek). PAS lacks LOINC/SNOMED → temp code; proposed upstream. 

**Usages:**

* Refer to this Profile: [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md)
* Examples for this Profile: [Observation/ex-instrumental-swallow](Observation-ex-instrumental-swallow.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/dysphagia.care.transition|current/StructureDefinition/StructureDefinition-instrumental-swallow-assessment.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots and how the different presentations work](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](StructureDefinition-instrumental-swallow-assessment.csv), [Excel](StructureDefinition-instrumental-swallow-assessment.xlsx), [Schematron](StructureDefinition-instrumental-swallow-assessment.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "instrumental-swallow-assessment",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/instrumental-swallow-assessment",
  "version" : "1.2.2",
  "name" : "InstrumentalSwallowAssessment",
  "title" : "Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale",
  "status" : "active",
  "date" : "2026-08-13T23:31:20+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "VFSS/FEES result incl. PAS (Rosenbek). PAS lacks LOINC/SNOMED → temp code; proposed upstream.",
  "copyright" : "Profile definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). This profile carries third-party concept identifiers rather than the terminologies themselves. SNOMED CT® is a registered trademark of SNOMED International; concept identifiers and English terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. LOINC® is a registered trademark of Regenstrief Institute, Inc.; LOINC codes are used under the LOINC License (http://loinc.org/license). Implementers remain responsible for holding the applicable third-party licences in their own territory.",
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
        "valueSet" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/instrumental-swallow-type-vs"
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
    },
    {
      "id" : "Observation.component",
      "path" : "Observation.component",
      "slicing" : {
        "discriminator" : [{
          "type" : "pattern",
          "path" : "code"
        }],
        "rules" : "open"
      }
    },
    {
      "id" : "Observation.component:pas",
      "path" : "Observation.component",
      "sliceName" : "pas",
      "min" : 0,
      "max" : "1",
      "constraint" : [{
        "key" : "pas-range",
        "severity" : "error",
        "human" : "The Penetration-Aspiration Scale is an 8-point ordinal scale; a PAS grade outside 1-8 is not a valid score.",
        "expression" : "value.ofType(integer) >= 1 and value.ofType(integer) <= 8",
        "source" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/instrumental-swallow-assessment"
      }],
      "mustSupport" : true
    },
    {
      "id" : "Observation.component:pas.code",
      "path" : "Observation.component.code",
      "patternCodeableConcept" : {
        "coding" : [{
          "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
          "code" : "PAS"
        }]
      }
    },
    {
      "id" : "Observation.component:pas.value[x]",
      "path" : "Observation.component.value[x]",
      "min" : 1,
      "type" : [{
        "code" : "integer"
      }]
    }]
  }
}

```
