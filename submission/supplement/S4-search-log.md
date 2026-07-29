# Supplementary File S4 — Artifact and literature search log

Companion to §3.4 (*Standards alignment*), supporting the to-our-knowledge claim that no dysphagia-specific FHIR representation exists.

**Search period:** July 2026. **Transcript below recorded:** 28 July 2026.
**Screening question:** Does the record describe a FHIR artifact (profile, value set, Implementation Guide, or package) dedicated to swallowing assessment, dysphagia severity, aspiration-risk representation, or IDDSI diet coding?

---

## 1. Artifact registries

### 1.1 packages.fhir.org — name-based catalog lookup (programmatic, exact)

Endpoint: `https://packages.fhir.org/catalog?op=find&name=<term>`

| Query term | Packages returned | Screening decision |
|---|---|---|
| `dysphagia` | **0** | — |
| `swallow` | **0** | — |
| `deglutition` | **0** | — |
| `aspiration` | **0** | — |
| `iddsi` | **0** | — |

The unfiltered `catalog` endpoint returned 41 entries in this environment, which is **not** the full package universe; the name-based `op=find` queries above are the authoritative check and are what is reported.

### 1.2 HL7 build server (build.fhir.org)

The continuous-build IG directory (`https://build.fhir.org/ig/`, 37 KB index retrieved 28 July 2026) was searched for `dysphagia`, `swallow`, `deglutit`, `aspirat`, `iddsi`: **no occurrences**. Note that this index lists publishing organizations rather than every IG title, so it is a **partial** check; this is one reason the claim is stated as *to our knowledge* and the residual limitation is retained in §5.3.

### 1.3 registry.fhir.org

The registry front page is reachable (HTTP 200), but it exposes no documented query path for programmatic search (a `/search?q=` request returns HTTP 404). The registry was therefore browsed through its web interface. **No dysphagia-, swallowing-, or IDDSI-dedicated artifact was found.** Because this step is interactive rather than scripted, it is not machine-reproducible from this log; the packages.fhir.org queries in §1.1 cover the same package namespace programmatically.

### 1.4 Simplifier.net registry

Reachable (HTTP 200), but search results are rendered client-side and could not be enumerated programmatically from this environment. Searched interactively for "dysphagia", "swallowing", "deglutition", "IDDSI". **No dedicated artifact found.** Same reproducibility caveat as §1.3.

---

## 2. Bibliographic databases

### 2.1 PubMed (E-utilities, programmatic, exact)

Endpoint: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=<query>`

| Query | Hits | Records screened | Included |
|---|---|---|---|
| `dysphagia AND FHIR` | **0** | — | 0 |
| `deglutition AND FHIR` | **0** | — | 0 |
| `swallowing AND FHIR` | **0** | — | 0 |
| `aspiration AND FHIR` | **3** | 3 | **0** |
| `dysphagia AND (implementation guide OR profile) AND interoperability` | **2** | 2 | **0** |
| **Total** | **5** | **5** | **0** |

**Screening decisions (all five records, with reasons):**

| PMID | Title (truncated) | Decision |
|---|---|---|
| 42402007 | *Artificial general intelligence and the clinical laboratory: a paradigm shift toward Lab 2.0* | Excluded — laboratory AI; "aspiration" not in the swallowing sense |
| 41687005 | *Overview of a User-Centered, Mixed-Methods Process for Designing Interconnected and Focused Mobile Applications…* | Excluded — mobile app design; no dysphagia artifact |
| 40257749 | *Fast Healthcare Interoperability Resources (FHIR)-Based Interoperability Design in Indonesia: Content Analysis…* | Excluded — national FHIR interoperability design; not dysphagia-specific |
| 40145488 | *Profiling Swallowing Safety and Physiology in People With Huntington's Disease* | Excluded — "profiling" is used in the clinical sense (characterizing swallowing physiology), not FHIR profiling; no informatics artifact |
| 39800411 | *Long-term outcome of oesophageal atresia in adolescence (TransEAsome): a national French cohort study protocol* | Excluded — cohort study protocol; no FHIR representation |

### 2.2 Google Scholar

Included in the search per §3.4. Scholar applies automated-access protection, so hit counts could not be retrieved programmatically for this transcript and the search was run interactively. **No dysphagia-specific FHIR artifact was identified.** As with §1.3–1.4, this step is not machine-reproducible from this log.

---

## 3. Result

**Records screened: 5 (PubMed, with reasons above). Artifacts identified across four registries: 0. Included: 0.**

The substrate exists and is reused: base FHIR resources (Observation, NutritionOrder, Composition) and adjacent Implementation Guides (US Core, IPS, PACIO PFE). What was not found is any artifact dedicated to swallowing-assessment, dysphagia-severity, or aspiration-risk representation, or any value set binding IDDSI levels to diet orders.

---

## 4. Limitations of this search

1. **Two of four registries are not machine-reproducible.** registry.fhir.org exposes no documented query path and Simplifier.net renders results client-side; both were browsed interactively. The packages.fhir.org queries (§1.1) cover the same package namespace programmatically and returned zero.
2. **The build-server check is partial.** The `build.fhir.org/ig/` index lists publishing organizations, not every IG title; an un-indexed or build-only IG could be missed. This is the residual limitation stated in §5.3.
3. **Google Scholar hit counts are not transcribed** because of automated-access protection.
4. **Single screener.** Records were screened by one author (informatics) and the decisions were reviewed by the second author; there was no independent double screening, so screening reliability is not quantified.
5. **Scope of the query vocabulary.** The search combined "dysphagia", "deglutition", "swallowing", and "aspiration" with FHIR-artifact terms. Non-FHIR representations (openEHR archetypes, HL7 CDA/C-CDA templates) were **not** searched; the claim is therefore specific to FHIR and should not be read as a claim about clinical modelling in general.
