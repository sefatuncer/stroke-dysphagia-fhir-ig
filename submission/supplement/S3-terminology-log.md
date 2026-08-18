# Supplementary File S3 — Terminology coverage log

Companion to §3.2 (*Structured terminology-coverage assessment*) and §4.1 / Table 2.
This log records, per measure, how coverage was established, what the terminology server returned, and how the item was classified.

---

## 1. Method

| Item | Value |
|---|---|
| Terminology server | HL7 reference server **tx.fhir.org** |
| SNOMED CT edition | International Edition **20250201** (confirmed in the server response, not assumed) |
| LOINC version | **v2.82** |
| Operations used | `$lookup` for code confirmation; `$expand` with sequential text filters over `http://loinc.org/vs` and `http://snomed.info/sct?fhir_vs` for absence testing |
| Supplementary absence check | SNOMED hierarchy inspection under *assessment scale* (`273249006`) and the relevant finding parents, plus an explicit check for a plausible pre-coordinated concept |
| Primary access date | **16 July 2026** |
| Verification round | **28 July 2026** (§5 below) |

**Classification rule (fixed before the survey):**

- **reuse** — a pre-coordinated code exists and denotes the instrument/concept itself.
- **partial** — the scale concept exists but no coded answer set / level codes exist.
- **gap** — no pre-coordinated code; a post-coordinated expression may still be constructible. Such items were recorded as *gap*, not *reuse*, because the IG requires a bindable pre-coordinated concept.

**Note on filter strings.** The survey was run interactively; the *terms* used for each item are recorded below, but a verbatim transcript of every `$expand` URL was not retained. Where absence is claimed, the item was additionally checked by hierarchy enumeration (§5), which does not depend on display-string matching.

**Positive controls.** GUSS, Yale/3-oz, VFSS, FEES, the IDDSI levels, and the four core findings all resolved on the first filter, confirming that the method detects codes that are present. This does not exclude the possibility of missing a code stored under an unexpected display, which is the limitation stated in §5.3.

---

## 2. Item-by-item log

### 2.1 Screening (bedside tests and patient-reported symptom screens)

> **Classification note.** GUSS, Yale/3-oz, TOR-BSST and V-VST are clinician-administered bedside swallow tests. EAT-10 is a **patient-reported symptom-severity questionnaire** used for screening rather than a bedside test, and its applicability in acute stroke is limited by aphasia and cognitive impairment. It is grouped here by screening *purpose*, not by administration mode.


| Measure | Filter terms used | LOINC | SNOMED CT | Classification |
|---|---|---|---|---|
| GUSS (Gugging Swallowing Screen) | "gugging", "GUSS", "swallowing screen" | none | **1289999007** *Gugging Swallowing Screen (assessment scale)* | **reuse** |
| Yale Swallow Protocol / 3-oz water swallow test | "yale", "3 oz", "water swallow" | none | **717684008** *Yale Swallow Protocol (assessment scale)*; score **716854005** | **reuse** |
| EAT-10 (Eating Assessment Tool-10) — *patient-reported* | "EAT-10", "eating assessment" | none | none | **gap** |
| TOR-BSST | "TOR-BSST", "Toronto bedside", "bedside swallowing screening" | none | none | **gap** |
| V-VST (Volume-Viscosity Swallow Test) | "V-VST", "volume viscosity", "viscosity swallow" | none | none | **gap** |
| Generic/timed water swallow test | "water swallow test", "timed water" | none | no generic concept (3-oz maps to Yale `717684008`) | surveyed; **outside the 22-item denominator** (§3) |

### 2.2 Functional oral intake / overall severity

