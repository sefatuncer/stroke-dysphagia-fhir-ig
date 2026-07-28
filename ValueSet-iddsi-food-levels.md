# IDDSI Food Texture Levels (SNOMED CT) - Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold) v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **IDDSI Food Texture Levels (SNOMED CT)**

## ValueSet: IDDSI Food Texture Levels (SNOMED CT) 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-food-levels | *Version*:0.1.0 |
| Draft as of 2026-07-28 | *Computable Name*:IDDSIFoodLevels |

 
IDDSI food-axis texture levels 4–7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier. 

 **References** 

* [Dysphagia Nutrition Order (IDDSI-bound)](StructureDefinition-dysphagia-nutrition-order.md)

### Logical Definition (CLD)

 

### Expansion

-------

 Explanation of the columns that may appear on this page: 

| | |
| :--- | :--- |
| Level | A few code lists that FHIR defines are hierarchical - each code is assigned a level. In this scheme, some codes are under other codes, and imply that the code they are under also applies |
| System | The source of the definition of the code (when the value set draws in codes defined elsewhere) |
| Code | The code (used as the code in the resource instance) |
| Display | The display (used in the*display*element of a[Coding](http://hl7.org/fhir/R4/datatypes.html#Coding)). If there is no display, implementers should not simply display the code, but map the concept into their application |
| Definition | An explanation of the meaning of the concept |
| Comments | Additional notes about how to use the code |



## Resource Content

```json
{
  "resourceType" : "ValueSet",
  "id" : "iddsi-food-levels",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-food-levels",
  "version" : "0.1.0",
  "name" : "IDDSIFoodLevels",
  "title" : "IDDSI Food Texture Levels (SNOMED CT)",
  "status" : "draft",
  "experimental" : false,
  "date" : "2026-07-28T10:20:05+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "IDDSI food-axis texture levels 4–7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier.",
  "compose" : {
    "include" : [{
      "system" : "http://snomed.info/sct",
      "concept" : [{
        "code" : "1237447009"
      },
      {
        "code" : "1237448004"
      },
      {
        "code" : "1237449007"
      },
      {
        "code" : "1237450007"
      },
      {
        "code" : "1237451006"
      }]
    }]
  }
}

```
