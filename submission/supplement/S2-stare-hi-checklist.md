# Supplementary File S2 — STARE-HI reporting checklist

STARE-HI (Talmon et al., *Int J Med Inform* 2009;78:1–9) is the reporting guideline for evaluation studies in health informatics. It is the applicable guideline here: CONSORT, STROBE and PRISMA govern designs this work is not (no participants, no intervention, no clinical outcome, no systematic review), and risk-of-bias instruments such as RoB 2 or ROBINS-I have no target to score.

Several STARE-HI items assume a *deployed* system evaluated in a care setting. This study evaluates a specification and its toolchain, so those items are marked **not applicable with the reason stated** rather than silently omitted. Items that remain applicable once "the system" is read as "the artifact" are answered as such.

**Legend:** ✅ met · ◐ partly met · ⊘ not applicable (reason given)

| # | STARE-HI item | Status | Location / justification |
|---|---|---|---|
| 1 | Title | ◐ | Identifies the study type ("feasibility evaluation") but not the setting. The synthetic-data basis is stated in the abstract's Methods and Results blocks ("a synthetic Synthea cohort", "all 333 synthetic patients") rather than in the title. |
| 2 | Abstract | ✅ | Structured (Background/Objectives/Methods/Results/Conclusions), including the synthetic-data basis, the absence of any clinical-benefit claim, and the by-construction nature of the sweep. |
| 3 | Keywords | ✅ | Seven MeSH-aligned terms. |
| 4.1 | Scientific background | ✅ | §1: epidemiology, pneumonia/mortality association, guideline mandate for pre-oral-intake screening. |
| 4.2 | Rationale for the study | ✅ | §1 separates *omission* (out of scope) from *representation* (the problem addressed), and states which one the artifact can affect. |
| 4.3 | Study objectives | ✅ | §2, three numbered objectives plus an explicit negative objective ("we do not evaluate clinical accuracy, effectiveness, or patient outcomes"). |
| 5.1 | Organisational setting | ◐ (adapted) | There is no care setting. The relevant setting is computational and is reported in §3.6–3.7: containerized toolchain, pinned component versions, terminology access via tx.fhir.org, conformance against a digest-pinned HAPI deployment. |
| 5.2 | System details | ✅ (adapted) | The "system" is the artifact. Six profiles, six value sets and one local code system are specified in §3.3 and Table 1. §3.6 lists every toolchain component with its version; §3.7 gives the IG version reported here, the repository URL and the Zenodo archive DOI. The IG's canonical URL is not printed in the manuscript — it is resolved from the repository — so this item is met for version and provenance but not for the canonical identifier itself. |
| 5.3 | System in use | ⊘ | No deployment, no users, no training. Nothing was installed in a clinical setting, so usage, uptake and workflow integration cannot be reported. Pilot deployment is named as future work (§5.4). |
| 6.1 | Study design | ✅ | Stated in §3 as a specification-and-feasibility study and reiterated in §5.3. |
| 6.2 | Theoretical background of the evaluation | ◐ | The evaluation is positioned as a pre-deployment feasibility stage (specification correctness, portability, executability) rather than an effectiveness or impact evaluation; §2 and §5.4 mark the boundary. A formal evaluation-maturity framework is not invoked. |
| 6.3 | Participants | ⊘ | No human participants. The nearest analogue, who performed the terminology classification and how disagreements were handled, is reported in §3.2 and S3. |
| 6.4 | Study flow | ✅ | Figure 3 gives the authoring → build → conformance → evaluation pipeline; §3.7 states that each step is scripted and re-runnable. |
| 6.5 | Outcome measures | ✅ | §3.6 defines four quantities and labels the fourth an analytic illustration rather than a finding. |
| 6.6 | Data collection / measurement | ✅ | Terminology queries, filter terms, per-item results and access dates are in **S3**; artifact and literature search queries, per-source results and screening decisions with reasons are in **S4**; cohort generation parameters are in Table 2 and the seed is given in §3.6. |
| 6.7 | Data analysis methods | ✅ | §3.6 states the per-seed rate definition, the seed count with its Monte-Carlo rationale, and that no inferential statistic is attached; Table 4 reports SD, MCSE and the closed-form binomial expectation. |
| 7.1 | Demographic and other characteristics | ◐ (adapted) | The cohort is synthetic and its clinical attributes are assigned independently of demographics, so demographic description would not inform the results. Branch-level counts are reported instead: the alert count (31/333) in §4.4, and the full branch coverage — 75 coded flags, 240 on thin fluids, 20 NPO, 31 alerts — in the deposited `MUTATION-TEST.md`, which is the auditable source for these figures. |
| 7.2 | Unexpected events during the study | ◐ | The evaluation surfaced two structural findings that are reported rather than suppressed: the NPO branch executes without discriminating any verdict, and the rule's `amended` status arm is unreachable for conformant data (§4.4, §5.3-17). Earlier design iterations are summarised in §5.3-9 but not narrated step by step. |
| 7.3 | Study findings | ✅ | §4.1–4.4 with Tables 3–4; every reported figure is reproducible from the deposited outputs. |
| 7.4 | Unexpected observations | ◐ | Reported where they occur rather than under a dedicated heading: the ASHA-NOMS overlap and the instrument-invariance argument (§4.1), and the two branch findings above. |
| 8.1 | Answers to the study questions | ✅ | §5.1, one finding per objective. |
| 8.2 | Strengths and weaknesses | ✅ | §5.3 gives 19 numbered limitations, signposted so that interpretation-bounding items are distinguished from engineering limits. Strengths are argued in §5.1. |
| 8.3 | Relation to other studies | ✅ | §5.2 positions the work against ML-based aspiration prediction and the FHIR/CQL decision-support line, and §3.4 against IPS, PACIO and US Core. |
| 8.4 | Meaning and generalisability | ✅ | §5.4, with the single-etiology limit stated in §5.3-7. |
| 8.5 | Unanswered and new questions | ✅ | §5.4: pilot mapping onto real flowsheet/order-set models, independent-implementation validation, upstream terminology submission. |
| 9 | Conclusion | ✅ | §6, calibrated to feasibility rather than clinical outcome. |
| 10 | Author contributions | ✅ | CRediT-style statement for both authors. |
| 11 | Competing interests | ✅ | Declared, including the verifiable-credentials interest relevant to the future-work direction in §5.4. |
| 12 | Acknowledgements | ◐ | Present; individual acknowledgements to be completed before submission. |
| 13 | References | ✅ | 38 references, Vancouver style. |
| 14 | Appendices / supplementary material | ✅ | S1 (element provenance), S2 (this checklist), S3 (terminology log), S4 (search log), plus the deposited conformance, mutation-control and sensitivity outputs. |

