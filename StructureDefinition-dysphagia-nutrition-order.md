# Dysphagia Nutrition Order (IDDSI-bound) - Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold) v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Dysphagia Nutrition Order (IDDSI-bound)**

## Resource Profile: Dysphagia Nutrition Order (IDDSI-bound) 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order | *Version*:0.1.0 |
| Draft as of 2026-07-28 | *Computable Name*:DysphagiaNutritionOrder |

 
NutritionOrder constrained to bind IDDSI levels (extensible) — base FHIR only binds these 'example'. 

**Usages:**

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
  "version" : "0.1.0",
  "name" : "DysphagiaNutritionOrder",
  "title" : "Dysphagia Nutrition Order (IDDSI-bound)",
  "status" : "draft",
  "date" : "2026-07-28T10:20:05+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "NutritionOrder constrained to bind IDDSI levels (extensible) — base FHIR only binds these 'example'.",
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
