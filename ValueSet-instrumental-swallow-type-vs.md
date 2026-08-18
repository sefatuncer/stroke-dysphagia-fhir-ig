# Instrumental Swallow Assessment Type - Stroke Dysphagia Care-Transition FHIR IG v1.3.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Instrumental Swallow Assessment Type**

## ValueSet: Instrumental Swallow Assessment Type 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/instrumental-swallow-type-vs | *Version*:1.3.0 |
| Active as of 2026-08-18 | *Computable Name*:InstrumentalSwallowTypeVS |
| **Copyright/Legal**: Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. SNOMED CT® is a registered trademark of SNOMED International; those terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. Implementers must hold the applicable third-party licences. | |

 
Instrumental swallowing assessments (VFSS/FEES) and associated graded scales (PAS, Yale residue) — SNOMED/LOINC where coded, temporary local codes otherwise. 

 **References** 

* [Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale](StructureDefinition-instrumental-swallow-assessment.md)

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
  "id" : "instrumental-swallow-type-vs",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/instrumental-swallow-type-vs",
  "version" : "1.3.0",
  "name" : "InstrumentalSwallowTypeVS",
  "title" : "Instrumental Swallow Assessment Type",
  "status" : "active",
  "experimental" : false,
  "date" : "2026-08-18T10:55:39+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Instrumental swallowing assessments (VFSS/FEES) and associated graded scales (PAS, Yale residue) — SNOMED/LOINC where coded, temporary local codes otherwise.",
  "copyright" : "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. SNOMED CT® is a registered trademark of SNOMED International; those terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. Implementers must hold the applicable third-party licences.",
  "compose" : {
    "include" : [{
      "system" : "http://snomed.info/sct",
      "concept" : [{
        "code" : "241149003",
        "display" : "Videofluoroscopy swallow"
      },
      {
        "code" : "311834001",
        "display" : "Fibreoptic endoscopic evaluation of swallowing"
      }]
    },
    {
      "system" : "http://loinc.org",
      "concept" : [{
        "code" : "24681-9"
      },
      {
        "code" : "86395-1"
      }]
    },
    {
      "system" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
      "concept" : [{
        "code" : "PAS"
      },
      {
        "code" : "YALE-RESIDUE"
      }]
    }]
  }
}

```
