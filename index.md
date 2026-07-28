# Home - Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold) v0.1.0

* [**Table of Contents**](toc.md)
* **Home**

## Home

| | |
| :--- | :--- |
| *Official URL*:https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ImplementationGuide/dysphagia.care.transition | *Version*:0.1.0 |
| Draft as of 2026-07-28 | *Computable Name*:DysphagiaCareTransitionIG |

### Stroke Dysphagia Care-Transition FHIR IG (DRAFT)

This Implementation Guide defines an **interoperable, machine-readable representation** of swallowing assessment, aspiration risk, dysphagia severity and IDDSI diet/fluid consistency so these data can travel across stroke care transitions (**acute → inpatient rehab → home / tele-rehab**).

> **Scope note (honest framing).** This IG targets **interoperability and computable decision-support feasibility**. It does **not** claim clinical benefit. All examples use **synthetic data only** (no patient data, no ethics approval required).

#### What this IG contributes (the narrow gap)

Diet/IDDSI ordering is already covered by base FHIR `NutritionOrder`, PACIO PFE and SNOMED-embedded IDDSI — this IG **reuses** those rather than re-inventing them. The genuine gap it fills is on the **assessment / outcome / risk** side:

* **Observation profiles** absent from US Core / IPS / PACIO: 
* `SwallowingScreeningResult` (bedside screening — GUSS reuses SNOMED `1289999007`)
* `InstrumentalSwallowAssessment` (VFSS/FEES incl. Penetration-Aspiration Scale)
* `DysphagiaSeverity` (FOIS / DIGEST / IDDSI Functional Diet Scale)
* `AspirationRiskFlag` (patient-level, safety-critical, SNOMED `371736008`)
 
* An **IDDSI Framework `ValueSet`** over SNOMED-embedded IDDSI concepts (no official FHIR ValueSet exists — defining one is a contribution).
* A **`DysphagiaNutritionOrder`** profile that binds IDDSI **extensibly** (base FHIR binds it only as **example**).
* A **`DysphagiaCareTransitionSummary`** Composition — the transfer envelope.
* A set of **validated dysphagia scales that currently lack terminology** (PAS, FOIS, EAT-10, DIGEST, TOR-BSST, Yale residue) captured as temporary local codes and **proposed upstream to LOINC/SNOMED**.

#### Computable decision support (feasibility)

An executable **CQL** rule (`AspirationRiskAlert`) surfaces a care-transition **safety inconsistency** — an at-risk patient still on unmodified (thin, IDDSI Level 0) fluids and not NPO — directly from the profiled data. It compiles to ELM and runs, **unmodified, on a real CQL engine** (cql-execution) over a synthetic Synthea stroke cohort (N = 333). Reported outcomes are **executability**, authoring **concordance**, trigger rate, and — the point — the **interoperability dependency**: of the clinically-unsafe cases that should surface, **34% are invisible to the rule when the aspiration-risk flag is left as un-coded free text** rather than the coded Observation this IG defines. This is a **feasibility / interoperability** result — **no diagnostic-accuracy or PPV claim**. All data are synthetic.

#### Standards alignment

