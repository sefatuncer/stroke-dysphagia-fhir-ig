# Supplementary File S6 â€” Terminology license inventory

The manuscript states that this work references terminology identifiers rather than
redistributing terminology content. That claim is only auditable if the reader can see
*exactly* which third-party concepts the deposited artifact carries and which of them
travel with an English display term. This file is that list. It is complete: it was
extracted from the artifact source, not summarized from memory, and it covers the
Implementation Guide (profiles, value sets, code system, example instances) **and** the
evaluation code.

Source of truth: `ig/input/fsh/dysphagia-ct.fsh` and `ig/evaluation/cql-src/`, at IG
v1.1.1, commit `eb37ea6`. Codes were verified against SNOMED CT International Edition
20250201 and LOINC v2.82 on the access dates recorded in Supplementary File S3.

## 1. Summary

| | Concepts carried | Of which carry a display term |
|---|---|---|
| SNOMED CT | 18 | 10 |
| LOINC | 3 | 1 |
| Local (`dysphagia-scales-temp`, minted here, MIT) | 7 | 7 (our own text) |

The seven display terms reported in the manuscript's Data and Code Availability
statement are the seven that appear **in value sets**. Three further SNOMED display
terms and one LOINC display term appear in the **example instances**, which are
illustrative resources rather than conformance artifacts. All eleven are itemized below
so the count is not left to inference.

## 2. SNOMED CT concepts

### 2.1 IDDSI drink axis â€” `IDDSIFluidLevels` value set (no display terms)

| Code | IDDSI level | Display carried? |
|---|---|---|
| 1231508001 | Thin (Level 0) | no |
| 1237441005 | Slightly Thick (Level 1) | no |
| 1237442003 | Mildly Thick (Level 2) | no |
| 1237444002 | Moderately Thick (Level 3) | no |
| 1237446000 | Extremely Thick (Level 4, fluids) | no |

### 2.2 IDDSI food axis â€” `IDDSIFoodLevels` value set (no display terms)

| Code | IDDSI level | Display carried? |
|---|---|---|
| 1237447009 | Pureed (Level 4, foods) | no |
| 1237448004 | Minced & Moist (Level 5) | no |
| 1237449007 | Soft & Bite-sized (Level 6) | no |
| 1237450007 | Easy to Chew (Level 7) | no |
| 1237451006 | Regular (Level 7) | no |

The IDDSI level names in the middle column above are **descriptive labels in this
supplement**, not strings distributed by the artifact. The value sets themselves carry
identifiers only, so a terminology server supplies the authoritative term at expansion.

### 2.3 Assessment and finding concepts in value sets (display terms carried)

| Code | Display term carried (verbatim) | Value set |
|---|---|---|
| 1289999007 | `Gugging swallowing screen` | `SwallowScreeningTypeVS` |
| 717684008 | `Yale Swallow Protocol` | `SwallowScreeningTypeVS` |
| 241149003 | `Videofluoroscopy swallow` | `InstrumentalSwallowTypeVS` |
| 311834001 | `Fibreoptic endoscopic evaluation of swallowing` | `InstrumentalSwallowTypeVS` |
| 767131006 | `Dysphagia Outcome and Severity Scale` | `DysphagiaSeverityTypeVS` |
| 1231505003 | `International Dysphagia Diet Standardisation Initiative Functional Diet Scale` | `DysphagiaSeverityTypeVS` |
| 68052005 | `Pulmonary aspiration` | `AspirationRiskValueVS` |

These seven are the display terms referred to in the manuscript. Each is the unmodified
English term of the International Edition; none is translated, abbreviated or edited.

### 2.4 Concepts fixed in a profile (no display term)

| Code | Element | Display carried? |
|---|---|---|
| 371736008 | `AspirationRiskFlag.code.coding.code` | **no** â€” deliberately excluded from the pattern, so a conformant instance may carry a localized or edition-current term |

### 2.5 Concepts in example instances (display terms carried)

| Code | Display term carried (verbatim) | Instance |
|---|---|---|
| 371736008 | `At risk for aspiration` | `ex-aspiration-risk` |
| 1237448004 | `International Dysphagia Diet Standardisation Initiative Framework - Minced and Moist Level 5` | `ex-dysphagia-diet` |
| 1237442003 | `International Dysphagia Diet Standardisation Initiative Framework - Mildly Thick Level 2` | `ex-dysphagia-diet` |
| 1289999007 | `Gugging swallowing screen` | `ex-swallow-screening` |
| 241149003 | `Videofluoroscopy swallow` | `ex-instrumental-swallow` |

