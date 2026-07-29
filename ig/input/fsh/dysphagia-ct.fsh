// ============================================================================
// Stroke Dysphagia Care-Transition IG — FHIR Shorthand source (released v1.1.1, MIT)
// Canonical: https://sefatuncer.github.io/stroke-dysphagia-fhir-ig
// Terminology verified against SNOMED CT International 20250201 + LOINC v2.82;
// per-item queries and classifications are in the supplementary terminology log.
// ============================================================================

Alias: $SCT = http://snomed.info/sct
Alias: $LOINC = http://loinc.org

// ---------------------------------------------------------------------------
// Local temporary CodeSystem — scales that currently LACK LOINC & SNOMED codes.
// (Verified against the terminology servers logged in the supplement:
//  PAS/FOIS/EAT-10/DIGEST/TOR-BSST/Yale/MBSImP have no code;
//  GUSS + IDDSI DO exist in SNOMED and are reused below.)
// These are candidates to submit to LOINC/SNOMED — a stated contribution of the paper.
// ---------------------------------------------------------------------------
CodeSystem: DysphagiaScalesTemp
Id: dysphagia-scales-temp
Title: "Dysphagia Scales — temporary local codes (proposed for LOINC/SNOMED)"
Description: "Placeholder codes for validated dysphagia measures lacking terminology representation. To be submitted upstream."
* ^status = #draft
* ^copyright = "MIT (© 2026 N. Kapan Tunçer and S. Tunçer). These are locally minted placeholder identifiers only. They name validated instruments whose own copyright rests with their developers; no instrument content, scoring rule or item text is reproduced here. The codes are temporary and are expected to be retired once equivalent concepts exist in LOINC or SNOMED CT."
* ^experimental = true
* ^caseSensitive = true
* #PAS "Penetration-Aspiration Scale (Rosenbek 1996) — score 1–8"
* #FOIS "Functional Oral Intake Scale — level 1–7"
* #EAT-10 "Eating Assessment Tool-10 — total score"
* #DIGEST "Dynamic Imaging Grade of Swallowing Toxicity — grade 0–4"
* #TOR-BSST "Toronto Bedside Swallowing Screening Test — pass/fail"
* #YALE-RESIDUE "Yale Pharyngeal Residue Severity Rating"
* #SILENT-ASPIRATION "Silent aspiration (finding) — proposed (no SNOMED concept)"

// ---------------------------------------------------------------------------
// IDDSI diet/fluid levels — REUSE SNOMED-embedded IDDSI (do NOT invent codes).
// SNOMED Framework root 1237453009; levels root 1231509009.
// No official IDDSI FHIR ValueSet exists → defining one here IS a contribution.
// ---------------------------------------------------------------------------
// IDDSI is a TWO-AXIS framework: drinks are levels 0–4, foods are levels 3/4–7.
// Base FHIR binds fluidConsistencyType and texture.modifier only as *example*; we bind
// each element to its OWN axis-specific ValueSet so a fluid level cannot be placed on the
// food element (or vice-versa) — the precise, semantically-safe contribution the diet side
// lacked. Codes verified SNOMED CT Intl 20250201; displays omitted so the terminology
// server supplies the official term (avoids display-mismatch on expansion). Enumerated
// EXPLICITLY because an ECL `<< 1237453009` / `<< 1231509009` did NOT expand on tx.fhir.org.
ValueSet: IDDSIFluidLevels
Id: iddsi-fluid-levels
Title: "IDDSI Drink/Fluid Consistency Levels (SNOMED CT)"
Description: "IDDSI drink-axis consistency levels 0–4 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.fluidConsistencyType. Level 3 is the transitional Moderately Thick concept shared with the food axis."
* ^status = #active
* ^copyright = "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries no display terms, which are supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences."
* ^experimental = false
* $SCT#1231508001   // Thin (IDDSI Level 0)
* $SCT#1237441005   // Slightly Thick (IDDSI Level 1)
* $SCT#1237442003   // Mildly Thick (IDDSI Level 2)
* $SCT#1237444002   // Moderately Thick (IDDSI Level 3)
* $SCT#1237446000   // Extremely Thick (IDDSI Level 4 — fluids)

