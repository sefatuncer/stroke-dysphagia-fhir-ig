# Swallowing Screening Type - Stroke Dysphagia Care-Transition FHIR IG v1.2.3

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Swallowing Screening Type**

## ValueSet: Swallowing Screening Type 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/swallow-screening-type-vs | *Version*:1.2.3 |
| Active as of 2026-08-14 | *Computable Name*:SwallowScreeningTypeVS |
| **Copyright/Legal**: Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. SNOMED CT® is a registered trademark of SNOMED International; those terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. Implementers must hold the applicable third-party licences. | |

 
Swallowing screening instruments for the stroke care transition (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; TOR-BSST and EAT-10 as temporary local codes pending LOINC/SNOMED submission). Note that EAT-10 is a patient-reported symptom-severity tool used as a screen rather than a clinician-administered bedside swallow test, and its applicability in acute stroke is limited by aphasia and cognitive impairment. 

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
  "version" : "1.2.3",
  "name" : "SwallowScreeningTypeVS",
  "title" : "Swallowing Screening Type",
  "status" : "active",
  "experimental" : false,
  "date" : "2026-08-14T00:08:39+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Swallowing screening instruments for the stroke care transition (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; TOR-BSST and EAT-10 as temporary local codes pending LOINC/SNOMED submission). Note that EAT-10 is a patient-reported symptom-severity tool used as a screen rather than a clinician-administered bedside swallow test, and its applicability in acute stroke is limited by aphasia and cognitive impairment.",
  "copyright" : "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. SNOMED CT® is a registered trademark of SNOMED International; those terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. Implementers must hold the applicable third-party licences.",
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
