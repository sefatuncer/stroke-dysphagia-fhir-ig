# Aspiration Risk Flag - Stroke Dysphagia Care-Transition FHIR IG v1.3.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Aspiration Risk Flag**

## Resource Profile: Aspiration Risk Flag 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/aspiration-risk-flag | *Version*:1.3.0 |
| Active as of 2026-08-18 | *Computable Name*:AspirationRiskFlag |
| **Copyright/Legal**: Profile definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). This profile carries third-party concept identifiers rather than the terminologies themselves. SNOMED CT® is a registered trademark of SNOMED International; concept identifiers and English terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. Implementers remain responsible for holding the applicable third-party licences in their own territory. | |

 

| | |
| :--- | :--- |
| Patient-level aspiration-risk finding — the minimal, most safety-critical element carried across transitions. The at-risk-for-aspiration finding is asserted by`Observation.code`; the mere PRESENCE of a final instance is the datum the care-transition consistency rule consumes (the rule does not read the value). Status is fixed to final so that every conformant instance is visible to the rule (the rule accepts final | amended, a superset), closing the profile↔rule gap. An optional qualifier value may record the observed aspiration event on which the risk determination was based. |

 

**Usages:**

* Refer to this Profile: [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md)
* Examples for this Profile: [Observation/ex-aspiration-risk](Observation-ex-aspiration-risk.md)

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/dysphagia.care.transition|current/StructureDefinition/StructureDefinition-aspiration-risk-flag.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots and how the different presentations work](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](StructureDefinition-aspiration-risk-flag.csv), [Excel](StructureDefinition-aspiration-risk-flag.xlsx), [Schematron](StructureDefinition-aspiration-risk-flag.sch) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "aspiration-risk-flag",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/aspiration-risk-flag",
  "version" : "1.3.0",
  "name" : "AspirationRiskFlag",
  "title" : "Aspiration Risk Flag",
  "status" : "active",
  "date" : "2026-08-18T10:55:39+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Patient-level aspiration-risk finding — the minimal, most safety-critical element carried across transitions. The at-risk-for-aspiration finding is asserted by `Observation.code`; the mere PRESENCE of a final instance is the datum the care-transition consistency rule consumes (the rule does not read the value). Status is fixed to final so that every conformant instance is visible to the rule (the rule accepts final|amended, a superset), closing the profile↔rule gap. An optional qualifier value may record the observed aspiration event on which the risk determination was based.",
  "copyright" : "Profile definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). This profile carries third-party concept identifiers rather than the terminologies themselves. SNOMED CT® is a registered trademark of SNOMED International; concept identifiers and English terms are © SNOMED International, used under the Global Patient Set licence (CC BY-ND 4.0, https://creativecommons.org/licenses/by-nd/4.0/) and reproduced verbatim, with none translated, shortened or otherwise altered. Implementers remain responsible for holding the applicable third-party licences in their own territory.",
  "fhirVersion" : "4.0.1",
  "mapping" : [{
    "identity" : "workflow",
    "uri" : "http://hl7.org/fhir/workflow",
    "name" : "Workflow Pattern"
  },
  {
    "identity" : "sct-concept",
    "uri" : "http://snomed.info/conceptdomain",
    "name" : "SNOMED CT Concept Domain Binding"
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
  },
  {
    "identity" : "sct-attr",
    "uri" : "http://snomed.org/attributebinding",
    "name" : "SNOMED CT Attribute Binding"
  }],
  "kind" : "resource",
  "abstract" : false,
  "type" : "Observation",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Observation",
  "derivation" : "constraint",
  "differential" : {
    "element" : [{
      "id" : "Observation",
      "path" : "Observation"
    },
    {
      "id" : "Observation.status",
      "path" : "Observation.status",
      "fixedCode" : "final",
      "mustSupport" : true
    },
    {
      "id" : "Observation.code",
      "path" : "Observation.code",
      "patternCodeableConcept" : {
        "coding" : [{
          "system" : "http://snomed.info/sct",
          "code" : "371736008"
        }]
      }
    },
    {
      "id" : "Observation.subject",
      "path" : "Observation.subject",
      "min" : 1,
      "type" : [{
        "code" : "Reference",
        "targetProfile" : ["http://hl7.org/fhir/StructureDefinition/Patient"]
      }],
      "mustSupport" : true
    },
    {
      "id" : "Observation.effective[x]",
      "path" : "Observation.effective[x]",
      "min" : 1,
      "mustSupport" : true
    },
    {
      "id" : "Observation.value[x]",
      "path" : "Observation.value[x]",
      "type" : [{
        "code" : "CodeableConcept"
      }],
      "mustSupport" : true,
      "binding" : {
        "strength" : "extensible",
        "valueSet" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ValueSet/aspiration-risk-value-vs"
      }
    }]
  }
}

```
