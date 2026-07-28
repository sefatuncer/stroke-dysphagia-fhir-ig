# Dysphagia Severity / Oral-Intake Scale Type - Stroke Dysphagia Care-Transition FHIR IG v1.0.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Dysphagia Severity / Oral-Intake Scale Type**

## ValueSet: Dysphagia Severity / Oral-Intake Scale Type 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/dysphagia-severity-type-vs | *Version*:1.0.1 |
| Draft as of 2026-07-28 | *Computable Name*:DysphagiaSeverityTypeVS |

 
Overall dysphagia severity / functional oral-intake measures (DOSS + IDDSI Functional Diet Scale reused from SNOMED; FOIS, DIGEST as temporary local codes pending LOINC/SNOMED submission). 

 **References** 

* [Dysphagia Severity](StructureDefinition-dysphagia-severity.md)

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
  "id" : "dysphagia-severity-type-vs",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/dysphagia-severity-type-vs",
  "version" : "1.0.1",
  "name" : "DysphagiaSeverityTypeVS",
  "title" : "Dysphagia Severity / Oral-Intake Scale Type",
  "status" : "draft",
  "experimental" : false,
  "date" : "2026-07-28T10:50:36+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Overall dysphagia severity / functional oral-intake measures (DOSS + IDDSI Functional Diet Scale reused from SNOMED; FOIS, DIGEST as temporary local codes pending LOINC/SNOMED submission).",
  "compose" : {
    "include" : [{
      "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
      "concept" : [{
        "code" : "FOIS"
      },
      {
        "code" : "DIGEST"
      }]
    },
    {
      "system" : "http://snomed.info/sct",
      "concept" : [{
        "code" : "767131006",
        "display" : "Dysphagia Outcome and Severity Scale"
      },
      {
        "code" : "1231505003",
        "display" : "International Dysphagia Diet Standardisation Initiative Functional Diet Scale"
      }]
    }]
  }
}

```
