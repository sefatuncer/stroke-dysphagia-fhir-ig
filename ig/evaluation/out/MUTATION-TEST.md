# Mutation control for the round-trip check

Cohort: 333 synthetic patients. Baseline: rule fired on 31.

## Branch coverage (unmutated cohort)

| Branch | Patients exercising it |
|---|---|
| Coded aspiration-risk flag present | 75 |
| On thin fluids | 240 |
| NPO exclusion applied | 20 |
| Alert fired | 31 |
| `status = amended` accepted by the rule | 0 — not exercisable (profile fixes status to `final`) |

## Mutation controls

| Mutation | Chain link tested | Role | Resources mutated | Outcomes changed | Alerts after | As expected |
|---|---|---|---|---|---|---|
| `M1-iddsi-code` | CodeableConcept equivalence on IDDSI codes | sensitivity control (alert-suppressing direction) | 240 | 31 | 0 | yes |
| `M2-flag-status` | Observation.status filtering | sensitivity control (alert-suppressing direction) | 75 | 31 | 0 | yes |
| `M3-npo-suppression` | NPO exclusion branch | diagnostic (expects no change) | 20 | 0 | 31 | yes |
| `M4-inject-flag` | alert-generating direction (flag retrieval) | sensitivity control (alert-generating direction) | 258 | 209 | 240 | yes |

**PASS** — 4/4 mutations behaved as expected.

The controls probe the rule in both directions, which matters because the rule is a
conjunction. M1 and M2 each remove a required element, so they can only drive verdicts to
false; on their own they cannot distinguish a genuinely sensitive comparison from one that
collapses trivially. M4 goes the other way — it supplies a conformant flag to patients who
lacked one, so alerts that did not exist must appear. Agreement on the intact pipeline is
therefore evidence rather than a tautology: the comparison is shown to disagree both when
evidence is taken away and when it is added.

M3 is a diagnostic rather than a control, and its result is itself a finding: suppressing
the NPO signal changed no verdict. NPO status and an active thin-fluid order are mutually
exclusive in the generative model, so no NPO patient also satisfies flag ∧ thin fluids.
The NPO branch is therefore executed but is **not outcome-discriminating in this cohort**,
and the round-trip agreement should not be read as having tested it.
