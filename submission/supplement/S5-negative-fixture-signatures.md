# Supplementary File S5 — Negative ("should-fail") conformance fixtures: constraint coverage and rejection signatures

A profile that only accepts conforming data has not been shown to constrain anything. The ten
fixtures below each violate **exactly one** constraint and must be **rejected**. A rejection counts
only when the server's error carries the signature of the constraint under test — an
unresolvable-profile complaint, or an unrelated base-FHIR error, does not count. This file reports
the full set, so the claim in §4.3 can be audited item by item rather than from two examples.

Fixtures are in `ig/conformance/negative-fixtures/`; the machine-readable run is
`ig/conformance/out/negative-conformance.json`, deposited with the artifact. Signatures are quoted
verbatim from that file and truncated only where the canonical URL repeats.

**Deployments:** both the independently deployed HAPI FHIR server (v8.10.0, digest-pinned,
via `$validate` against the declared profile) and the HL7 reference validator
(`validator_cli.jar`, against the built IG package). Both suites ran on both deployments, and all four
machine-readable records are deposited: `positive-conformance.json` and
`negative-conformance.json` (HAPI), `positive-conformance-cli.json` and
`negative-conformance-cli.json` (reference validator). Both share the HL7 Java
validation core, so this is portability across deployments, not independence across
implementations (§5.3-3).

> **Fixture 4 was corrected (13 Aug 2026).** `neg-diet-food-code-on-fluid` carried a display term
> on `1237449007` that the reference validator rejected as a wrong display name for the concept.
> It produced a second error alongside the invariant under test, so the fixture did not satisfy
> the "exactly one violated rule" rule this suite is built on — and the string was not verbatim,
> which the licensing argument requires of every display the artifact carries. The identifier now
> travels alone, and every fixture fails for exactly the constraint it targets on both
> deployments.

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
| 9 | `neg-summary-wrong-type` | Composition | `Composition.type` fixed to LOINC `34133-9` | pattern on CodeableConcept | `The pattern [system http://loinc.org, code 34133-9, and display 'null'] defined in the profile …/dysphagia-care-transition-summary not found` |
| 10 | `neg-summary-foreign-entry` | Composition | `section.entry` restricted to this IG's profiles | reference target type | `Invalid Resource target type. Found Condition, but expected one of ([NutritionOrder, Observation])` |

All ten were rejected at **error** severity, each with the signature of its own constraint, and
none of the ten failed merely because a profile could not be resolved.

Fixtures 9 and 10 were added for the release reported here, closing the coverage gap the previous
version of this file recorded: every constraint Table 1 presents as a contribution is now exercised
by a should-fail fixture. Fixture 10 carries its Condition as a **contained** resource on purpose —
with an external reference the validator cannot resolve the target and skips the type check
altogether, so the fixture would pass silently and prove nothing.

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
| `DysphagiaCareTransitionSummary` | 8, 9, 10 | minimum-content invariant, fixed document type, restricted section entries |

All six profiles are exercised, and so is every constraint Table 1 names.

## Constraints **not** exercised by the negative suite

Reported so that the suite's coverage is not overstated:

- **Extensible bindings** on the four assessment profiles' `code` elements. These are extensible by
  design (§3.3), so a code outside the value set is *not* an error and cannot be tested by a
  should-fail fixture; this is why axis separation rests on invariants rather than binding strength.
- **Terminology-server-dependent checks** (display validation, subsumption). The rule matches codes
  directly and the harness needs no external terminology server, so these paths are untested here.

Neither group can be closed by a should-fail fixture: an extensible binding makes an outside code
legal by design, and the terminology-server-dependent checks are outside the harness's scope.

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
