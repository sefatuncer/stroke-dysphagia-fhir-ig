# IDDSI Food Texture Levels (SNOMED CT) - Stroke Dysphagia Care-Transition FHIR IG v1.2.3

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **IDDSI Food Texture Levels (SNOMED CT)**

## ValueSet: IDDSI Food Texture Levels (SNOMED CT) 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/iddsi-food-levels | *Version*:1.2.3 |
| Active as of 2026-08-14 | *Computable Name*:IDDSIFoodLevels |
| **Copyright/Legal**: Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries no display terms, which are supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences. | |

 
IDDSI food-axis texture levels 4–7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier. The IDDSI food axis spans Levels 3–7; Level 3 (Liquidised) is the shared Moderately Thick concept and is not enumerated here, so it is reached through the extensible binding. 

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
  "version" : "1.2.3",
  "name" : "IDDSIFoodLevels",
  "title" : "IDDSI Food Texture Levels (SNOMED CT)",
  "status" : "active",
  "experimental" : false,
  "date" : "2026-08-14T00:08:39+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "IDDSI food-axis texture levels 4–7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier. The IDDSI food axis spans Levels 3–7; Level 3 (Liquidised) is the shared Moderately Thick concept and is not enumerated here, so it is reached through the extensible binding.",
  "copyright" : "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries no display terms, which are supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences.",
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
