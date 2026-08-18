# Cohort conformance — the deposited evaluation bundles

The evaluation retrieves by code and ignores `meta.profile`, so executing the rule does
not by itself show that the synthetic cohort conforms to the profiles it claims. This run
checks that separately: every deposited bundle is validated against the built IG package.

- Bundles validated: **333**
- Bundles with an error-severity issue: **0**
- Issues by severity: error 0, warning 2731, information 0

No error-severity issue was raised on any bundle.

The warnings are the expected shape for generated data and are reported rather than
suppressed: `dom-6` (no narrative — these resources are machine-generated and never
rendered), the base-FHIR best practice that observations carry a performer (the model
does not simulate clinicians), and `nor-1` on the nil-by-mouth orders, which by design
carry no oral diet, supplement or enteral formula.