| Measure | Filter terms used | LOINC | SNOMED CT | Classification |
|---|---|---|---|---|
| FOIS (Functional Oral Intake Scale) | "FOIS", "functional oral intake" | none | none | **gap** |
| DOSS (Dysphagia Outcome and Severity Scale) | "DOSS", "dysphagia outcome" | none | **767131006** *Dysphagia Outcome and Severity Scale (assessment scale)* | **partial** → reported under *reuse* (see §3) |
| IDDSI-FDS (Functional Diet Scale) | "IDDSI", "functional diet scale" | none | **1231505003** *IDDSI Functional Diet Scale (assessment scale)*; score **1231507006** | **reuse** |
| ASHA-NOMS FCM-Swallowing panel | "ASHA", "NOMS", "FCM swallowing" | **99852-6** *FCM - Swallowing panel [ASHA NOMS]* (+ 6 members) | not in SNOMED (LOINC-native) | **reuse** (see instrument-invariance note, §4.1) |

### 2.3 Instrumental assessment and ordinal grading scales

| Measure | Filter terms used | LOINC | SNOMED CT | Classification |
|---|---|---|---|---|
| VFSS (videofluoroscopic swallow study) | "videofluoroscopy", "barium swallow", "swallowing function" | **24681-9** (general RF videography); **86395-1** (swallowing-specific, with barium contrast PO) | **241149003** *Videofluoroscopy swallow (procedure)* | **reuse** |
| FEES | "FEES", "fiberoptic endoscopic evaluation" | none | **311834001** *Fibreoptic endoscopic evaluation of swallowing* (SNOMED's own British spelling, reproduced verbatim); FEEST **870569005** | **reuse** (procedure coded; no LOINC observation code) |
| PAS (Penetration-Aspiration Scale, 1–8) | "penetration aspiration", "Rosenbek", "aspiration scale" | none | none (neither the scale nor an ordinal answer set) | **gap** |
| DIGEST (grade 0–4) | "DIGEST", "swallowing toxicity" | none | none | **gap** |
| Yale Pharyngeal Residue Severity Rating | "pharyngeal residue", "residue severity" | none | none | **gap** |
| MBSImP | "MBSImP", "modified barium swallow impairment" | none | none (only the general `168821007` *Barium swallow*) | **gap** (proprietary; encoding constrained by licensing) |

> **Disambiguation.** SNOMED `717684008` *Yale Swallow Protocol* is the 3-oz **screening** test (§2.1, coded). The **Yale Pharyngeal Residue Severity Rating Scale** in this section is a distinct instrumental **residue** scale and is **not** coded. The two must not be conflated.

### 2.4 Diet / consistency and core clinical findings

**IDDSI framework — all 10 SNOMED concepts confirmed active by `$lookup`:**

| Level | SNOMED | Concept | Axis assignment in the IG |
|---|---|---|---|
| 0 | `1231508001` | Thin | drink |
| 1 | `1237441005` | Slightly Thick | drink |
| 2 | `1237442003` | Mildly Thick | drink |
| 3 | `1237444002` | Moderately Thick | drink |
| 4 | `1237446000` | Extremely Thick | drink |
| 4 | `1237447009` | Pureed | food |
| 5 | `1237448004` | Minced and Moist | food |
| 6 | `1237449007` | Soft and Bite-sized | food |
| 7 | `1237450007` | Easy to Chew | food |
| 7 | `1237451006` | Regular | food |

**Arithmetic of the two value sets (this resolves an apparent discrepancy).** The drink axis enumerates 5 concepts (Levels 0–4) and the food axis enumerates 5 concepts (Levels 4–7), giving **10 with no overlap**: IDDSI Level 4 has **two distinct SNOMED concepts**, one per axis (`1237446000` Extremely Thick for drinks, `1237447009` Pureed for foods), and Level 7 likewise has two variants (Easy to Chew, Regular). The two **value sets** therefore share no concept.

**Level 3 on the food axis.** In the IDDSI framework the food axis spans Levels 3–7 (Level 3 = *Liquidised*). SNOMED CT 20250201 carries **one** Level-3 concept, `1237444002` *Moderately Thick*, which IDDSI treats as the transitional level shared by both axes: the same concept is *Moderately Thick* as a drink and *Liquidised* as a food. There is no separate pre-coordinated concept for Liquidised food.

The food value set enumerates Levels 4–7 and therefore does **not** list `1237444002`. This is an editorial decision, not a terminology constraint: the shared concept could have been enumerated on both axes. It was left out to keep each value set on one side of the transition, and Level-3 food is reached through the extensible binding instead. The trade-off is recorded in §5.3, and the axis invariants (§3.3) are written over the enumerated axis codes, so a Level-3 order is not rejected by them.

**Is there an official IDDSI FHIR value set?** No. FHIR core `consistency-type` contains only four legacy NDD codes (honey/nectar/spoon-thick/thin) at *example* binding strength; PACIO PFE `pfe-nutrition-order` binds the diet elements to the FHIR core value sets and does not use the newer IDDSI SNOMED concepts; the SNOMED NCPT IG does not define value sets for IDDSI levels. The contribution is therefore **a bindable value set and binding, not new terminology** — the SNOMED concepts already exist (SNOMED–IDDSI agreement, 2022).

**Core clinical findings — SNOMED CT 20250201:**

| Concept | SNOMED | Status |
|---|---|---|
| At risk for aspiration | `371736008` | active — **reuse** (IG aspiration flag) |
| Pulmonary aspiration | `68052005` | active — **reuse** |
| Dysphagia | `40739000` | active — **reuse** |
| Nil by mouth | `182923009` | active — **reuse** |
| Silent aspiration | — | **gap** — no pre-coordinated concept (bidirectional search). Related but non-equivalent: `1345161005` *Aspiration of food into larynx*, `10269001` *Massive aspiration syndrome*. Expressible only post-coordinately (e.g., `68052005` + qualifier). |
| Laryngeal penetration | — | **gap** — no pre-coordinated concept; expressible only post-coordinately |

---

## 3. Summary of classifications

**reuse (12):** GUSS · Yale/3-oz Swallow Protocol (+score) · VFSS (SNOMED + LOINC) · FEES · DOSS · ASHA-NOMS FCM-Swallowing panel · IDDSI-FDS (+score) · IDDSI framework (10 concepts, counted as a single diet/consistency entry) · at-risk-for-aspiration · pulmonary aspiration · dysphagia · nil by mouth.

**gap (10):** FOIS · EAT-10 · TOR-BSST · V-VST · PAS · DIGEST · Yale Pharyngeal Residue · MBSImP (proprietary) · silent aspiration · laryngeal penetration.

**Denominator (22 items):** 15 instruments/procedures + 6 finding-level concepts (four coded, two gaps) + the IDDSI framework as a single diet/consistency entry.

**Sensitivity of the 12/10 split to the counting rule.** The denominator counts one entry per *measure to be represented*, which is why the IDDSI framework — 10 SNOMED concepts spanning two axes — is one entry, exactly as GUSS is one entry rather than one per score band. Two alternative rules change the headline without changing any classification: counting each IDDSI concept separately gives 21/10 of 31 (coverage looks better), and adding CMS Eating gives 13/10 of 23 (also better). Of the three, the rule used here yields the largest gap share (10 of 22, 45.5%; the alternatives give 32.3% and 43.5%), so it is the most favourable to the contribution — as §5.3-18 of the manuscript states. It was fixed before the survey, and both alternatives are reported here so that the reader can apply either denominator. Two entries in the gap column carry caveats that the count alone does not show: EAT-10 is a patient-reported symptom questionnaire rather than a bedside test and is not bound by any profile, and MBSImP is proprietary, so an upstream submission is realistic for eight of the ten rather than all ten.

### The *partial* class

§3.2 defines three classes, but Table 2 reports two. This is deliberate and is recorded here rather than left implicit:

- **DOSS** meets the *partial* definition exactly — the scale concept is coded (`767131006`) but **no coded level answer set exists**. It is reported under *reuse* in Table 2 because the IG binds the scale concept itself; the missing answer set is a candidate for an upstream answer-list submission and is listed as such in the submission plan.
- **FEES** is partial in a different sense: the SNOMED procedure concept exists (`311834001`) but there is no LOINC observation/report code. It is reported under *reuse* because the element the IG binds (the procedure) is coded.

No other item met the definition. The two cases above are the reason the *partial* column does not appear in Table 2; where an item is coded at the level the IG actually binds, it is counted as *reuse*, and the residual gap (answer set, or a second code system) is recorded here.

### Surveyed but outside the 22-item denominator

Two measures were examined during the survey and are **not** part of the 22-item denominator, because they are not care-critical elements of the transfer set:

| Measure | Finding | Why excluded from the denominator |
|---|---|---|
| CMS Eating self-performance | **LOINC 45602-0** *Eating - self-performance [CMS]* exists | An ADL/assistance measure, not a dysphagia-severity scale; catalogued as a functionally overlapping coded neighbour (§4.1) |
| Generic / timed water swallow test | No generic concept; the 3-oz form maps to Yale `717684008` | Not a distinct validated instrument in the transfer set; the coded 3-oz form is already counted |

---

## 4. Item selection

Measures were included if they (a) are referenced by the two anchor guidelines used for the clinical content model (AHA/ASA acute ischemic stroke; ESO–ESSD post-stroke dysphagia), or (b) are validated instruments whose output is a care-critical element of the stroke care-transition data set (screening result, instrumental grading, severity/functional oral intake, aspiration-risk status, diet/fluid consistency), or (c) are coded neighbours *of the elements this IG binds* that a coverage assessment must account for (ASHA-NOMS, IDDSI-FDS). CMS Eating (LOINC 45602-0) meets criterion (c) read broadly but was left out: it scores a self-care activity of daily living, not a swallowing or diet-consistency element, so no profile in this IG could bind it. Because it is coded, including it would move the split from 12/10 of 22 to 13/10 of 23 — that is, it would make the coverage look *better*, not worse; the exclusion is recorded here so the reader can apply either denominator.

Instruments used chiefly for quality-of-life or symptom burden rather than care-transition transfer (e.g., SWAL-QOL), and instruments outside the stroke setting whose coverage does not bear on this transfer, were not surveyed. DIGEST and MBSImP are surveyed for completeness although they originate outside stroke care; this is stated in §3.1.

---

## 5. Verification round (28 July 2026)

SNOMED CT moved to a monthly International Edition release cadence during this work. The classifications were therefore re-checked against a later edition using a **stronger method than the original text filters**: hierarchy-constrained `$expand` enumeration under *assessment scale* (`273249006`), *observable entity* (`363787002`), *clinical finding* (`404684003`), and the SNOMED root, which removes the false-negative risk of display-string matching.

| Check | Result |
|---|---|
| Later SNOMED edition available on tx.fhir.org | US Edition 20250901 and a national edition carrying International content to 2026-03 |
| LOINC current version | v2.82 remained current (next scheduled release later in 2026) |
| All codes underlying the 12 *reuse* items still active | **Yes** — no inactivations, no display changes affecting the bindings |
| Any of the 10 gaps filled | **No** — enumeration under the assessment-scale and finding hierarchies returned no concept for FOIS, PAS, DIGEST, EAT-10, TOR-BSST, V-VST, Yale Pharyngeal Residue, MBSImP, silent aspiration, or laryngeal penetration |
| SNOMED 2026 release notes | No swallowing/dysphagia-related concept additions identified |

**Conclusion:** no coverage classification changed. This is reported in §3.2.

---

## 6. Limitations

1. **Second reference server — now obtained.** The original queries were all run against
   tx.fhir.org, so every coverage call in this log once shared one server's view of the two
   terminologies. That is no longer the case: a second, independently operated server has since
   confirmed every call (§7). The earlier failed attempts are kept below rather than deleted,
   because they record which endpoints are and are not reachable without member credentials:

   | Endpoint | Attempted | Result |
   |---|---|---|
   | `browser.ihtsdotools.org/snowstorm/snomed-ct` (SNOMED International) | 13 Aug 2026 | HTTP 302 → "SNOMED International Access Denied" |
   | `snowstorm.ihtsdotools.org/fhir` (SNOMED International FHIR endpoint) | 13 Aug 2026 | HTTP 302 → "SNOMED International Access Denied" |
   | `r4.ontoserver.csiro.au/fhir` and `tx.ontoserver.csiro.au/fhir` (CSIRO Ontoserver) | 13 Aug 2026 | connection failed (no response) |
   | `fhir.loinc.org` (`$lookup`) | 13 Aug 2026 | HTTP 401 — account credentials required |

   What survives after §7 is narrower and is stated in the manuscript (§5.3-5): a code recorded
   under an unexpected display could in principle still be missed by text-filter testing on
   either server, and neither server is the SNOMED browser itself.
2. **Display-string dependence of the original round.** Text-filter absence testing can miss a code recorded under an unexpected display. The 28 July hierarchy enumeration (§5) mitigates but does not wholly eliminate this.
3. **Consensus classification.** Items were classified jointly by the two authors rather than independently double-coded, so no inter-rater agreement statistic is available; borderline pre-/post-coordination decisions were adjudicated internally, without an independent terminologist.
4. **Direction of incentive.** Classifying an item as *gap* contributes to the paper's stated contribution. The classification rule was fixed before the survey (§1) to constrain this, but no external adjudication was obtained.

---

## 7. Independent cross-check on a second terminology server

Every coverage call in this log was re-tested on a server that shares no implementation with
tx.fhir.org: the New Zealand national terminology service, which runs CSIRO Ontoserver. It
differs from the original endpoint in three independent ways at once — different software,
a national edition of SNOMED CT rather than the International Edition alone, and a release
(20260720) considerably later than the 20250201 edition the original round used.

The national extension is also the reason presence is not enough on its own. A concept that
exists only in a national extension would be no evidence that the International Edition
carries it, so each resolved concept's **module of origin** was read back and checked: a
concept outside the International core module is reported as `EXTENSION-ONLY`, never as
confirming a reuse call.

Absence needs a second guard. Each of the ten absence calls was probed with several
independent filter terms, and a lexical hit counts as a candidate only if its display carries
swallowing-domain vocabulary — the screening rule was fixed before the run, and screened-out
hits are kept in the machine-readable record rather than discarded. This mattered exactly
once: the acronym `DIGEST` matched thirty digestion-related concepts (*Digestant*, *Digestive
biscuit*, *Digestive tract structure* …), none of them the Dynamic Imaging Grade of Swallowing
Toxicity scale, while the two specific terms (`Dynamic Imaging Grade`, `swallowing toxicity`)
returned nothing at all. Three positive controls had to resolve before any absence was
reported, and all three did.

| Check | Result |
|---|---|
| Concepts re-tested | **26/26 confirmed** — the 24 reuse codes of Table 2, plus the cohort criterion (`230690007`) and the hierarchy anchor (`273249006`) used in the absence testing |
| Of those, from the SNOMED International core module | **23/23 SNOMED concepts** (the remaining three are LOINC, which has no module) |
| Any concept inactive on the later edition | **None** |
| Any concept present only in the national extension | **None** |
| Absence calls re-tested | **10/10 reproduced** |
| Positive controls resolved | **3/3** |

**Conclusion:** the second server reproduces the coverage assessment in full, on a later
edition and on software sharing no code with the first. Reported in §3.2 and §4.1 of the
manuscript; the run record, including every screened-out lexical hit, is deposited.
