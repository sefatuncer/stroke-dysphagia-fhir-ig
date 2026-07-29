/*
 * AspirationRiskAlert — care-transition safety-consistency rule
 *
 * Purpose (computable-CDS FEASIBILITY; NOT a clinical-benefit or
 * diagnostic claim): from the dysphagia care-transition FHIR data, deterministically
 * raise an "aspiration precaution" alert when a coded aspiration-risk flag co-exists
 * with an unmodified (thin, IDDSI Level 0) fluid order and no nil-by-mouth decision.
 * The rule uses only elements defined by the IG profiles, so executing it is also a
 * test that those profiles carry computable data. Evaluated on a synthetic Synthea
 * cohort; outputs are executability + rule behaviour, not diagnostic performance.
 *
 * Codes verified (SNOMED CT Intl 20250201): 371736008 (at risk for aspiration),
 * 182923009 (nil by mouth); IDDSI thin level 1231508001.
 */
library AspirationRiskAlert version '1.1.0'

using FHIR version '4.0.1'

include FHIRHelpers version '4.0.001' called FHIRHelpers

codesystem "SCT": 'http://snomed.info/sct'

code "At risk for aspiration": '371736008' from "SCT"
code "Nil by mouth": '182923009' from "SCT"
code "Thin fluids IDDSI Level 0": '1231508001' from "SCT"

context Patient

// --- Inputs from the IG profiles ---------------------------------------------
define "AspirationRiskObservations":
  [Observation: "At risk for aspiration"] O
    where O.status in { 'final', 'amended' }

define "HasAspirationRiskFlag":
  exists("AspirationRiskObservations")

// An ACTIVE nutrition order that prescribes thin (unmodified, IDDSI Level 0) fluids.
define "OnThinFluids":
  exists(
    [NutritionOrder] N
      where N.status = 'active'
        and exists(
          N.oralDiet.fluidConsistencyType FC
            where FC ~ "Thin fluids IDDSI Level 0"
        )
  )

// Nil-by-mouth either as an explicit observation or as an active order with no oral diet.
// The same status filter as the risk-flag branch is applied deliberately: this branch
// SUPPRESSES a safety alert, so an entered-in-error or preliminary nil-by-mouth record
// must not be able to silence it. Filtering only the alert-raising branch would make the
// rule asymmetric in the unsafe direction.
// Note: nil-by-mouth is a plain SNOMED code, not an element of any profile in this IG
// (see Limitations) — it is the one input the rule takes from outside the profiled set.
define "IsNPO":
  exists([Observation: "Nil by mouth"] O where O.status in { 'final', 'amended' })
    or exists([NutritionOrder] N where N.status = 'active' and not exists(N.oralDiet))

// --- Rule: alert when at-risk AND on thin fluids AND not already NPO ----------
define "AspirationPrecautionAlert":
  "HasAspirationRiskFlag"
    and "OnThinFluids"
    and not "IsNPO"

define "AlertText":
  if "AspirationPrecautionAlert"
    then 'ASPIRATION PRECAUTION: at-risk patient on thin fluids and not NPO — review diet/fluid consistency (IDDSI) and swallowing precautions.'
    else null

// Future work (not part of the evaluated feasibility rule):
//  - Bind the thin-fluid check to the IDDSIFrameworkLevels ValueSet rather than a single code.
//  - Extend with dysphagia-severity gating and posture/supervision precautions.
