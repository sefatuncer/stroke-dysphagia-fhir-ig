# Dysphagia Nutrition Order (IDDSI-bound) - Stroke Dysphagia Care-Transition FHIR IG v1.2.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Dysphagia Nutrition Order (IDDSI-bound)**

## Resource Profile: Dysphagia Nutrition Order (IDDSI-bound) 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order | *Version*:1.2.0 |
| Active as of 2026-07-31 | *Computable Name*:DysphagiaNutritionOrder |
| **Copyright/Legal**: © 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG carries concept identifiers from SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); it redistributes no code system release, national extension or semantic content. Value sets enumerate identifiers, and some members additionally carry the English term as an unmodified display hint; the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences. | |

 
NutritionOrder constrained to bind IDDSI levels (extensible) — base FHIR only binds these 'example'. 

**Usages:**

* Refer to this Profile: [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md)
* Examples for this Profile: [NutritionOrder/ex-dysphagia-diet](NutritionOrder-ex-dysphagia-diet.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/dysphagia.care.transition|current/StructureDefinition/StructureDefinition-dysphagia-nutrition-order.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots and how the different presentations work](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](StructureDefinition-dysphagia-nutrition-order.csv), [Excel](StructureDefinition-dysphagia-nutrition-order.xlsx), [Schematron](StructureDefinition-dysphagia-nutrition-order.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "dysphagia-nutrition-order",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order",
  "version" : "1.2.0",
  "name" : "DysphagiaNutritionOrder",
  "title" : "Dysphagia Nutrition Order (IDDSI-bound)",
  "status" : "active",
  "date" : "2026-07-31T09:21:13+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "NutritionOrder constrained to bind IDDSI levels (extensible) — base FHIR only binds these 'example'.",
  "copyright" : "© 2026 N. Kapan Tunçer and S. Tunçer. IG artifacts licensed under the MIT License. This IG carries concept identifiers from SNOMED CT (© SNOMED International), LOINC (© Regenstrief Institute, Inc.) and the IDDSI framework (CC BY-SA 4.0, used unmodified); it redistributes no code system release, national extension or semantic content. Value sets enumerate identifiers, and some members additionally carry the English term as an unmodified display hint; the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers are responsible for holding the applicable third-party licences.",
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "workflow",
    "uri" : "http://hl7.org/fhir/workflow",
    "name" : "Workflow Pattern"
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
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "NutritionOrder",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/NutritionOrder",
  "derivation" : "constraint",
  "differential" : {
    "element" : [{
      "id" : "NutritionOrder",
      "path" : "NutritionOrder"
    },
    {
      "id" : "NutritionOrder.patient",
      "path" : "NutritionOrder.patient",
      "mustSupport" : true
    },
    {
      "id" : "NutritionOrder.oralDiet",
      "path" : "NutritionOrder.oralDiet",
      "constraint" : [{
        "key" : "iddsi-axis-fluid",
        "severity" : "error",
        "human" : "A food-axis IDDSI concept must not be used on fluidConsistencyType, which carries the drink axis (IDDSI Levels 0-4).",
        "expression" : "fluidConsistencyType.coding.where(system = 'http://snomed.info/sct' and code in ('1237447009' | '1237448004' | '1237449007' | '1237450007' | '1237451006')).empty()",
        "source" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order"
      },
      {
        "key" : "iddsi-axis-food",
        "severity" : "error",
        "human" : "A drink-only IDDSI concept must not be used on texture.modifier, which carries the food axis. IDDSI Level 3 (1237444002) is a single concept shared by both axes and is therefore permitted here.",
        "expression" : "texture.modifier.coding.where(system = 'http://snomed.info/sct' and code in ('1231508001' | '1237441005' | '1237442003' | '1237446000')).empty()",
        "source" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order"
      }]
    },
    {
      "id" : "NutritionOrder.oralDiet.texture.modifier",
      "path" : "NutritionOrder.oralDiet.texture.modifier",
      "binding" : {
        "strength" : "extensible",
        "valueSet" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-food-levels"
      }
    },
    {
      "id" : "NutritionOrder.oralDiet.fluidConsistencyType",
      "path" : "NutritionOrder.oralDiet.fluidConsistencyType",
      "binding" : {
        "strength" : "extensible",
        "valueSet" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-fluid-levels"
      }
    }]
  }
}

```
