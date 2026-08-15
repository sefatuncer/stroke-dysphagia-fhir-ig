# Example ??? IDDSI Level 5 diet + mildly thick fluids (synthetic) - Stroke Dysphagia Care-Transition FHIR IG v1.2.5

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Example ??? IDDSI Level 5 diet + mildly thick fluids (synthetic)**

## Example NutritionOrder: Example ??? IDDSI Level 5 diet + mildly thick fluids (synthetic)

Profile: [Dysphagia Nutrition Order (IDDSI-bound)](StructureDefinition-dysphagia-nutrition-order.md)

**status**: Active

**intent**: Order

**patient**: [Ornek Sentetik Female, DoB: 1957-05-12](Patient-ex-patient.md)

**dateTime**: 2026-03-10

> **oralDiet**

### Textures

| | |
| :--- | :--- |
| - | **Modifier** |
| * | International Dysphagia Diet Standardisation Initiative Framework - Minced and Moist Level 5 |

**fluidConsistencyType**: International Dysphagia Diet Standardisation Initiative Framework - Mildly Thick Level 2



## Resource Content

```json
{
  "resourceType" : "NutritionOrder",
  "id" : "ex-dysphagia-diet",
  "meta" : {
    "profile" : ["https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order"]
  },
  "status" : "active",
  "intent" : "order",
  "patient" : {
    "reference" : "Patient/ex-patient"
  },
  "dateTime" : "2026-03-10",
  "oralDiet" : {
    "texture" : [{
      "modifier" : {
        "coding" : [{
          "system" : "http://snomed.info/sct",
          "code" : "1237448004",
          "display" : "International Dysphagia Diet Standardisation Initiative Framework - Minced and Moist Level 5"
        }]
      }
    }],
    "fluidConsistencyType" : [{
      "coding" : [{
        "system" : "http://snomed.info/sct",
        "code" : "1237442003",
        "display" : "International Dysphagia Diet Standardisation Initiative Framework - Mildly Thick Level 2"
      }]
    }]
  }
}

```