This IG **extends, does not reinvent**: it declares dependencies on **IPS 2.0.1** and **PACIO PFE 2.0.0** and positions relative to **US Core**. Profiles derive from **base FHIR resources** by design — hard-deriving from these IGs would import mandatory constraints inappropriate for a focused, international dysphagia transfer (IPS Composition requires Problems / Allergies / Medications sections; PACIO's `pfe-nutrition-order` requires `allergyIntolerance` and omits an IDDSI binding). The contribution is precisely the dysphagia-specific gap those frameworks leave open — the **IDDSI binding PACIO omits** and the **assessment / risk profiles IPS and US Core lack**.

#### Status

Draft scaffold. Terminology verified against SNOMED CT International 20250201 + LOINC/NLM. Conformance is demonstrated with the FHIR Validator plus **≥2 independent servers** (not self-validation only).



## Resource Content

```json
{
  "resourceType" : "ImplementationGuide",
  "id" : "dysphagia.care.transition",
  "url" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/ImplementationGuide/dysphagia.care.transition",
  "version" : "0.1.0",
  "name" : "DysphagiaCareTransitionIG",
  "title" : "Stroke Dysphagia Care-Transition FHIR IG (DRAFT scaffold)",
  "status" : "draft",
  "date" : "2026-07-28T10:20:05+00:00",
  "publisher" : "N. Kapan Tunçer; S. Tunçer",
  "description" : "Interoperable representation of swallowing assessment, aspiration risk, dysphagia severity and IDDSI diet across stroke care transitions (acute → rehab → home). Reuses SNOMED-embedded IDDSI/GUSS + clinical findings; contributes swallowing-assessment Observation profiles + IDDSI ValueSet/binding + a care-transition summary.",
  "packageId" : "dysphagia.care.transition",
  "license" : "CC0-1.0",
  "fhirVersion" : ["4.0.1"],
  "dependsOn" : [{
    "id" : "hl7tx",
    "extension" : [{
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-dependency-comment",
      "valueMarkdown" : "Automatically added as a dependency - all IGs depend on HL7 Terminology"
    }],
    "uri" : "http://terminology.hl7.org/ImplementationGuide/hl7.terminology",
    "packageId" : "hl7.terminology.r4",
    "version" : "7.3.0"
  },
  {
    "id" : "hl7ext",
    "extension" : [{
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/implementationguide-dependency-comment",
      "valueMarkdown" : "Automatically added as a dependency - all IGs depend on the HL7 Extension Pack"
    }],
    "uri" : "http://hl7.org/fhir/extensions/ImplementationGuide/hl7.fhir.uv.extensions",
    "packageId" : "hl7.fhir.uv.extensions.r4",
    "version" : "5.3.0"
  },
  {
    "id" : "hl7_fhir_uv_ips",
    "uri" : "http://hl7.org/fhir/uv/ips/ImplementationGuide/hl7.fhir.uv.ips",
    "packageId" : "hl7.fhir.uv.ips",
    "version" : "2.0.1"
  },
  {
    "id" : "hl7_fhir_us_pacio_pfe",
    "uri" : "http://hl7.org/fhir/us/pacio-pfe/ImplementationGuide/hl7.fhir.us.pacio-pfe",
    "packageId" : "hl7.fhir.us.pacio-pfe",
    "version" : "2.0.0"
  }],
  "definition" : {
    "extension" : [{
      "extension" : [{
        "url" : "code",
        "valueString" : "copyrightyear"
      },
      {
        "url" : "value",
        "valueString" : "2026+"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "releaselabel"
      },
      {
        "url" : "value",
        "valueString" : "ci-build"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "autoload-resources"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-liquid"
      },
      {
        "url" : "value",
        "valueString" : "template/liquid"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-liquid"
      },
      {
        "url" : "value",
        "valueString" : "input/liquid"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-qa"
      },
      {
        "url" : "value",
        "valueString" : "temp/qa"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-temp"
      },
      {
        "url" : "value",
        "valueString" : "temp/pages"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-output"
      },
      {
        "url" : "value",
        "valueString" : "output"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-suppressed-warnings"
      },
      {
        "url" : "value",
        "valueString" : "input/ignoreWarnings.txt"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "path-history"
      },
      {
        "url" : "value",
        "valueString" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/history.html"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "template-html"
      },
      {
        "url" : "value",
        "valueString" : "template-page.html"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "template-md"
      },
      {
        "url" : "value",
        "valueString" : "template-page-md.html"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-contact"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-context"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-copyright"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-jurisdiction"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-license"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-publisher"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-version"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "apply-wg"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "active-tables"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "fmm-definition"
      },
      {
        "url" : "value",
        "valueString" : "http://hl7.org/fhir/versions.html#maturity"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "propagate-status"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "excludelogbinaryformat"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueString" : "tabbed-snapshots"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-internal-dependency",
      "valueCode" : "hl7.fhir.uv.tools.r4#1.1.2"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "copyrightyear"
      },
      {
        "url" : "value",
        "valueString" : "2026+"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "releaselabel"
      },
      {
        "url" : "value",
        "valueString" : "ci-build"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "autoload-resources"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-liquid"
      },
      {
        "url" : "value",
        "valueString" : "template/liquid"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-liquid"
      },
      {
        "url" : "value",
        "valueString" : "input/liquid"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-qa"
      },
      {
        "url" : "value",
        "valueString" : "temp/qa"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-temp"
      },
      {
        "url" : "value",
        "valueString" : "temp/pages"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-output"
      },
      {
        "url" : "value",
        "valueString" : "output"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-suppressed-warnings"
      },
      {
        "url" : "value",
        "valueString" : "input/ignoreWarnings.txt"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "path-history"
      },
      {
        "url" : "value",
        "valueString" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/history.html"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "template-html"
      },
      {
        "url" : "value",
        "valueString" : "template-page.html"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "template-md"
      },
      {
        "url" : "value",
        "valueString" : "template-page-md.html"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-contact"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-context"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-copyright"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-jurisdiction"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-license"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-publisher"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-version"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "apply-wg"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "active-tables"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "fmm-definition"
      },
      {
        "url" : "value",
        "valueString" : "http://hl7.org/fhir/versions.html#maturity"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "propagate-status"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "excludelogbinaryformat"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    },
    {
      "extension" : [{
        "url" : "code",
        "valueCode" : "tabbed-snapshots"
      },
      {
        "url" : "value",
        "valueString" : "true"
      }],
      "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-parameter"
    }],
    "resource" : [{
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "ValueSet"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "ValueSet-aspiration-risk-value-vs.html"
      }],
      "reference" : {
        "reference" : "ValueSet/aspiration-risk-value-vs"
      },
      "name" : "Aspiration Event Qualifier",
      "description" : "Optional qualifier for the Aspiration Risk Flag: the observed aspiration event on which the risk determination was based (pulmonary aspiration; silent aspiration as a proposed temporary local code). Does NOT include the at-risk finding itself, which is carried in Observation.code.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "StructureDefinition:resource"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "StructureDefinition-aspiration-risk-flag.html"
      }],
      "reference" : {
        "reference" : "StructureDefinition/aspiration-risk-flag"
      },
      "name" : "Aspiration Risk Flag",
      "description" : "Patient-level aspiration-risk finding — the minimal, most safety-critical element carried across transitions. The at-risk-for-aspiration finding is asserted by `Observation.code`; the mere PRESENCE of a final instance is the datum the care-transition consistency rule consumes (the rule does not read the value). Status is fixed to final so that every conformant instance is visible to the rule (the rule accepts final|amended, a superset), closing the profile↔rule gap. An optional qualifier value may record the observed aspiration event on which the risk determination was based.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "StructureDefinition:resource"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "StructureDefinition-dysphagia-care-transition-summary.html"
      }],
      "reference" : {
        "reference" : "StructureDefinition/dysphagia-care-transition-summary"
      },
      "name" : "Dysphagia Care-Transition Summary",
      "description" : "Composition bundling swallowing assessment + severity + aspiration risk + IDDSI diet + precautions for a stroke care transition.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "StructureDefinition:resource"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "StructureDefinition-dysphagia-nutrition-order.html"
      }],
      "reference" : {
        "reference" : "StructureDefinition/dysphagia-nutrition-order"
      },
      "name" : "Dysphagia Nutrition Order (IDDSI-bound)",
      "description" : "NutritionOrder constrained to bind IDDSI levels (extensible) — base FHIR only binds these 'example'.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "CodeSystem"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "CodeSystem-dysphagia-scales-temp.html"
      }],
      "reference" : {
        "reference" : "CodeSystem/dysphagia-scales-temp"
      },
      "name" : "Dysphagia Scales — temporary local codes (proposed for LOINC/SNOMED)",
      "description" : "Placeholder codes for validated dysphagia measures lacking terminology representation. To be submitted upstream.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "StructureDefinition:resource"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "StructureDefinition-dysphagia-severity.html"
      }],
      "reference" : {
        "reference" : "StructureDefinition/dysphagia-severity"
      },
      "name" : "Dysphagia Severity",
      "description" : "Overall severity / oral-intake level (FOIS, DIGEST, or IDDSI FDS).",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "ValueSet"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "ValueSet-dysphagia-severity-type-vs.html"
      }],
      "reference" : {
        "reference" : "ValueSet/dysphagia-severity-type-vs"
      },
      "name" : "Dysphagia Severity / Oral-Intake Scale Type",
      "description" : "Overall dysphagia severity / functional oral-intake measures (DOSS + IDDSI Functional Diet Scale reused from SNOMED; FOIS, DIGEST as temporary local codes pending LOINC/SNOMED submission).",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Observation"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Observation-ex-aspiration-risk.html"
      }],
      "reference" : {
        "reference" : "Observation/ex-aspiration-risk"
      },
      "name" : "Example — aspiration risk present (synthetic)",
      "exampleCanonical" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/aspiration-risk-flag"
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Composition"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Composition-ex-care-transition-summary.html"
      }],
      "reference" : {
        "reference" : "Composition/ex-care-transition-summary"
      },
      "name" : "Example — dysphagia care-transition summary bundling the transfer package (synthetic)",
      "exampleCanonical" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-care-transition-summary"
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Observation"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Observation-ex-dysphagia-severity.html"
      }],
      "reference" : {
        "reference" : "Observation/ex-dysphagia-severity"
      },
      "name" : "Example — FOIS functional oral-intake level (synthetic)",
      "exampleCanonical" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-severity"
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Observation"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Observation-ex-swallow-screening.html"
      }],
      "reference" : {
        "reference" : "Observation/ex-swallow-screening"
      },
      "name" : "Example — GUSS bedside screening result (synthetic)",
      "exampleCanonical" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/swallowing-screening-result"
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "NutritionOrder"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "NutritionOrder-ex-dysphagia-diet.html"
      }],
      "reference" : {
        "reference" : "NutritionOrder/ex-dysphagia-diet"
      },
      "name" : "Example — IDDSI Level 5 diet + mildly thick fluids (synthetic)",
      "exampleCanonical" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/dysphagia-nutrition-order"
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Organization"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Organization-ex-org.html"
      }],
      "reference" : {
        "reference" : "Organization/ex-org"
      },
      "name" : "Example — synthetic rehabilitation service (Composition author)",
      "exampleBoolean" : true
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Patient"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Patient-ex-patient.html"
      }],
      "reference" : {
        "reference" : "Patient/ex-patient"
      },
      "name" : "Example — synthetic stroke patient (no real data)",
      "exampleBoolean" : true
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "Observation"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "Observation-ex-instrumental-swallow.html"
      }],
      "reference" : {
        "reference" : "Observation/ex-instrumental-swallow"
      },
      "name" : "Example — VFSS with Penetration-Aspiration Scale (synthetic)",
      "exampleCanonical" : "https://sefatuncer.github.io/stroke-dysphagia-fhir-ig/StructureDefinition/instrumental-swallow-assessment"
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "ValueSet"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "ValueSet-iddsi-fluid-levels.html"
      }],
      "reference" : {
        "reference" : "ValueSet/iddsi-fluid-levels"
      },
      "name" : "IDDSI Drink/Fluid Consistency Levels (SNOMED CT)",
      "description" : "IDDSI drink-axis consistency levels 0–4 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.fluidConsistencyType. Level 3 is the transitional Moderately Thick concept shared with the food axis.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "ValueSet"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "ValueSet-iddsi-food-levels.html"
      }],
      "reference" : {
        "reference" : "ValueSet/iddsi-food-levels"
      },
      "name" : "IDDSI Food Texture Levels (SNOMED CT)",
      "description" : "IDDSI food-axis texture levels 4–7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "StructureDefinition:resource"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "StructureDefinition-instrumental-swallow-assessment.html"
      }],
      "reference" : {
        "reference" : "StructureDefinition/instrumental-swallow-assessment"
      },
      "name" : "Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale",
      "description" : "VFSS/FEES result incl. PAS (Rosenbek). PAS lacks LOINC/SNOMED → temp code; proposed upstream.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "ValueSet"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "ValueSet-instrumental-swallow-type-vs.html"
      }],
      "reference" : {
        "reference" : "ValueSet/instrumental-swallow-type-vs"
      },
      "name" : "Instrumental Swallow Assessment Type",
      "description" : "Instrumental swallowing assessments (VFSS/FEES) and associated graded scales (PAS, Yale residue) — SNOMED/LOINC where coded, temporary local codes otherwise.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "StructureDefinition:resource"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "StructureDefinition-swallowing-screening-result.html"
      }],
      "reference" : {
        "reference" : "StructureDefinition/swallowing-screening-result"
      },
      "name" : "Swallowing Screening Result",
      "description" : "Bedside dysphagia screening (GUSS/EAT-10/TOR-BSST). GUSS reuses SNOMED 1289999007.",
      "exampleBoolean" : false
    },
    {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/resource-information",
        "valueString" : "ValueSet"
      },
      {
        "url" : "http://hl7.org/fhir/StructureDefinition/implementationguide-page",
        "valueUri" : "ValueSet-swallow-screening-type-vs.html"
      }],
      "reference" : {
        "reference" : "ValueSet/swallow-screening-type-vs"
      },
      "name" : "Swallowing Screening Type",
      "description" : "Bedside swallowing screening instruments (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; EAT-10 / TOR-BSST as temporary local codes pending LOINC/SNOMED submission).",
      "exampleBoolean" : false
    }],
    "page" : {
      "extension" : [{
        "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-page-name",
        "valueUrl" : "toc.html"
      }],
      "nameUrl" : "toc.html",
      "title" : "Table of Contents",
      "generation" : "html",
      "page" : [{
        "extension" : [{
          "url" : "http://hl7.org/fhir/tools/StructureDefinition/ig-page-name",
          "valueUrl" : "index.html"
        }],
        "nameUrl" : "index.html",
        "title" : "Home",
        "generation" : "markdown"
      }]
    },
    "parameter" : [{
      "code" : "path-resource",
      "value" : "input/capabilities"
    },
    {
      "code" : "path-resource",
      "value" : "input/examples"
    },
    {
      "code" : "path-resource",
      "value" : "input/extensions"
    },
    {
      "code" : "path-resource",
      "value" : "input/models"
    },
    {
      "code" : "path-resource",
      "value" : "input/operations"
    },
    {
      "code" : "path-resource",
      "value" : "input/profiles"
    },
    {
      "code" : "path-resource",
      "value" : "input/resources"
    },
    {
      "code" : "path-resource",
      "value" : "input/vocabulary"
    },
    {
      "code" : "path-resource",
      "value" : "input/maps"
    },
    {
      "code" : "path-resource",
      "value" : "input/testing"
    },
    {
      "code" : "path-resource",
      "value" : "input/history"
    },
    {
      "code" : "path-resource",
      "value" : "fsh-generated/resources"
    },
    {
      "code" : "path-pages",
      "value" : "template/config"
    },
    {
      "code" : "path-pages",
      "value" : "input/images"
    },
    {
      "code" : "path-tx-cache",
      "value" : "input-cache/txcache"
    }]
  }
}

```