ValueSet: IDDSIFoodLevels
Id: iddsi-food-levels
Title: "IDDSI Food Texture Levels (SNOMED CT)"
Description: "IDDSI food-axis texture levels 4–7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier. The IDDSI food axis spans Levels 3–7; Level 3 (Liquidised) is the shared Moderately Thick concept and is not enumerated here, so it is reached through the extensible binding."
* ^status = #active
* ^copyright = "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries no display terms, which are supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences."
* ^experimental = false
* $SCT#1237447009   // Pureed (IDDSI Level 4 — foods)
* $SCT#1237448004   // Minced & Moist (IDDSI Level 5)
* $SCT#1237449007   // Soft & Bite-sized (IDDSI Level 6)
* $SCT#1237450007   // Easy to Chew (IDDSI Level 7)
* $SCT#1237451006   // Regular (IDDSI Level 7)

// ---------------------------------------------------------------------------
// ValueSets for assessment 'code' elements (reuse where coded; temp elsewhere)
// ---------------------------------------------------------------------------
ValueSet: SwallowScreeningTypeVS
Id: swallow-screening-type-vs
Title: "Swallowing Screening Type"
Description: "Swallowing screening instruments for the stroke care transition (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; TOR-BSST and EAT-10 as temporary local codes pending LOINC/SNOMED submission). Note that EAT-10 is a patient-reported symptom-severity tool used as a screen rather than a clinician-administered bedside swallow test, and its applicability in acute stroke is limited by aphasia and cognitive impairment."
* ^status = #active
* ^copyright = "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences."
* ^experimental = false
* $SCT#1289999007 "Gugging swallowing screen"            // GUSS (verified, SNOMED Intl 20250201)
* $SCT#717684008 "Yale Swallow Protocol"                 // Yale/3-oz Water Swallow Test (verified 20250201; score 716854005)
* DysphagiaScalesTemp#EAT-10
* DysphagiaScalesTemp#TOR-BSST

ValueSet: InstrumentalSwallowTypeVS
Id: instrumental-swallow-type-vs
Title: "Instrumental Swallow Assessment Type"
Description: "Instrumental swallowing assessments (VFSS/FEES) and associated graded scales (PAS, Yale residue) — SNOMED/LOINC where coded, temporary local codes otherwise."
* ^status = #active
* ^copyright = "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences."
* ^experimental = false
* $SCT#241149003 "Videofluoroscopy swallow"              // VFSS (verified)
* $LOINC#24681-9                                          // VFSS imaging, general RF videography (verified)
* $LOINC#86395-1                                          // VFSS swallowing-function-specific (verified 20250201)
* $SCT#311834001 "Fibreoptic endoscopic evaluation of swallowing"  // FEES procedure (verified 20250201; SNOMED uses British spelling)
* DysphagiaScalesTemp#PAS
* DysphagiaScalesTemp#YALE-RESIDUE

ValueSet: DysphagiaSeverityTypeVS
Id: dysphagia-severity-type-vs
Title: "Dysphagia Severity / Oral-Intake Scale Type"
Description: "Overall dysphagia severity / functional oral-intake measures for the stroke care transition (DOSS + IDDSI Functional Diet Scale reused from SNOMED; FOIS as a temporary local code pending LOINC/SNOMED submission). DIGEST is deliberately excluded: it is validated for head-and-neck-cancer radiation toxicity, not for stroke, and is surveyed in the coverage assessment only. Its temporary code remains in the local CodeSystem as an upstream-submission candidate."
* ^status = #active
* ^copyright = "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences."
* ^experimental = false
* DysphagiaScalesTemp#FOIS
* $SCT#767131006 "Dysphagia Outcome and Severity Scale"   // DOSS scale concept (verified 20250201; level answer-set proposed)
* $SCT#1231505003 "International Dysphagia Diet Standardisation Initiative Functional Diet Scale"  // FDS (corrected display)

