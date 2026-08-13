# Sensitivity analysis — interoperability-gap vs coding-completeness (synthetic)

Cohort N = 333 synthetic stroke patients. 40 seeds per parameter value. **The invisibility rate among rule-target cases tracks (1 − P(coded)) by construction; this demonstrates the mechanism, it is not an empirical estimate.**

## Primary run (paper's headline; seed 20260716, P(coded)=0.70)
- rule-target cases: **47**; invisible (un-coded flag): **16**
- invisibility rate = 16/47 = **34.0%** (no inferential interval is attached: this is a by-construction property of the model, not an estimate of a real-world quantity)
- expected by design: 1 − 0.70 = 30.0%

## Sweep over coding-completeness P(coded) — 40 seeds each

Base cohort source: **deposited cohort (ig/evaluation/cohort)**.

| P(coded) | expected 1−P | mean invisibility (±SD) | MCSE (pp) | analytic binomial SD (pp) | range | mean unsafe n | mean trigger |
|---|---|---|---|---|---|---|---|
| 0.50 | 50.0% | **50.1% (±8.5)** | 1.34 | 7.59 | 32.6–64.7% | 43 | 6.5% |
| 0.60 | 40.0% | **39.8% (±7.5)** | 1.19 | 7.44 | 25.0–58.5% | 43 | 7.8% |
| 0.70 | 30.0% | **30.0% (±7.5)** | 1.18 | 6.96 | 15.0–51.2% | 43 | 9.1% |
| 0.80 | 20.0% | **20.1% (±6.0)** | 0.95 | 6.07 | 7.5–31.8% | 43 | 10.4% |
| 0.90 | 10.0% | **10.5% (±5.0)** | 0.80 | 4.55 | 0.0–21.2% | 43 | 11.7% |

**Interpretation:** invisibility rate ≈ (1 − P(coded)) across the whole range — the rule cannot see un-coded flags, so the yield of the computable safety check is a direct, monotone function of documentation-coding completeness. The single headline figure is one point on this line, not an independent measurement.
