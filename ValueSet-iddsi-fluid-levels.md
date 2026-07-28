# IDDSI Drink/Fluid Consistency Levels (SNOMED CT) - Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold) v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **IDDSI Drink/Fluid Consistency Levels (SNOMED CT)**

## ValueSet: IDDSI Drink/Fluid Consistency Levels (SNOMED CT) 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-fluid-levels | *Version*:0.1.0 |
| Draft as of 2026-07-28 | *Computable Name*:IDDSIFluidLevels |

 
IDDSI drink-axis consistency levels 0–4 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.fluidConsistencyType. Level 3 is the transitional Moderately Thick concept shared with the food axis. 

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
  "id" : "iddsi-fluid-levels",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-fluid-levels",
  "version" : "0.1.0",
  "name" : "IDDSIFluidLevels",
  "title" : "IDDSI Drink/Fluid Consistency Levels (SNOMED CT)",
  "status" : "draft",
  "experimental" : false,
  "date" : "2026-07-28T10:20:05+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "IDDSI drink-axis consistency levels 0–4 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.fluidConsistencyType. Level 3 is the transitional Moderately Thick concept shared with the food axis.",
  "compose" : {
    "include" : [{
      "system" : "http://snomed.info/sct",
      "concept" : [{
        "code" : "1231508001"
      },
      {
        "code" : "1237441005"
      },
      {
        "code" : "1237442003"
      },
      {
        "code" : "1237444002"
      },
      {
        "code" : "1237446000"
      }]
    }]
  }
}

```
