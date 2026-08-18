# Branch coverage of the AspirationRiskAlert rule

Twelve fixtures written by hand from the rule statement — not produced by the
generative model that supplies the cohort — each isolating one cell of the rule's
truth table. The expected verdict was recorded in the fixture definition before the
engine ran. The same compiled ELM and the same engine as the cohort run are used.

Three fixtures are marked non-conformant: they violate a profile constraint on
purpose in order to reach a branch that conformant data cannot reach. They are
evidence about the rule, not about the profiles.

| # | Fixture | Branch covered | Conformant | Expected | Observed | Agrees |
|---|---|---|---|---|---|---|
| F01 | flag + thin fluids + not nil-by-mouth | the conjunction satisfied — the alert-raising cell | yes | alert | alert | yes |
| F02 | flag + thickened fluids (IDDSI Level 2) | the thin-fluid conjunct false | yes | no alert | no alert | yes |
| F03 | flag + thin fluids + nil-by-mouth as an Observation | the nil-by-mouth exclusion in its Observation form — never emitted by the cohort | yes | no alert | no alert | yes |
| F04 | flag + thin fluids + an active order carrying no oral diet | the nil-by-mouth exclusion in its order form | yes | no alert | no alert | yes |
| F05 | no flag + thin fluids | the flag conjunct false | yes | no alert | no alert | yes |
| F06 | flag + thin fluids on a cancelled order | the order status filter | yes | no alert | no alert | yes |
| F07 | flag with status `amended` + thin fluids | the `amended` arm of the status filter — unreachable for profile-conformant data | no | alert | alert | yes |
| F08 | flag recorded years earlier + thin fluids | temporal scope: the rule carries no validity period, so a stale flag still fires | yes | alert | alert | yes |
| F09 | flag + a subsumed IDDSI concept instead of the Level 0 code | code-level matching: the rule matches the thin-fluid code directly, not by value-set membership or subsumption | no | no alert | no alert | yes |
| F10 | flag with status `preliminary` + thin fluids | the status filter in the alert-raising direction | no | no alert | no alert | yes |
| F11 | nil-by-mouth Observation with status `entered-in-error` + flag + thin fluids | the suppressing branch must not be silenced by a retracted record | yes | alert | alert | yes |
| F12 | no flag, no order | the empty case | yes | no alert | no alert | yes |

**12/12 fixtures behaved as specified.**

No fixture disagreed with its pre-recorded expectation.

## Non-conformant fixtures and why they are here

- **F07** — AspirationRiskFlag fixes Observation.status to `final`; this fixture violates that on purpose to reach the branch.
- **F09** — The drink-axis value set enumerates Level 0 as 1231508001; this fixture uses the IDDSI Framework parent concept, which the binding does not enumerate.
- **F10** — AspirationRiskFlag fixes Observation.status to `final`.