## Toolchain versions (STARE-HI item 5.2)

| Component | Version | Role |
|---|---|---|
| Node.js | 24.15.0 | runtime for the generator, CQL execution and conformance harnesses |
| SUSHI | 3.20.0 (FHIR Shorthand 3.0.0) | FSH → FHIR R4 resources |
| HL7 IG Publisher | 2.2.11 | IG build, terminology validation, bundled reference validator |
| HAPI FHIR | 8.10.0, pinned by image digest | second, independently deployed validation server |
| cqframework CQL translation service | container image, invoked over HTTP | CQL → ELM |
| cql-execution | 3.3.2 | CQL engine |
| cql-exec-fhir | 2.1.6 | FHIR R4 data source for the engine |
| FHIRHelpers | 4.0.1 | CQL helper library |
| SNOMED CT | International Edition 20250201 (re-checked against a 2026-03 edition) | terminology |
| LOINC | 2.82 | terminology |
| IPS / PACIO PFE / US Core | 2.0.1 / 2.0.0 / 9.0.0 | alignment references |
| Synthea | **not recorded** | base population generator (see limitation 18) |

Seeds: the dysphagia overlay uses seed `20260716`; the sweep re-seeds the overlay across 40 seeds while holding the 333-patient base cohort fixed.

## Items deliberately not claimed

Three STARE-HI expectations are **not** met, and we prefer to state this rather than reinterpret the items until they appear satisfied:

1. **No evaluation in a care setting** (5.3). Everything reported is pre-deployment.
2. **No user-facing or workflow outcome.** Nothing is claimed about clinician behaviour, alert handling, or care processes.
3. **No empirical frequency.** The interoperability-dependency figure is a property of the generative model, not a measurement of how often un-coded documentation occurs in practice (§5.3-11, §5.3-15).
