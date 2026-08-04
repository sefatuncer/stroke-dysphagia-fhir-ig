# Supplementary File S5 — Negative ("should-fail") conformance fixtures: constraint coverage and rejection signatures

A profile that only accepts conforming data has not been shown to constrain anything. The eight
fixtures below each violate **exactly one** constraint and must be **rejected**. A rejection counts
only when the server's error carries the signature of the constraint under test — an
unresolvable-profile complaint, or an unrelated base-FHIR error, does not count. This file reports
the full set, so the claim in §4.3 can be audited item by item rather than from two examples.

Fixtures are in `ig/conformance/negative-fixtures/`; the machine-readable run is
`ig/conformance/out/negative-conformance.json`, deposited with the artifact. Signatures are quoted
verbatim from that file and truncated only where the canonical URL repeats.

**Server:** the independently deployed HAPI FHIR server (v8.10.0, digest-pinned), via
`$validate` against the declared profile. Positive examples were validated on both the reference
validator and this server; the negative suite was run on this server only (§3.5, §5.3-3).

## Rejection signatures

| # | Fixture | Resource | Constraint under test | Constraint type | Rejection signature (verbatim) |
|---|---|---|---|---|---|
| 1 | `neg-aspiration-preliminary` | Observation | `AspirationRiskFlag.status` fixed to `final` | fixed value | `Value is 'preliminary' but is fixed to 'final' in the profile …/aspiration-risk-flag` |
| 2 | `neg-aspiration-wrongcode` | Observation | `AspirationRiskFlag.code` pattern SNOMED `371736008` | pattern on CodeableConcept | `The pattern [system http://snomed.info/sct, code 371736008, and display 'null'] defined in the profile …/aspiration-risk-flag not found` |
| 3 | `neg-diet-drink-code-on-food` | NutritionOrder | invariant `iddsi-axis-food` | FHIRPath invariant | `Constraint failed: iddsi-axis-food: 'A drink-only IDDSI concept must not be used on texture.modifier…'` |
| 4 | `neg-diet-food-code-on-fluid` | NutritionOrder | invariant `iddsi-axis-fluid` | FHIRPath invariant | `Constraint failed: iddsi-axis-fluid: 'A food-axis IDDSI concept must not be used on fluidConsistencyType…'` |
| 5 | `neg-instrumental-pas-out-of-range` | Observation | invariant `pas-range` (1–8) | FHIRPath invariant | `Constraint failed: pas-range: 'The Penetration-Aspiration Scale is an 8-point ordinal scale…'` |
| 6 | `neg-screening-noeffective` | Observation | `effective[x]` tightened to 1..1 | cardinality | `Observation.effective[x]: minimum required = 1, but only found 0 (from …/swallowing-screening-result)` |
| 7 | `neg-severity-nosubject` | Observation | `subject` tightened 0..1 → 1..1 | cardinality | `Observation.subject: minimum required = 1, but only found 0 (from …/dysphagia-severity)` |
| 8 | `neg-summary-no-entry` | Composition | invariant `dct-has-content` | FHIRPath invariant | `Constraint failed: dct-has-content: 'A care-transition summary must carry at least one section entry…'` |

All eight were rejected at **error** severity, each with the signature of its own constraint, and
none of the eight failed merely because a profile could not be resolved.

### A note on fixture 8

An earlier version of this fixture carried section titles with no narrative, which base FHIR's own
`cmp-1` constraint ("a section must contain at least one of text, entries, or sub-sections")
rejects before the IG's invariant is reached. Because that would have credited the IG with a
rejection base FHIR produced, the fixture was tightened: each section now carries narrative, so
`cmp-1` is satisfied and `dct-has-content` is the only constraint that can fail. The signature
above is from the tightened fixture.

## Profile coverage

| Profile | Covered by fixture | Constraint exercised |
|---|---|---|
| `AspirationRiskFlag` | 1, 2 | fixed status, required SNOMED coding |
| `DysphagiaNutritionOrder` | 3, 4 | both IDDSI axis invariants |
| `InstrumentalSwallowAssessment` | 5 | PAS range invariant |
| `SwallowingScreeningResult` | 6 | tightened cardinality |
| `DysphagiaSeverity` | 7 | tightened cardinality |
| `DysphagiaCareTransitionSummary` | 8 | minimum-content invariant |

All six profiles are exercised.

## Constraints **not** exercised by the negative suite

Reported so that the suite's coverage is not overstated:

- **`Composition.type` fixed to LOINC `34133-9`** and **`section.entry` constrained** on the
  care-transition summary — both are presented as contributions in Table 1, but no fixture violates
  them; fixture 8 exercises only the minimum-content invariant.
- **Extensible bindings** on the four assessment profiles' `code` elements. These are extensible by
  design (§3.3), so a code outside the value set is *not* an error and cannot be tested by a
  should-fail fixture; this is why axis separation rests on invariants rather than binding strength.
- **Terminology-server-dependent checks** (display validation, subsumption). The rule matches codes
  directly and the harness needs no external terminology server, so these paths are untested here.

Extending the suite to the first group is straightforward and is the obvious next increment.

## A note on fixture 2, and on what the flag profile does *not* reject

An earlier release of the flag profile fixed `code.coding.system` and `code.coding.code`
directly. A constraint on a repeating element applies to every repetition, so an instance
carrying a site's local flag code *alongside* the SNOMED translation — the ordinary shape of
mapped EHR data, and the situation the manuscript's §5.4 describes — failed validation. In
the release reported here the pattern sits on `code` itself, which requires one matching
SNOMED coding and lets translations travel beside it. Fixture 2 still fails, for the same
reason and with the signature quoted above; the rejection message changed with the
constraint, which is why the table records the current one.

The suite therefore does not test, and the profile does not reject, an instance that carries
the required SNOMED coding plus additional local codings. That is intended behavior rather
than a coverage gap, and it is recorded here so the two are not confused.