The two IDDSI strings here are the **SNOMED CT** terms for the SNOMED-embedded IDDSI
concepts. They are not text taken from an IDDSI publication.

### 2.6 Concepts referenced in the evaluation code (identifiers only)

`ig/evaluation/cql-src/AspirationRiskAlert.cql` and the cohort generator match on bare
identifiers with no display term: 371736008 (at risk for aspiration), 1231508001 (thin,
IDDSI Level 0), 182923009 (nil by mouth), 230690007 (cerebrovascular accident). One
further code, 40739000 (dysphagia), appears only in a negative conformance fixture as a
deliberately wrong value.

## 3. LOINC codes

| Code | Where | Display carried? |
|---|---|---|
| 24681-9 | `InstrumentalSwallowTypeVS` | no |
| 86395-1 | `InstrumentalSwallowTypeVS` | no |
| 34133-9 | `DysphagiaCareTransitionSummary.type` (fixed) | no |
| 34133-9 | `ex-care-transition-summary` | yes â€” `Summary of episode note` |

LOINC 99852-6 (FCMâ€“Swallowing panel, ASHA NOMS) is discussed in the manuscript as an
existing coded instrument but is **not** carried by any artifact.

## 4. Local codes (ours, MIT)

`dysphagia-scales-temp` holds seven temporary identifiers minted for this work, for
instruments that lack terminology representation: `PAS`, `FOIS`, `EAT-10`, `DIGEST`,
`TOR-BSST`, `YALE-RESIDUE`, `SILENT-ASPIRATION`. Their display strings are ours and are
released under the MIT License. They name validated instruments whose own copyright
rests with their developers; **no instrument content, item text or scoring rule is
reproduced**. The code system is marked `experimental` and `draft` and is intended for
retirement once equivalent concepts exist upstream.

## 5. License basis

**SNOMED CT.** The artifact carries concept identifiers and, for the ten concepts listed
in Â§2.3 and Â§2.5, the unmodified English preferred term. It redistributes no SNOMED CT
release, national extension, or semantic content â€” no relationships, hierarchies,
reference sets, or subsets beyond the enumerated value-set membership the authors defined
themselves. The authors' territory is not a SNOMED International Member territory; the
publication basis relied on is the **Global Patient Set (GPS)**, published worldwide at
no cost under **CC BY-ND 4.0**, which SNOMED International states does not require SNOMED
CT membership or an Affiliate License.

- *Attribution (BY).* SNOMED CTÂ® is a registered trademark of SNOMED International.
  Concept identifiers and English terms are Â© SNOMED International, used under the GPS
  License. This notice also appears in the `copyright` element of every artifact that
  carries a SNOMED concept.
- *No derivatives (ND).* Every display string in Â§2.3 and Â§2.5 is reproduced verbatim as
  returned by the HL7 reference terminology server; none is translated, shortened or
  otherwise altered. Selecting a subset of concepts for a value set is not a modification
  of the terms themselves.
- The authors have not individually re-verified GPS membership for each concept against a
  GPS release file; the per-concept list above is provided precisely so that a licensor or
  reviewer can perform that check directly.

**LOINC.** Three LOINC codes are carried, one with its name (Â§3). These are distributed by
the authors, not merely referenced by implementers, and are used under the terms of the
LOINC License (Regenstrief Institute, Inc.). LOINCÂ® is a registered trademark of
Regenstrief Institute, Inc. The notice appears in the `copyright` element of each artifact
that carries a LOINC code. Implementers deploying LOINC content remain bound by the same
license.

**IDDSI.** The IDDSI framework is used unmodified under **CC BY-SA 4.0**. The artifact
carries no IDDSI document text, table, image or testing method. What it carries are the
SNOMED CT concepts into which SNOMED International embedded the framework, plus a
two-axis value-set partition and two FHIRPath invariants that are the authors' own work
and are MIT-licensed.

**This work.** All artifacts authored here â€” profiles, invariants, value-set definitions,
the local code system, the CQL library, harnesses, generators and pipelines â€” are released
under the **MIT License**. That license covers only this work and neither extends to nor
relicenses any third-party terminology.

## 6. What a deploying implementer still needs

Publishing this specification is not the same as deploying a system that contains SNOMED
CT. An implementer remains responsible for obtaining a SNOMED CT Affiliate or Member
License in their own territory before deploying a system containing SNOMED CT itself, for
their own use of LOINC under the LOINC License, and for observing the IDDSI framework's
CC BY-SA terms.

