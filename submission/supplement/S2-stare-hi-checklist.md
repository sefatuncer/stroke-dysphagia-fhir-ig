# Supplementary File S2 — STARE-HI reporting checklist

STARE-HI (Talmon et al., *Int J Med Inform* 2009;78:1–9) is the reporting guideline for evaluation studies in health informatics. It is the applicable guideline here: CONSORT, STROBE and PRISMA govern designs this work is not (no participants, no intervention, no clinical outcome, no systematic review), and risk-of-bias instruments such as RoB 2 or ROBINS-I have no target to score. Two neighbouring candidates were considered and rejected for stated reasons: GEP-HI is a guideline for *planning* an evaluation rather than a reporting instrument, and the MI-CLAIM / TRIPOD-AI / DECIDE-AI family presupposes a learned predictive model, which this work does not contain (the rule is a deterministic consistency check). STARE-HI does not cover the artifact side of this study — software and data versioning, persistent identifiers, licensing — which is reported instead in §3.7, the Data and Code Availability statement and S6.

Several STARE-HI items assume a *deployed* system evaluated in a care setting. This study evaluates a specification and its toolchain, so those items are marked **not applicable with the reason stated** rather than silently omitted. Items that remain applicable once "the system" is read as "the artifact" are answered as such.

**Legend:** ✅ met · ◐ partly met · ⊘ not applicable (reason given)

| # | STARE-HI item | Status | Location / justification |
|---|---|---|---|
| 1 | Title | ◐ | Identifies the study type ("feasibility evaluation") but not the setting. The synthetic-data basis is stated in the abstract's Methods and Results blocks ("a synthetic Synthea cohort", "all 333 synthetic patients") rather than in the title. |
| 2 | Abstract | ✅ | Structured (Background/Objectives/Methods/Results/Conclusions), including the synthetic-data basis, the absence of any clinical-benefit claim, and the by-construction nature of the sweep. |
| 3 | Keywords | ✅ | Five terms, MeSH-aligned where an exact MeSH heading exists. |
| 4.1 | Scientific background | ✅ | §1: epidemiology, pneumonia/mortality association, guideline mandate for pre-oral-intake screening. |
| 4.2 | Rationale for the study | ◐ | §1 separates *omission* (out of scope) from *representation* (the problem addressed), and states which one the artifact can affect. The representation problem is defined conceptually but its frequency is unmeasured, and the manuscript says so (§1, §5.3-15); the rationale therefore rests on a described gap rather than a quantified one. |
| 4.3 | Study objectives | ✅ | §2, three numbered objectives plus an explicit negative objective ("we do not evaluate clinical accuracy, effectiveness, or patient outcomes"). |
| 5.1 | Organisational setting | ◐ (adapted) | There is no care setting. The relevant setting is computational: a containerized toolchain with pinned component versions (§3.6–3.7), terminology access via the HL7 reference terminology server (§3.2), and conformance against a digest-pinned HAPI deployment (§3.5). |
| 5.2 | System details | ✅ (adapted) | The "system" is the artifact. Six profiles, six value sets and one local code system are specified in §3.3 and Table 1. §3.6 lists the executing components with their versions and the table below gives the full inventory, including the container's Jekyll renderer, the bundled reference validator and the HAPI image digest; §3.7 gives the IG version reported here and the deposited release, and the Data and Code Availability statement gives the repository URL and the Zenodo archive DOIs. The IG's canonical URL is not printed in the manuscript — it is resolved from the repository — so this item is met for version and provenance but not for the canonical identifier itself. |
| 5.3 | System in use | ⊘ | No deployment, no users, no training. Nothing was installed in a clinical setting, so usage, uptake and workflow integration cannot be reported. Pilot deployment is named as future work (§5.4). |
| 6.1 | Study design | ✅ | Named in the first sentence of §3 ("This is a specification-and-feasibility study: we report artifact correctness, portability and executability, not effectiveness"), which also states why a classical a-priori power analysis is inapplicable and what is reported in its place; §5.3 repeats the framing when bounding inference. |
| 6.2 | Theoretical background of the evaluation | ◐ | The evaluation is positioned as a pre-deployment feasibility stage (specification correctness, portability, executability) rather than an effectiveness or outcome evaluation; §2 and §5.4 mark the boundary. A formal evaluation-maturity framework is not invoked. |
| 6.3 | Participants | ⊘ | No human participants. The nearest analogue is who performed the terminology classification: §3.2 states that both authors classified each measure jointly, and S3 §6.3 records that disagreements were adjudicated internally, with no external adjudicator. |
| 6.4 | Study flow | ✅ | Figure 3 gives the authoring → build → conformance → evaluation pipeline; §3.7 states that each step is scripted and re-runnable. |
| 6.5 | Outcome measures | ✅ | §3.6 defines four quantities and labels the fourth an analytic illustration rather than a finding. |
| 6.6 | Data collection / measurement | ✅ | Terminology queries, filter terms, per-item results and access dates are in **S3**; artifact and literature search queries, per-source results and screening decisions with reasons are in **S4**; cohort generation parameters are in Table 3 and the seed is given in §3.6. |
| 6.7 | Data analysis methods | ✅ | §3.6 states the per-seed rate definition and the seed count with its a-priori Monte-Carlo rationale; §4.4 and §5.3-11 state that no inferential statistic is attached; Table 4 reports SD, MCSE and the closed-form binomial expectation. |
| 7.1 | Demographic and other characteristics | ◐ (adapted) | The cohort is synthetic and its clinical attributes are assigned independently of demographics, so demographic description would not inform the results. Branch-level counts are reported instead: the alert count (31/333) in §4.4, and the full branch coverage — 75 coded flags, 240 on thin fluids, 20 NPO, 31 alerts — in the deposited `MUTATION-TEST.md`, which is the auditable source for these figures. |
| 7.2 | Unexpected events during the study | ◐ | The evaluation surfaced two structural findings that are reported rather than suppressed: the NPO branch executes without discriminating any verdict, and the rule's `amended` status arm is unreachable for conformant data (§4.4, §5.3-17). Earlier design iterations are not narrated step by step; the design decisions that were revised are recorded where they bear on interpretation (§3.3, §5.3-9, §5.3-13). |
| 7.3 | Study findings | ✅ | §4.1–4.4 with Tables 3–4; every reported figure is reproducible from the deposited outputs. |
| 7.4 | Unexpected observations | ◐ | Reported where they occur rather than under a dedicated heading: the ASHA-NOMS overlap and the instrument-invariance argument (§4.1), and the two branch findings above. |
| 8.1 | Answers to the study questions | ✅ | §5.1, one finding per objective. |
| 8.2 | Strengths and weaknesses | ✅ | §5.3 gives 20 numbered limitations, signposted so that interpretation-bounding items are distinguished from engineering limits. Strengths are argued in §5.1. |
| 8.3 | Relation to other studies | ✅ | §5.2 positions the work against ML-based aspiration prediction and the FHIR/CQL decision-support line, and §3.4 against IPS, PACIO and US Core. |
| 8.4 | Meaning and generalisability | ✅ | §5.4, with the single-etiology limit stated in §5.3-7. |
| 8.5 | Unanswered and new questions | ✅ | §5.4: pilot mapping onto real flowsheet/order-set models, independent-implementation validation, upstream terminology submission. |
| 9 | Conclusion | ✅ | §6, calibrated to feasibility rather than clinical outcome. |
| 10 | Author contributions | ✅ | CRediT-style statement for both authors. |
| 11 | Competing interests | ✅ | Declared, including the verifiable-credentials interest relevant to the future-work direction in §5.4. |
| 12 | Acknowledgements | ◐ | Present; the acknowledgement is to the standards communities whose work is reused, with no individual contributors to name. |
| 13 | References | ✅ | 48 references, Vancouver/AMA style, numbered by order of first citation. |
| 14 | Appendices / supplementary material | ✅ | S1 (element provenance), S2 (this checklist), S3 (terminology log), S4 (search log), S5 (negative-fixture rejection signatures and the constraints the suite leaves untested), S6 (per-concept terminology license inventory), plus the deposited cohort, conformance, mutation-control and sensitivity outputs. |

