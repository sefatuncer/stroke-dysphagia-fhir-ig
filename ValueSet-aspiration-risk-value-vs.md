# Aspiration Event Qualifier - Stroke Dysphagia Care-Transition FHIR IG v1.0.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Aspiration Event Qualifier**

## ValueSet: Aspiration Event Qualifier 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/aspiration-risk-value-vs | *Version*:1.0.1 |
| Draft as of 2026-07-28 | *Computable Name*:AspirationRiskValueVS |

 
Optional qualifier for the Aspiration Risk Flag: the observed aspiration event on which the risk determination was based (pulmonary aspiration; silent aspiration as a proposed temporary local code). Does NOT include the at-risk finding itself, which is carried in Observation.code. 

 **References** 

* [Aspiration Risk Flag](StructureDefinition-aspiration-risk-flag.md)

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
  "id" : "aspiration-risk-value-vs",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/aspiration-risk-value-vs",
  "version" : "1.0.1",
  "name" : "AspirationRiskValueVS",
  "title" : "Aspiration Event Qualifier",
  "status" : "draft",
  "experimental" : false,
  "date" : "2026-07-28T10:50:36+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Optional qualifier for the Aspiration Risk Flag: the observed aspiration event on which the risk determination was based (pulmonary aspiration; silent aspiration as a proposed temporary local code). Does NOT include the at-risk finding itself, which is carried in Observation.code.",
  "compose" : {
    "include" : [{
      "system" : "http://snomed.info/sct",
      "concept" : [{
        "code" : "68052005",
        "display" : "Pulmonary aspiration"
      }]
    },
    {
      "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
      "concept" : [{
        "code" : "SILENT-ASPIRATION"
      }]
    }]
  }
}

```
