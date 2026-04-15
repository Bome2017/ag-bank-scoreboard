# A/G Scoreboard — Expanded Benchmark Comparison

**Date:** April 14, 2026
**Script:** `benchmark_expansion.py`
**Outputs:** `output/benchmark_expansion_summary.csv`, `output/benchmark_expansion_decile_detail.csv`

---

## Purpose

The existing walk-forward validation compared MHI against two baselines: G-only (1/G) and a Texas-ratio proxy. This note expands the baseline set to test whether the A/G system's structural choices — multi-component Ground with min aggregation, the ratio form of MHI — add measurable value over simpler or alternative constructions.

The goal is not exhaustive benchmarking. It is to determine whether the system remains meaningfully differentiated against a somewhat tougher set of comparators.

---

## Baselines Tested

Seven metrics were evaluated on three targets (internal 4Q deterioration, external FDIC failure within 8Q, external Texas-ratio distress within 4Q) across four time windows (GFC, Post-Crisis, Recent, Full panel).

| Metric | Construction | What it tests |
|--------|-------------|---------------|
| **MHI** | A / G (production system) | Full A/G ratio |
| **G-only** | 1 / G (min of 4 components) | Structural channel alone |
| **Texas proxy** | (Nonperforming + OREO) / (Equity + Reserves) | Established external distress ratio |
| **NCL-only** | 1 / ncl_score (single noncurrent-loans transform) | Whether one component explains most of G's power |
| **Mean-G** | 1 / mean(4 G components) | Whether the min operator specifically matters |
| **ROA-only** | 1 / roa_score (profitability alone) | Simplest surface-performance check |
| **G+A blend** | 0.5 × (1−G) + 0.5 × A | Additive combination vs. ratio form |

---

## Results: Internal Target (Own-Tier Deterioration)

On the system's own tier-transition target, the existing system performs well against all baselines.

| Window | MHI | G-only | Texas | NCL | Mean-G | ROA | G+A blend |
|--------|-----|--------|-------|-----|--------|-----|-----------|
| GFC | 80.6* | 81.2* | 60.0* | 78.8* | 76.4* | 14.1 | 82.5* |
| Post-Crisis | 87.4* | 83.8* | 39.3 | 83.0* | 72.9* | 5.8 | 80.9* |
| Recent | 65.2* | 67.1 | 20.1 | 63.6 | 58.7 | −5.0 | 60.8* |
| Full | 81.0* | 81.5* | 43.6 | 78.5* | 72.1* | 6.7 | 77.9* |

Values are D10−D1 spread in percentage points. * = fully monotonic across all 10 deciles.

**Key observations on internal targets:**

MHI is monotonic in every window. G-only is also monotonic in most windows. The G+A blend performs comparably but adds no value over MHI. NCL-only reaches ~97% of G-only's spread, confirming noncurrent loans carry most of the structural signal, though the multi-component min construction adds a few percentage points of internal spread. Mean-G consistently underperforms min-G by 5–10pp, confirming the aggregation-operator finding: min preserves more internal discrimination than mean. ROA alone is essentially uninformative on internal targets. Texas proxy performs well during the GFC but degrades substantially in lower-stress windows.

---

## Results: External Failure Target (FDIC Closure within 8Q)

The GFC window (2006Q1–2012Q4) is the only window with sufficient base rate (1.73%) for meaningful comparison. Post-Crisis and Recent windows have base rates of 0.20% and 0.07% respectively — too sparse for reliable decile discrimination.

**GFC window, failure within 8 quarters:**

| Metric | Spread (pp) | Monotonic | D10 rate | D1 rate |
|--------|------------|-----------|----------|---------|
| **Mean-G** | **13.8** | No (1 inv.) | 13.85% | 0.08% |
| **G-only** | **13.0** | **Yes** | 13.08% | 0.10% |
| NCL-only | 11.9 | No (1 inv.) | 12.09% | 0.17% |
| ROA-only | 10.8 | No (3 inv.) | — | — |
| Texas proxy | 10.3 | No (2 inv.) | — | — |
| MHI | 7.2 | No (3 inv.) | 8.70% | 1.49% |
| G+A blend | 1.6 | No (4 inv.) | 1.83% | 0.21% |

*Note on MHI spread: The benchmark harness includes inf-MHI observations (406 bank-quarters with G ≤ 0.001) in decile assignment, which inflates D10 from 7.17% to 8.70% and widens the reported spread to 7.2pp. The walk-forward memo excludes these via a finite-value filter and reports 5.7pp. Both are procedurally correct; the difference is cohort composition, not methodology. The walk-forward figure (5.7pp) is the canonical public citation for MHI's external spread.*

**What this adds to existing findings:**

Mean-G (mean of the four G components, inverted) achieves the widest raw spread on external failure — slightly exceeding G-only (min). This is notable: for *external* prediction, the mean operator is marginally better than min, the reverse of the internal-target result. The likely explanation is that mean incorporates information from all four components rather than discarding three, which helps when any component can drive failure (not just the weakest one).