## Toolchain versions (STARE-HI item 5.2)

| Component | Version | Role |
|---|---|---|
| Node.js | 24.15.0 | runtime for the generator, CQL execution and conformance harnesses |
| SUSHI | 3.20.0 (FHIR Shorthand 3.0.0) | FSH → FHIR R4 resources |
| HL7 IG Publisher | 2.2.11 | IG build, terminology validation, bundled reference validator |
| HAPI FHIR | 8.10.0, pinned by image digest `sha256:55213612779ab3eeec919226b7bad378f0061ade823393a61d7dd46dd5087a3d` | second, independently deployed validation server |
| HL7 FHIR reference validator | `validator_cli.jar`, bundled with IG Publisher 2.2.11 (Git# 0ec4807574e3) | in-toolchain validation of the build and of every deposited cohort bundle |
| Jekyll | 4.4.1 (in the build image) | renders the human-readable IG site |
| cqframework CQL translation service | `sha256:11b1b14c6179c9e9a515ed0295e2394ecb93747076ce8e7ae89150c25ed679af`, pinned by image digest | CQL → ELM |
| cql-execution | 3.3.2 | CQL engine |
| cql-exec-fhir | 2.1.6 | FHIR R4 data source for the engine |
| FHIRHelpers | 4.0.1 | CQL helper library |
| SNOMED CT | International Edition 20250201 (re-checked against a 2026-03 edition) | terminology |
| LOINC | 2.82 | terminology |
| IPS / PACIO PFE / US Core | 2.0.1 / 2.0.0 / 9.0.0 | alignment references |
| Synthea | build `2b0a55b` | base population generator; the run record (build, both seeds, generation parameters) is deposited with the archived artifact, and the 197 MB jar is identified by that build rather than redistributed |

Seeds: the dysphagia overlay uses seed `20260716`; the sweep re-seeds the overlay across 40 seeds while holding the 333-patient base cohort fixed.

**Item count:** 31 items — 21 ✅ · 8 ◐ · 2 ⊘.

## Items deliberately not claimed

Two items are marked ⊘ because the study design puts them out of reach, and one further expectation is deliberately not claimed even though no single checklist item carries it. We prefer to state all three rather than reinterpret items until they appear satisfied:

1. **No evaluation in a care setting** (item 5.3, ⊘). Everything reported is pre-deployment.
2. **No human participants** (item 6.3, ⊘), and therefore no user-facing or workflow outcome: nothing is claimed about clinician behavior, alert handling, or care processes.
3. **No empirical frequency** (no dedicated item; bears on 6.5 and 7.3). The interoperability-dependency figure is a property of the generative model, not a measurement of how often un-coded documentation occurs in practice (§5.3-11, §5.3-15). Both items are reported as met because the outcome measures are defined and the findings given; what is *not* claimed is that the fourth quantity measures the world.

