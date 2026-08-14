# Artifacts Summary - Stroke Dysphagia Care-Transition FHIR IG v1.2.3

* [**Table of Contents**](toc.md)
* **Artifacts Summary**

## Artifacts Summary

This page provides a list of the FHIR artifacts defined as part of this implementation guide.

### Structures: Resource Profiles 

These define constraints on FHIR resources for systems conforming to this implementation guide.

| | |
| :--- | :--- |
| [Aspiration Risk Flag](StructureDefinition-aspiration-risk-flag.md) | 
| | |
| :--- | :--- |
| Patient-level aspiration-risk finding ??? the minimal, most safety-critical element carried across transitions. The at-risk-for-aspiration finding is asserted by`Observation.code`; the mere PRESENCE of a final instance is the datum the care-transition consistency rule consumes (the rule does not read the value). Status is fixed to final so that every conformant instance is visible to the rule (the rule accepts final | amended, a superset), closing the profile???rule gap. An optional qualifier value may record the observed aspiration event on which the risk determination was based. |
 |
| [Dysphagia Care-Transition Summary](StructureDefinition-dysphagia-care-transition-summary.md) | Composition bundling swallowing assessment + severity + aspiration risk + IDDSI diet + precautions for a stroke care transition. |
| [Dysphagia Nutrition Order (IDDSI-bound)](StructureDefinition-dysphagia-nutrition-order.md) | NutritionOrder constrained to bind IDDSI levels (extensible) ??? base FHIR only binds these 'example'. |
| [Dysphagia Severity](StructureDefinition-dysphagia-severity.md) | Overall severity / oral-intake level (FOIS, DIGEST, or IDDSI FDS). |
| [Instrumental Swallow Assessment (VFSS/FEES) with Penetration-Aspiration Scale](StructureDefinition-instrumental-swallow-assessment.md) | VFSS/FEES result incl. PAS (Rosenbek). PAS lacks LOINC/SNOMED ??? temp code; proposed upstream. |
| [Swallowing Screening Result](StructureDefinition-swallowing-screening-result.md) | Bedside dysphagia screening (GUSS/EAT-10/TOR-BSST). GUSS reuses SNOMED 1289999007. |

### Terminology: Value Sets 

These define sets of codes used by systems conforming to this implementation guide.

| | |
| :--- | :--- |
| [Aspiration Event Qualifier](ValueSet-aspiration-risk-value-vs.md) | Optional qualifier for the Aspiration Risk Flag: the observed aspiration event on which the risk determination was based (pulmonary aspiration; silent aspiration as a proposed temporary local code). Does NOT include the at-risk finding itself, which is carried in Observation.code. |
| [Dysphagia Severity / Oral-Intake Scale Type](ValueSet-dysphagia-severity-type-vs.md) | Overall dysphagia severity / functional oral-intake measures for the stroke care transition (DOSS + IDDSI Functional Diet Scale reused from SNOMED; FOIS as a temporary local code pending LOINC/SNOMED submission). DIGEST is deliberately excluded: it is validated for head-and-neck-cancer radiation toxicity, not for stroke, and is surveyed in the coverage assessment only. Its temporary code remains in the local CodeSystem as an upstream-submission candidate. |
| [IDDSI Drink/Fluid Consistency Levels (SNOMED CT)](ValueSet-iddsi-fluid-levels.md) | IDDSI drink-axis consistency levels 0???4 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.fluidConsistencyType. Level 3 is the transitional Moderately Thick concept shared with the food axis. |
| [IDDSI Food Texture Levels (SNOMED CT)](ValueSet-iddsi-food-levels.md) | IDDSI food-axis texture levels 4???7 (SNOMED CT-embedded IDDSI concepts), for NutritionOrder.oralDiet.texture.modifier. The IDDSI food axis spans Levels 3???7; Level 3 (Liquidised) is the shared Moderately Thick concept and is not enumerated here, so it is reached through the extensible binding. |
| [Instrumental Swallow Assessment Type](ValueSet-instrumental-swallow-type-vs.md) | Instrumental swallowing assessments (VFSS/FEES) and associated graded scales (PAS, Yale residue) ??? SNOMED/LOINC where coded, temporary local codes otherwise. |
| [Swallowing Screening Type](ValueSet-swallow-screening-type-vs.md) | Swallowing screening instruments for the stroke care transition (GUSS + Yale Swallow Protocol/3-oz reused from SNOMED; TOR-BSST and EAT-10 as temporary local codes pending LOINC/SNOMED submission). Note that EAT-10 is a patient-reported symptom-severity tool used as a screen rather than a clinician-administered bedside swallow test, and its applicability in acute stroke is limited by aphasia and cognitive impairment. |

### Terminology: Code Systems 

These define new code systems used by systems conforming to this implementation guide.

| | |
| :--- | :--- |
| [Dysphagia Scales ??? temporary local codes (proposed for LOINC/SNOMED)](CodeSystem-dysphagia-scales-temp.md) | Placeholder codes for validated dysphagia measures lacking terminology representation. To be submitted upstream. |

### Example: Example Instances 

These are example instances that show what data produced and consumed by systems conforming with this implementation guide might look like.

| |
| :--- |
| [Example ??? FOIS functional oral-intake level (synthetic)](Observation-ex-dysphagia-severity.md) |
| [Example ??? GUSS bedside screening result (synthetic)](Observation-ex-swallow-screening.md) |
| [Example ??? IDDSI Level 5 diet + mildly thick fluids (synthetic)](NutritionOrder-ex-dysphagia-diet.md) |
| [Example ??? VFSS with Penetration-Aspiration Scale (synthetic)](Observation-ex-instrumental-swallow.md) |
| [Example ??? aspiration risk present (synthetic)](Observation-ex-aspiration-risk.md) |
| [Example ??? dysphagia care-transition summary bundling the transfer package (synthetic)](Composition-ex-care-transition-summary.md) |
| [Example ??? synthetic rehabilitation service (Composition author)](Organization-ex-org.md) |
| [Example ??? synthetic stroke patient (no real data)](Patient-ex-patient.md) |