However, G-only is the only metric that achieves full monotonicity on external failure in the GFC window. Mean-G has one inversion. This means G-only provides the most ordinal-reliable ranking even though Mean-G has slightly wider tail spread.

NCL-only captures ~92% of G-only's external spread. The multi-component structure adds incremental value, but the single noncurrent-loans variable does most of the work.

ROA-only (10.8pp) performs surprisingly well on external failure — profitability alone discriminates external outcomes comparably to the Texas proxy (10.3pp). Both trail the structural G metrics.

The G+A blend is the weakest performer (1.6pp). Mixing appearance additively with structure does not produce useful external discrimination. The additive form conflates protective surface performance with structural weakness rather than separating them. MHI at least concentrates tail signal in D10 (8.70%); the blend diffuses it.

---

## Results: External Texas-Distress Target

**GFC window, Texas ratio > 1.0 within 4 quarters:**

| Metric | Spread (pp) | Monotonic |
|--------|------------|-----------|
| Texas proxy | 16.1 | No (2 inv.) |
| Mean-G | 15.3 | No (2 inv.) |
| G-only | 14.7 | No (1 inv.) |
| NCL-only | 13.4 | No (1 inv.) |
| ROA-only | 12.3 | No (1 inv.) |
| MHI | 6.7 | No (3 inv.) |
| G+A blend | 1.2 | No (5 inv.) |

The Texas proxy leads on its own target, as expected — it directly measures the distress numerator. Mean-G again slightly outperforms min-G (15.3 vs 14.7pp). The full-panel result is the only case where any metric achieves monotonicity on an external target: Mean-G on Texas distress (5.5pp, monotonic across full panel).

---

## What the Tougher Baselines Reveal

**The multi-component G structure adds real but modest value over NCL-only.** On external failure, G-only achieves 13.0pp spread vs NCL-only's 11.9pp — an incremental ~1.1pp from the three additional components. The value is larger on internal targets (~3pp). The multi-component structure is not gratuitous, but noncurrent loans do most of the structural work.

**The min operator is better for internal targets; mean is marginally better for external targets.** Min-G outperforms mean-G on internal targets by 5–10pp across windows. Mean-G slightly outperforms min-G on external failure (13.8 vs 13.0pp in GFC). The min operator shapes the warning surface to detect weakest-link structural problems; the mean operator distributes information more evenly, which marginally helps when the failure mechanism is multi-causal. This is the expected trade-off documented in the Aggregation Operator Note: min makes a design choice to prioritize bottleneck detection over balanced scoring.

**MHI (the ratio) does not outperform its components on external targets.** MHI ranks 6th of 7 on external failure spread and 6th of 7 on Texas distress. Only the G+A blend is worse. Dividing A by G creates a ratio that conflates two distinct signals — G's structural risk (external-valid) and A's protective surface performance (which *reduces* external failure risk within a weak-G band). The ratio form is specifically designed for internal tier structure, not external prediction, and the expanded benchmarks confirm this.

**The G+A blend is the worst performer on every external target.** Additive combination of structure and surface destroys both signals. This validates the A/G framework's decision to keep G and A as separate channels rather than combining them into a single score. The separation is a genuine design insight even though the ratio form doesn't help externally.

**ROA-only is a surprisingly competent external baseline.** At 10.8pp on GFC failure, simple profitability ranks above MHI and comparably to the Texas proxy. Any external-prediction claim for the A/G system must clear this bar. G-only does (13.0pp > 10.8pp). MHI does not (7.2pp < 10.8pp).

---

## Honest Summary

The expanded benchmarks reinforce the walk-forward validation's central finding: **G is the externally valid channel.** G-only outperforms or matches every baseline except Mean-G (which uses the same four variables with different aggregation) and the Texas proxy on its own distress target. G is not a trivial metric — it outperforms NCL-only, ROA-only, and Texas proxy on external failure, while providing the only monotonic external-failure gradient in the GFC window.

MHI's value is internal: it is the strongest monotonic discriminator on the system's own tier-transition target. It is not competitive with G-only, Mean-G, NCL-only, ROA-only, or Texas proxy on external targets. This is not a failure of the system — it is a correct characterization of what MHI measures. MHI detects performed continuation (surface outrunning structure). G detects structural viability. These are different constructs with different validation profiles.

The system's design choices — multi-component G, min aggregation, channel separation — are defensible. Multi-component G adds ~1pp of external spread over NCL-only. Min aggregation is better for internal targets (the system's stated purpose) at a small external cost. Channel separation prevents the signal destruction seen in the G+A blend. What the system should not claim is that MHI predicts external outcomes. It does not.

---

*Script: `benchmark_expansion.py`. Full decile-by-decile results in `output/benchmark_expansion_decile_detail.csv`.*