// ---------------------------------------------------------------------------
// Observation PROFILES — the genuine gap (no such profiles in US Core/IPS/PACIO)
// ---------------------------------------------------------------------------
Profile: SwallowingScreeningResult
Parent: Observation
Id: swallowing-screening-result
Title: "Swallowing Screening Result"
Description: "Bedside dysphagia screening (GUSS/EAT-10/TOR-BSST). GUSS reuses SNOMED 1289999007."
* status MS
* status = #final (exactly)
* code MS
* code from SwallowScreeningTypeVS (extensible)
* subject 1..1 MS
* subject only Reference(Patient)
* effective[x] 1..1 MS
* value[x] MS

Invariant: pas-range
Description: "The Penetration-Aspiration Scale is an 8-point ordinal scale; a PAS grade outside 1-8 is not a valid score."
Severity: #error
Expression: "value.ofType(integer) >= 1 and value.ofType(integer) <= 8"

Profile: InstrumentalSwallowAssessment
Parent: Observation
Id: instrumental-swallow-assessment
Title: "Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale"
Description: "VFSS/FEES result incl. PAS (Rosenbek). PAS lacks LOINC/SNOMED → temp code; proposed upstream."
* status MS
* code MS
* code from InstrumentalSwallowTypeVS (extensible)
* subject 1..1 MS
* subject only Reference(Patient)
* effective[x] 1..1 MS
* value[x] MS
* component ^slicing.discriminator.type = #pattern
* component ^slicing.discriminator.path = "code"
* component ^slicing.rules = #open
* component contains pas 0..1 MS
* component[pas].code = DysphagiaScalesTemp#PAS
* component[pas].value[x] 1..1
* component[pas].value[x] only integer
// Typing the value as integer does not by itself make it a PAS grade: without a range
// constraint an out-of-scale value such as 99 would still conform.
* component[pas] obeys pas-range

Profile: DysphagiaSeverity
Parent: Observation
Id: dysphagia-severity
Title: "Dysphagia Severity"
Description: "Overall severity / oral-intake level (FOIS, DIGEST, or IDDSI FDS)."
* status MS
* code MS
* code from DysphagiaSeverityTypeVS (extensible)
* subject 1..1 MS
* subject only Reference(Patient)
* effective[x] 1..1 MS
* value[x] MS

Profile: AspirationRiskFlag
Parent: Observation
Id: aspiration-risk-flag
Title: "Aspiration Risk Flag"
Description: "Patient-level aspiration-risk finding — the minimal, most safety-critical element carried across transitions. The at-risk-for-aspiration finding is asserted by `Observation.code`; the mere PRESENCE of a final instance is the datum the care-transition consistency rule consumes (the rule does not read the value). Status is fixed to final so that every conformant instance is visible to the rule (the rule accepts final|amended, a superset), closing the profile↔rule gap. An optional qualifier value may record the observed aspiration event on which the risk determination was based."
* status MS
* status = #final (exactly)                             // rule-visible: a preliminary flag must not silently conform
// Only the code and system are fixed. The display term is deliberately NOT part of the
// pattern: this IG references SNOMED CT rather than redistributing it, so the official
// term is supplied at expansion time by the implementer's own terminology server. Fixing
// a display string here would both contradict that policy and reject conformant instances
// that carry a language-localised or edition-current term.
* code.coding.system = "http://snomed.info/sct"
* code.coding.code = #371736008                         // at risk for aspiration (verified SNOMED Intl 20250201)
* subject 1..1 MS
* subject only Reference(Patient)
* effective[x] 1..1 MS
// value is OPTIONAL and does NOT repeat the code — it qualifies the finding when a
// specific aspiration event was observed (avoids the code == value redundancy).
* value[x] 0..1 MS
* value[x] only CodeableConcept
* valueCodeableConcept from AspirationRiskValueVS (extensible)

