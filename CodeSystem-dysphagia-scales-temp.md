# Dysphagia Scales ??? temporary local codes (proposed for LOINC/SNOMED) - Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold) v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Dysphagia Scales ??? temporary local codes (proposed for LOINC/SNOMED)**

## CodeSystem: Dysphagia Scales ??? temporary local codes (proposed for LOINC/SNOMED) (Experimental) 

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp | *Version*:0.1.0 |
| Draft as of 2026-07-28 | *Computable Name*:DysphagiaScalesTemp |

 
Placeholder codes for validated dysphagia measures lacking terminology representation. To be submitted upstream. 

 This Code system is referenced in the content logical definition of the following value sets: 

* [AspirationRiskValueVS](ValueSet-aspiration-risk-value-vs.md)
* [DysphagiaSeverityTypeVS](ValueSet-dysphagia-severity-type-vs.md)
* [InstrumentalSwallowTypeVS](ValueSet-instrumental-swallow-type-vs.md)
* [SwallowScreeningTypeVS](ValueSet-swallow-screening-type-vs.md)



## Resource Content

```json
{
  "resourceType" : "CodeSystem",
  "id" : "dysphagia-scales-temp",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/CodeSystem/dysphagia-scales-temp",
  "version" : "0.1.0",
  "name" : "DysphagiaScalesTemp",
  "title" : "Dysphagia Scales — temporary local codes (proposed for LOINC/SNOMED)",
  "status" : "draft",
  "experimental" : true,
  "date" : "2026-07-28T10:20:05+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Placeholder codes for validated dysphagia measures lacking terminology representation. To be submitted upstream.",
  "caseSensitive" : true,
  "content" : "complete",
  "count" : 7,
  "concept" : [{
    "code" : "PAS",
    "display" : "Penetration-Aspiration Scale (Rosenbek 1996) — score 1–8"
  },
  {
    "code" : "FOIS",
    "display" : "Functional Oral Intake Scale — level 1–7"
  },
  {
    "code" : "EAT-10",
    "display" : "Eating Assessment Tool-10 — total score"
  },
  {
    "code" : "DIGEST",
    "display" : "Dynamic Imaging Grade of Swallowing Toxicity — grade 0–4"
  },
  {
    "code" : "TOR-BSST",
    "display" : "Toronto Bedside Swallowing Screening Test — pass/fail"
  },
  {
    "code" : "YALE-RESIDUE",
    "display" : "Yale Pharyngeal Residue Severity Rating"
  },
  {
    "code" : "SILENT-ASPIRATION",
    "display" : "Silent aspiration (finding) — proposed (no SNOMED concept)"
  }]
}

```
