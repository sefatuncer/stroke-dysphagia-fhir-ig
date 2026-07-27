# Faz 2 — Computable-CDS feasibility results (synthetic)

> Synthetic data only (Synthea base + documented dysphagia-layer model). **No clinical-benefit / diagnostic-accuracy / PPV claim.** Framing = executability + interoperability-dependency feasibility.

## Cohort
- N = **333** synthetic stroke patients (SNOMED 230690007) drawn from a Synthea population of 25000 (seed 20260716).
- Composition: dysphagia 162 (48.6%), screen-positive 115 (34.5%), aspiration-flag **coded** 75 (22.5%), screen-positive but **flag un-coded** 40 (12.0%), on thin fluids 240 (72.1%), NPO 20 (6.0%).

## 1. Executability (primary feasibility claim)
The IG's `AspirationRiskAlert` CQL compiled to ELM with **0 errors** and executed **unmodified on a real CQL engine** (cql-execution + cql-exec-fhir) over **333/333** FHIR R4 instances conforming to the IG profiles — a full profile-authoring → terminology → executable-rule round-trip.

## 2. Toolchain-fidelity (round-trip) check
Engine output matched a deterministic reference implementation of the same boolean logic on **333/333** patients (**100.0%**). Because both apply the same specification to the same synthetic data, this is the expected ceiling: it confirms the profile → code → retrieve → engine chain is defect-free — NOT that the rule is logically or clinically valid.

## 3. Trigger rate
The rule fired on **31/333** patients (**9.3%**).

## 4. Interoperability dependency (the paper's thesis, quantified — feasibility, not effect)
Of **47** patients in a clinically-unsafe configuration (screen-positive + thin fluids + not NPO) that *should* surface at the care transition:
- **31** were surfaced by the computable rule (aspiration-risk flag recorded as a **coded** Observation);
- **16** (**34.0%** of unsafe cases) were **invisible to the rule solely because the flag was documented as un-coded free text** — i.e., the computable safety check is only as complete as the *structured, standardized* representation the IG defines.

This is a **feasibility demonstration of the interoperability dependency**, not a measurement of clinical benefit or information-loss reduction.