ValueSet: AspirationRiskValueVS
Id: aspiration-risk-value-vs
Title: "Aspiration Event Qualifier"
Description: "Optional qualifier for the Aspiration Risk Flag: the observed aspiration event on which the risk determination was based (pulmonary aspiration; silent aspiration as a proposed temporary local code). Does NOT include the at-risk finding itself, which is carried in Observation.code."
* ^status = #active
* ^copyright = "Value-set definition: MIT (© 2026 N. Kapan Tunçer and S. Tunçer). Content is referenced, not redistributed: this value set enumerates third-party concept identifiers (SNOMED CT © SNOMED International; LOINC © Regenstrief Institute, Inc.; IDDSI framework CC BY-SA 4.0, used unmodified) and carries, for some members, the SNOMED CT International Edition English term as an unmodified display hint (not translated); the authoritative display is supplied at expansion time by the implementer's own terminology server. Implementers must hold the applicable third-party licences."
* ^experimental = false
* $SCT#68052005 "Pulmonary aspiration"
* DysphagiaScalesTemp#SILENT-ASPIRATION

// ---------------------------------------------------------------------------
// NutritionOrder PROFILE — REUSE (diet/IDDSI already covered by base + PACIO).
// Contribution here = an EXTENSIBLE IDDSI binding (base uses only 'example')
// PLUS the two invariants below, which are what actually enforce axis separation.
//
// An extensible binding does NOT prevent an out-of-axis code: it permits codes
// outside the value set when no suitable concept exists. Axis separation therefore
// has to be stated as a constraint, not left to the binding.
// ---------------------------------------------------------------------------

Invariant: iddsi-axis-fluid
Description: "A food-axis IDDSI concept must not be used on fluidConsistencyType, which carries the drink axis (IDDSI Levels 0-4)."
Severity: #error
Expression: "fluidConsistencyType.coding.where(system = 'http://snomed.info/sct' and code in ('1237447009' | '1237448004' | '1237449007' | '1237450007' | '1237451006')).empty()"

Invariant: iddsi-axis-food
Description: "A drink-only IDDSI concept must not be used on texture.modifier, which carries the food axis. IDDSI Level 3 (1237444002) is a single concept shared by both axes and is therefore permitted here."
Severity: #error
Expression: "texture.modifier.coding.where(system = 'http://snomed.info/sct' and code in ('1231508001' | '1237441005' | '1237442003' | '1237446000')).empty()"

Profile: DysphagiaNutritionOrder
Parent: NutritionOrder
Id: dysphagia-nutrition-order
Title: "Dysphagia Nutrition Order (IDDSI-bound)"
Description: "NutritionOrder constrained to bind IDDSI levels (extensible) — base FHIR only binds these 'example'."
* patient 1..1 MS
* oralDiet.fluidConsistencyType from IDDSIFluidLevels (extensible)   // drink axis (levels 0–4)
* oralDiet.texture.modifier from IDDSIFoodLevels (extensible)        // food axis: value set enumerates 4–7
* oralDiet obeys iddsi-axis-fluid and iddsi-axis-food

// ---------------------------------------------------------------------------
// Care-transition SUMMARY — the transfer envelope (positioned relative to the IPS
// Composition; see the standards-alignment page for why sections stay open)
// ---------------------------------------------------------------------------
Invariant: dct-has-content
Description: "A care-transition summary must carry at least one section entry. An envelope with no dysphagia content is not a transfer."
Severity: #error
Expression: "section.entry.exists()"

Profile: DysphagiaCareTransitionSummary
Parent: Composition
Id: dysphagia-care-transition-summary
Title: "Dysphagia Care-Transition Summary"
Description: "Composition bundling swallowing assessment + severity + aspiration risk + IDDSI diet + precautions for a stroke care transition."
* obeys dct-has-content
* status MS
* type = $LOINC#34133-9
* subject 1..1 MS
* subject only Reference(Patient)
// Section CODES are left open (not sliced): code-discriminated slicing would require
// fixed LOINC/SNOMED codes for the severity and diet sections, which is deferred.
// Section ENTRIES are not left open: they must reference this IG's profiles, so a
// receiving system can locate the dysphagia content by type rather than by reading
// a free-text section title.
* section.entry only Reference(SwallowingScreeningResult or InstrumentalSwallowAssessment or DysphagiaSeverity or AspirationRiskFlag or DysphagiaNutritionOrder)

