# Differential check: a second implementation of the rule

The first implementation is the CQL library compiled to ELM and executed on
`cql-execution` with `cql-exec-fhir`. The second walks the serialized FHIR JSON
directly and was written from the rule statement printed in the manuscript (§3.6),
not from the CQL source; it shares no library with the first.

**What this does and does not establish.** Both implementations were written by the
same authors, so a misconception about the clinical question would survive in both.
What is measured is whether the CQL, as compiled and executed, does what the paper
says it does — specification-to-code fidelity. The co-design limitation is unaffected.

Condition 3 was run under two readings and both are reported, because the first
run is what located the difference between them.

| Reading of condition 3 | Comparison set | Compared | Agreements | Disagreements |
|---|---|---|---|---|
| as-printed | deposited cohort | 333 | 333 | 0 |
| as-printed | hand-authored branch fixtures | 12 | 11 | 1 |
| as-specified | deposited cohort | 333 | 333 | 0 |
| as-specified | hand-authored branch fixtures | 12 | 12 | 0 |

## What the difference was

The literal reading of condition 3 disagreed with the first implementation, on inputs where a retracted nil-by-mouth record is present. The CQL applies a status filter the printed sentence omitted. Adjudicated in favour of the artifact — suppressing an alert on an entered-in-error record is the unsafe direction — and the manuscript sentence was corrected. No change was made to the rule.

- *as-printed* — **F11** (hand-authored branch fixtures): first implementation alert, second no alert. Second implementation saw: coded risk flag true, active thin-fluid order true, nil-by-mouth true.
