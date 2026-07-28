# Swallowing Screening Type - Stroke Dysphagia Care-Transition FHIR IG v1.0.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Swallowing Screening Type**

## ValueSet: Swallowing Screening Type 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/swallow-screening-type-vs | *Version*:1.0.1 |
| Draft as of 2026-07-28 | *Computable Name*:SwallowScreeningTypeVS |

 
Bedside swallowing screening instruments (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; EAT-10 / TOR-BSST as temporary local codes pending LOINC/SNOMED submission). 

 **References** 

* [Swallowing Screening Result](StructureDefinition-swallowing-screening-result.md)

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
  "id" : "swallow-screening-type-vs",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/swallow-screening-type-vs",
  "version" : "1.0.1",
  "name" : "SwallowScreeningTypeVS",
  "title" : "Swallowing Screening Type",
  "status" : "draft",
  "experimental" : false,
  "date" : "2026-07-28T10:50:36+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Bedside swallowing screening instruments (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; EAT-10 / TOR-BSST as temporary local codes pending LOINC/SNOMED submission).",
  "compose" : {
    "include" : [{
      "system" : "http://snomed.info/sct",
      "concept" : [{
        "code" : "1289999007",
        "display" : "Gugging swallowing screen"
      },
      {
        "code" : "717684008",
        "display" : "Yale Swallow Protocol"
      }]
    },
    {
      "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
      "concept" : [{
        "code" : "EAT-10"
      },
      {
        "code" : "TOR-BSST"
      }]
    }]
  }
}

```
