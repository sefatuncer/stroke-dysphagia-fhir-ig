### Stroke Dysphagia Care-Transition FHIR IG

This Implementation Guide defines an **interoperable, machine-readable representation** of
swallowing assessment, aspiration risk, dysphagia severity and IDDSI diet/fluid consistency
so these data can travel across stroke care transitions (**acute → inpatient rehab → home / tele-rehab**).

> **Scope note (honest framing).** This IG targets **interoperability and computable
> decision-support feasibility**. It does **not** claim clinical benefit. All examples use
> **synthetic data only** (no patient data, no ethics approval required).

#### What this IG contributes (the narrow gap)

Diet/IDDSI ordering is already covered by base FHIR `NutritionOrder`, PACIO PFE and
SNOMED-embedded IDDSI — this IG **reuses** those rather than re-inventing them. The genuine
gap it fills is on the **assessment / outcome / risk** side:

- **Observation profiles** absent from US Core / IPS / PACIO:
  - `SwallowingScreeningResult` (bedside screening — GUSS reuses SNOMED `1289999007`)
  - `InstrumentalSwallowAssessment` (VFSS/FEES incl. Penetration-Aspiration Scale)
  - `DysphagiaSeverity` (FOIS / DIGEST / IDDSI Functional Diet Scale)
  - `AspirationRiskFlag` (patient-level, safety-critical, SNOMED `371736008`)
- An **IDDSI Framework `ValueSet`** over SNOMED-embedded IDDSI concepts (no official FHIR
  ValueSet exists — defining one is a contribution).
- A **`DysphagiaNutritionOrder`** profile that binds IDDSI *extensibly* (base FHIR binds it
  only as *example*).
- A **`DysphagiaCareTransitionSummary`** Composition — the transfer envelope.
- A set of **validated dysphagia scales that currently lack terminology** (PAS, FOIS, EAT-10,
  DIGEST, TOR-BSST, Yale residue) captured as temporary local codes and **proposed upstream to
  LOINC/SNOMED**.

#### Computable decision support (feasibility)

An executable **CQL** rule (`AspirationRiskAlert`) surfaces a care-transition **safety
inconsistency** — an at-risk patient still on unmodified (thin, IDDSI Level 0) fluids and not
NPO — directly from the profiled data. It compiles to ELM and runs, **unmodified, on a real CQL
engine** (cql-execution) over a synthetic Synthea stroke cohort (N = 333). Reported outcomes are
**executability**, authoring **concordance**, trigger rate, and — the point — the
**interoperability dependency**: clinically-unsafe cases become **invisible to the rule when the
aspiration-risk flag is left as un-coded free text** rather than the coded Observation this IG
defines. The invisibility rate tracks the un-coded fraction **by construction** (30.0% ± 7.5
percentage points across 40 seeds at P(coded) = 0.70), so it illustrates a mechanism, not an
empirical estimate. This is a **feasibility / interoperability** result — **no diagnostic-accuracy
or PPV claim**. All data are synthetic.

#### Standards alignment

This IG **extends, does not reinvent**: it declares dependencies on **IPS 2.0.1** and **PACIO
PFE 2.0.0** and positions relative to **US Core**. Profiles derive from **base FHIR resources**
by design — hard-deriving from these IGs would import mandatory constraints inappropriate for a
focused, international dysphagia transfer (IPS Composition requires Problems / Allergies /
Medications sections; PACIO's `pfe-nutrition-order` requires `allergyIntolerance` and omits an
IDDSI binding). The contribution is precisely the dysphagia-specific gap those frameworks leave
open — the **IDDSI binding PACIO omits** and the **assessment / risk profiles IPS and US Core
lack**.

#### Status

Released, v1.1.0. Terminology verified against SNOMED CT International 20250201 + LOINC v2.82.
Conformance is demonstrated on **two independently deployed servers** — the HL7 reference
validator and a containerized HAPI FHIR server — rather than by self-validation alone. Both
share the HL7 Java validation core, so this establishes portability across deployments, not
independence across implementations. Eight positive examples pass (six against a declared IG
profile, two against base FHIR) and **eight negative fixtures are correctly rejected**, each for
the specific constraint it violates.

#### Dependencies

{% include dependency-table.xhtml %}

#### Intellectual property and terminology licensing

This IG **references** SNOMED CT, LOINC and IDDSI concepts by identifier; it does not
redistribute their content. The value sets enumerate concept identifiers, so the official
display term is supplied at expansion time by the implementer's own terminology server.
Implementers are responsible for their own SNOMED CT affiliate/member licensing, the LOINC
license, and IDDSI's CC BY-SA terms. The MIT license covers only the artifacts authored here
and does not relicense any third-party terminology.

{% include ip-statements.xhtml %}
