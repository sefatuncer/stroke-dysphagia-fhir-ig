# Independent terminology cross-check (second server)

**Server:** https://terminz.azurewebsites.net/fhir — CSIRO Ontoserver (NZ national terminology service)
**SNOMED CT edition/version reported by the server:** http://snomed.info/sct/21000210109/version/20260720
**Run:** 2026-08-18T14:50:41.906Z

The coverage assessment reported in the manuscript was made against the HL7 reference
terminology server (tx.fhir.org). This run repeats it on a server that shares no code
with it, on a national edition of SNOMED CT released later than the one reported.
Presence calls are additionally checked for their module of origin, so a concept that
exists only in the national extension cannot be counted as confirming the International
Edition.

## Positive controls

| Filter term | Expected concept | Resolved |
|---|---|---|
| Dysphagia Outcome and Severity | 767131006 | yes |
| Gugging | 1289999007 | yes |
| Fibreoptic endoscopic evaluation of swallowing | 311834001 | yes |

## Reused codes

| Group | System | Code | Label | Module | Verdict |
|---|---|---|---|---|---|
| Screening | SNOMED CT | 1289999007 | GUSS | 900000000000207008 | CONFIRMED |
| Screening | SNOMED CT | 717684008 | Yale / 3-oz protocol | 900000000000207008 | CONFIRMED |
| Screening | SNOMED CT | 716854005 | Yale / 3-oz score | 900000000000207008 | CONFIRMED |
| Instrumental | SNOMED CT | 241149003 | VFSS | 900000000000207008 | CONFIRMED |
| Instrumental | SNOMED CT | 311834001 | FEES | 900000000000207008 | CONFIRMED |
| Instrumental | LOINC | 24681-9 | VFSS (LOINC) | — | CONFIRMED |
| Instrumental | LOINC | 86395-1 | VFSS swallowing study (LOINC) | — | CONFIRMED |
| Severity | SNOMED CT | 767131006 | DOSS | 900000000000207008 | CONFIRMED |
| Severity | SNOMED CT | 1231505003 | IDDSI-FDS | 900000000000207008 | CONFIRMED |
| Severity | LOINC | 99852-6 | ASHA-NOMS FCM swallowing panel | — | CONFIRMED |
| IDDSI drink axis | SNOMED CT | 1231508001 | IDDSI drink Level 0 (thin) | 900000000000207008 | CONFIRMED |
| IDDSI drink axis | SNOMED CT | 1237441005 | IDDSI drink Level 1 | 900000000000207008 | CONFIRMED |
| IDDSI drink axis | SNOMED CT | 1237442003 | IDDSI drink Level 2 | 900000000000207008 | CONFIRMED |
| IDDSI drink axis | SNOMED CT | 1237444002 | IDDSI Level 3 (shared axis) | 900000000000207008 | CONFIRMED |
| IDDSI drink axis | SNOMED CT | 1237446000 | IDDSI drink Level 4 | 900000000000207008 | CONFIRMED |
| IDDSI food axis | SNOMED CT | 1237447009 | IDDSI food Level 4 | 900000000000207008 | CONFIRMED |
| IDDSI food axis | SNOMED CT | 1237448004 | IDDSI food Level 5 | 900000000000207008 | CONFIRMED |
| IDDSI food axis | SNOMED CT | 1237449007 | IDDSI food Level 6 | 900000000000207008 | CONFIRMED |
| IDDSI food axis | SNOMED CT | 1237450007 | IDDSI food Level 7 (easy to chew) | 900000000000207008 | CONFIRMED |
| IDDSI food axis | SNOMED CT | 1237451006 | IDDSI food Level 7 (regular) | 900000000000207008 | CONFIRMED |
| Core findings | SNOMED CT | 371736008 | At risk for aspiration | 900000000000207008 | CONFIRMED |
| Core findings | SNOMED CT | 68052005 | Pulmonary aspiration | 900000000000207008 | CONFIRMED |
| Core findings | SNOMED CT | 40739000 | Dysphagia | 900000000000207008 | CONFIRMED |
| Core findings | SNOMED CT | 182923009 | Nil by mouth | 900000000000207008 | CONFIRMED |
| Cohort criterion | SNOMED CT | 230690007 | Cerebrovascular accident | 900000000000207008 | CONFIRMED |
| Hierarchy anchor | SNOMED CT | 273249006 | Assessment scale | 900000000000207008 | CONFIRMED |

**26/26 confirmed.**

## Absence calls re-tested

| Measure | Filter terms | In-domain candidates | Screened out | Verdict |
|---|---|---|---|---|
| FOIS | `Functional Oral Intake`, `FOIS`, `oral intake scale` | 0 | 0 | GAP-REPRODUCED |
| PAS | `Penetration-Aspiration Scale`, `Penetration Aspiration`, `Rosenbek` | 0 | 0 | GAP-REPRODUCED |
| DIGEST | `Dynamic Imaging Grade`, `DIGEST`, `swallowing toxicity` | 0 | 30 | GAP-REPRODUCED |
| TOR-BSST | `Toronto Bedside`, `TOR-BSST`, `bedside swallowing screening test` | 0 | 0 | GAP-REPRODUCED |
| V-VST | `Volume-Viscosity`, `Volume Viscosity`, `V-VST` | 0 | 0 | GAP-REPRODUCED |
| EAT-10 | `Eating Assessment Tool`, `EAT-10` | 0 | 0 | GAP-REPRODUCED |
| Yale Pharyngeal Residue | `Pharyngeal Residue`, `Yale Pharyngeal` | 0 | 0 | GAP-REPRODUCED |
| MBSImP | `Modified Barium Swallow Impairment`, `MBSImP` | 0 | 0 | GAP-REPRODUCED |
| silent aspiration | `Silent aspiration` | 0 | 0 | GAP-REPRODUCED |
| laryngeal penetration | `Laryngeal penetration`, `penetration of larynx` | 0 | 0 | GAP-REPRODUCED |

Screening rule, stated before the run: a lexical hit counts as a candidate only if its display carries swallowing-domain vocabulary (swallow, deglut, dysphag, aspirat, pharyn, laryng, oral intake, bolus, penetration). Screened-out hits are kept in the JSON record.

**10/10 absence calls reproduced.**

## Verdict

The second server reproduces the coverage assessment in full.