// ---------------------------------------------------------------------------
// EXAMPLE (synthetic — no real patient)
// ---------------------------------------------------------------------------
Instance: ex-patient
InstanceOf: Patient
Title: "Example — synthetic stroke patient (no real data)"
Usage: #example
* name.family = "Sentetik"
* name.given = "Ornek"
* gender = #female
* birthDate = "1957-05-12"

Instance: ex-aspiration-risk
InstanceOf: AspirationRiskFlag
Title: "Example — aspiration risk present (synthetic)"
Usage: #example
* status = #final
* code = $SCT#371736008 "At risk for aspiration"
* subject = Reference(Patient/ex-patient)
* effectiveDateTime = "2026-03-10"
// value omitted — the finding is asserted by presence; an optional qualifier would go here.

Instance: ex-dysphagia-diet
InstanceOf: DysphagiaNutritionOrder
Title: "Example — IDDSI Level 5 diet + mildly thick fluids (synthetic)"
Usage: #example
* status = #active
* intent = #order
* patient = Reference(Patient/ex-patient)
* dateTime = "2026-03-10"          // NutritionOrder.dateTime is 1..1 in R4
* oralDiet.texture.modifier = $SCT#1237448004 "International Dysphagia Diet Standardisation Initiative Framework - Minced and Moist Level 5"
* oralDiet.fluidConsistencyType = $SCT#1237442003 "International Dysphagia Diet Standardisation Initiative Framework - Mildly Thick Level 2"

Instance: ex-org
InstanceOf: Organization
Title: "Example — synthetic rehabilitation service (Composition author)"
Usage: #example
* name = "Synthetic Stroke Rehabilitation Service"

Instance: ex-swallow-screening
InstanceOf: SwallowingScreeningResult
Title: "Example — GUSS bedside screening result (synthetic)"
Usage: #example
* status = #final
* code = $SCT#1289999007 "Gugging swallowing screen"
* subject = Reference(Patient/ex-patient)
* effectiveDateTime = "2026-03-08"
* valueInteger = 14   // GUSS total 0–20; 14 → slight dysphagia, some diet restriction

Instance: ex-instrumental-swallow
InstanceOf: InstrumentalSwallowAssessment
Title: "Example — VFSS with Penetration-Aspiration Scale (synthetic)"
Usage: #example
* status = #final
* code = $SCT#241149003 "Videofluoroscopy swallow"
* subject = Reference(Patient/ex-patient)
* effectiveDateTime = "2026-03-09"
* component[pas].code = DysphagiaScalesTemp#PAS
* component[pas].valueInteger = 6   // PAS 1–8; 6 → aspiration without response (silent)

Instance: ex-dysphagia-severity
InstanceOf: DysphagiaSeverity
Title: "Example — FOIS functional oral-intake level (synthetic)"
Usage: #example
* status = #final
* code = DysphagiaScalesTemp#FOIS
* subject = Reference(Patient/ex-patient)
* effectiveDateTime = "2026-03-09"
* valueInteger = 4   // FOIS 1–7; 4 → total oral intake of a single consistency

Instance: ex-care-transition-summary
InstanceOf: DysphagiaCareTransitionSummary
Title: "Example — dysphagia care-transition summary bundling the transfer package (synthetic)"
Usage: #example
* status = #final
* type = $LOINC#34133-9 "Summary of episode note"
* subject = Reference(Patient/ex-patient)
* date = "2026-03-10"
* author = Reference(Organization/ex-org)
* title = "Dysphagia Care-Transition Summary"
* section[0].title = "Aspiration risk"
// section.code intentionally omitted: Composition.section.code expects a LOINC section
// code, not the SNOMED finding; binding sections to IPS/LOINC section codes is deferred
// (see manuscript §3.4/§5.3). All three sections carry titles only, uniformly.
* section[0].entry[0] = Reference(Observation/ex-aspiration-risk)
* section[1].title = "Swallowing severity"
* section[1].entry[0] = Reference(Observation/ex-dysphagia-severity)
* section[2].title = "Diet and fluid consistency (IDDSI)"
* section[2].entry[0] = Reference(NutritionOrder/ex-dysphagia-diet)
