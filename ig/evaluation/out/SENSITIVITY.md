# Sensitivity analysis — interoperability-gap vs coding-completeness (synthetic)

Cohort N = 333 synthetic stroke patients. 40 seeds per parameter value. **The invisibility rate among clinically-unsafe cases tracks (1 − P(coded)) by construction; this demonstrates the mechanism, it is not an empirical estimate.**

## Primary run (paper's headline; seed 20260716, P(coded)=0.70)
- clinically-unsafe cases: **47**; invisible (un-coded flag): **16**
- invisibility rate = 16/47 = **34.0%** (no inferential interval is attached: this is a by-construction property of the model, not an estimate of a real-world quantity)
- expected by design: 1 − 0.70 = 30.0%

## Sweep over coding-completeness P(coded) — 40 seeds each

| P(coded) | expected 1−P | mean invisibility (±SD) | range | mean unsafe n | mean trigger |
|---|---|---|---|---|---|
| 0.50 | 50.0% | **50.1% (±8.5)** | 32.6–64.7% | 43 | 6.5% |
| 0.60 | 40.0% | **39.8% (±7.5)** | 25.0–58.5% | 43 | 7.8% |
| 0.70 | 30.0% | **30.0% (±7.5)** | 15.0–51.2% | 43 | 9.1% |
| 0.80 | 20.0% | **20.1% (±6.0)** | 7.5–31.8% | 43 | 10.4% |
| 0.90 | 10.0% | **10.5% (±5.0)** | 0.0–21.2% | 43 | 11.7% |

**Interpretation:** invisibility rate ≈ (1 − P(coded)) across the whole range — the rule cannot see un-coded flags, so the yield of the computable safety check is a direct, monotone function of documentation-coding completeness. The single headline figure is one point on this line, not an independent measurement.
