# A/G Scoreboard — Aggregation Operator Note

**Date:** April 15, 2026
**Status:** Design-choice defense with empirical evidence across four operators
**Depends on:** `sensitivity_analysis.py`, `output/sensitivity_summary.csv`, walk-forward and benchmark expansion results

---

## 1. The Design Choice

The Ground channel (G) is computed from four transformed components: Tier 1 Leverage, Total Risk-Based Capital, Noncurrent Loans, and Net Charge-offs. The instrument uses the **minimum** of these four values as G.

This is a modeling choice, not a mathematical necessity. It is also the single structural joint most likely to draw the objection "you could have chosen differently and gotten different results." This note states the assumption explicitly, tests every natural alternative, and defends the choice against the instrument's stated purpose.

---

## 2. The Bottleneck Axiom

The min operator encodes the following proposition:

> **A bank's structural viability is bounded by its single weakest structural dimension. Strength in other dimensions does not compensate for a critically impaired one.**

This is a testable design assumption, not a discovered law. It implies that a bank with excellent capital ratios but severely impaired asset quality (high noncurrent loans) is structurally constrained by the impairment, regardless of its capital strength. Conversely, a bank cannot offset one critically weak dimension by being strong in the others.

The assumption has a regulatory analogue: bank supervisors assess structural soundness by the binding constraint. A bank that is well-capitalized but has a severely impaired loan book is not considered structurally sound on balance — it is considered structurally compromised in the dimension that matters most at that moment. The "binding G component" reported per bank in the dashboard is a direct expression of this logic.

The alternatives relax this assumption in specific, measurable ways.

---

## 3. The Operator Family

Four operators were tested. They form a natural ordering from strictest to most permissive:

| Operator | Formula | Compensation allowed? | Sensitivity to single weak component |
|----------|---------|----------------------|-------------------------------------|
| **Min** (default) | min(g₁, g₂, g₃, g₄) | None | Maximum — G equals the weakest |
| **Weighted min** | min(gᵢ / wᵢ) | None (reweights, but still bottleneck) | Maximum, with asymmetric emphasis |
| **Geometric mean** | (g₁ · g₂ · g₃ · g₄)^(1/4) | Partial — strong components pull G up | High — sensitive to low values but not floored by them |
| **Harmonic mean** | 4 / (1/g₁ + 1/g₂ + 1/g₃ + 1/g₄) | Partial — more compensation than geometric | Moderate — weighted toward low values but allows substantial offset |

Arithmetic mean (tested separately in the benchmark expansion as "Mean-G") is the most permissive: full compensation, minimal sensitivity to any single component. It is included in the comparison table below for completeness.

---

## 4. Empirical Consequences

### 4a. G Distribution (2025Q4)

The operator choice reshapes the entire G distribution, not just the tails:

| Percentile | Min | Geometric | Harmonic | Mean* |
|-----------|-----|-----------|----------|-------|
| P1 | 0.184 | 0.568 | 0.435 | — |
| P5 | 0.359 | 0.711 | 0.645 | — |
| P10 | 0.457 | 0.777 | 0.731 | — |
| P25 | 0.628 | 0.861 | 0.844 | — |
| P50 (median) | 0.800 | 0.930 | 0.925 | — |
| P75 | 0.931 | 0.978 | 0.977 | — |

*Mean-G distributional percentiles are not computed in this harness; see BENCHMARK_EXPANSION_NOTE.md for Mean-G validation results.

Min produces the widest G distribution. The critical range for the tier system is G < 0.5 (Watch and Critical). Under min, 10% of banks fall below G = 0.457. Under geometric mean, the P10 rises to 0.777 — nearly all banks exit the tier system's operating range. Harmonic mean falls between but closer to geometric.

This is the core mechanism: any operator that allows compensation compresses the G distribution upward, pushing banks out of the Watch band and collapsing the warning surface.

### 4b. Tier System Impact (2025Q4)

| Tier | Min | Geometric | Harmonic | Weighted Min |
|------|-----|-----------|----------|-------------|
| Critical | 13 | 2 | 6 | 13 |
| Watch | 483 | **11** | **47** | 483 |
| Diverging | 334 | 45 | 74 | 330 |
| Stable | 3,578 | 4,350 | 4,281 | 3,578 |
| Median G | 0.800 | 0.930 | 0.925 | 0.800 |

Geometric mean dissolves the Watch layer almost entirely: 483 → 11 (98% reduction). Harmonic mean reduces it by 90%. Weighted min (asset-quality components weighted 1.25x) is indistinguishable from min. The bottleneck structure dominates; the weighting adds negligible information.

### 4c. Internal Validation (Tests A, B, C)

| Metric | Min | Geometric | Harmonic | Weighted Min |
|--------|-----|-----------|----------|-------------|
| Test A lift (same-band) | 1.79x | 2.38x | 2.22x | 1.80x |
| Test A Watch N | 222,381 | 10,751 | 30,767 | 218,824 |
| Test B spread (pp) | 81.0 | 11.7 | 28.8 | 81.2 |
| Test B monotonic | **Yes** | No (4 inv.) | No (3 inv.) | **Yes** |
| Test B D1 | 6.7% | 1.3% | 1.9% | 6.6% |
| Test B D10 | 87.7% | 13.0% | 30.7% | 87.7% |
| Test C Run 1 → Critical | 74.2% | — | 65.9% | 74.4% |
| Test C Run 10 → Critical | 92.2% | — | 85.5% | 92.2% |

Test A lift is *higher* under geometric and harmonic — but this is an artifact of small denominators. The non-Watch group under geometric contains only 12,668 observations (vs. 29,209 under min), and the Watch group only 10,751 (vs. 222,381). The higher lift reflects a more extreme but much sparser selection, not a stronger signal.

Test B is decisive. Under min, MHI decile spread is 81.0pp with perfect monotonicity. Under geometric mean, spread collapses to 11.7pp with 4 inversions. Harmonic mean reaches 28.8pp with 3 inversions. Only min and weighted min preserve monotonicity.

Test C persistence results for geometric mean are unreliable due to tiny N (477 at run 5, 115 at run 10) — a consequence of the nearly empty Watch layer.

### 4d. External Discrimination

The operator choice has minimal effect on G's external predictive power. From the walk-forward and benchmark expansion results:

| Metric | Min G | Harmonic G | Mean G* |
|--------|-------|------------|---------|
| GFC failure spread (1/G deciles) | 13.0pp | ~14.1pp | 13.8pp |
| GFC failure monotonic (1/G) | Yes | No | No (1 inv.) |

*Mean-G figures from BENCHMARK_EXPANSION_NOTE.md (within-quarter decile assignment). Min-G and Harmonic-G figures from the sensitivity harness (pooled decile assignment), which produces slightly different absolute values. See note at end of section.

All three operators produce comparable G-only external discrimination: 13–14pp spread on GFC-era bank failure. The aggregation operator does not determine whether G predicts external failure. It determines the shape of the internal warning surface.

This is the key finding: **the choice between operators is a choice about the warning surface, not about external predictive power.** External validity is carried by the G components themselves, regardless of how they are aggregated. The operator shapes how many banks the tier system flags and how granularly it differentiates them.

*Note on spread values: The sensitivity harness uses pooled-across-quarter decile assignment, producing slightly different absolute values than the walk-forward script (within-quarter deciles). Canonical external-validation figures are in WALKFORWARD_EXTERNAL_VALIDATION.md (G-only: 13.0pp) and BENCHMARK_EXPANSION_NOTE.md (G-only: 13.0pp, Mean-G: 13.8pp). The values here are specific to the sensitivity harness comparison and should not be cited as the primary external-discrimination result.*

### 4e. Transform Perturbations (24 scenarios, min operator only)

| Metric | Default | Range | Monotonicity preserved? |
|--------|---------|-------|------------------------|
| Test A lift | 1.79x | 1.65–1.96x | All 24 yes |
| Test B spread | 81.4pp | 73.9–84.2pp | All 24 yes |
| Test C run-1 | 74.2% | 71.6–76.3% | — |
| Watch count (2025Q4) | 483 | 327–638 | — |
| Critical count (2025Q4) | 13 | 11–17 | — |

Under the min operator, all 24 local transform perturbations (center and scale shifts for each component) preserve Test B monotonicity. The validation surface is locally stable.

---

## 5. The Argument for Min

### 5a. Conceptual alignment with the instrument's purpose

The A/G framework is a structural divergence monitor. Its stated purpose is to identify banks where surface performance exceeds structural condition. This requires a structural floor (G) that reflects the binding constraint — the dimension most likely to trigger regulatory intervention, deposit flight, or loss absorption failure.

Min encodes this directly. A bank with Tier 1 leverage of 12% but noncurrent loans at 15% is structurally constrained by its loan book, not buoyed by its capital. Min produces G ≈ 0.03 for this bank. Geometric mean produces G ≈ 0.37. Harmonic mean produces G ≈ 0.14. Arithmetic mean produces G ≈ 0.53.

The question is not which G is "correct" in some absolute sense. The question is which G best serves the instrument's purpose of measuring structural viability as a binding constraint. If the purpose were balanced risk scoring, arithmetic or geometric mean might be preferable. For bottleneck viability, min is the natural operator.

### 5b. Warning-surface resolution

The tier system operates in the G range 0.0–0.5 (Critical and Watch). Under min, 10% of banks in 2025Q4 fall below G = 0.457, providing a substantial population for tier differentiation. Under geometric mean, only ~0.5% of banks fall below G = 0.5. The tier system loses its ability to differentiate banks.

This is not a statistical convenience. It is a direct consequence of allowing compensation. If compensation is permitted, fewer banks appear structurally impaired, and the warning layer becomes sparse to the point of uninformative.

### 5c. Validation stability

Only min (and its weighted variant) preserve Test B monotonicity — the property that MHI decile rank orders future tier-transition probability without inversions. Both geometric and harmonic break monotonicity at the default parameterization. Additionally, all 24 transform perturbations preserve monotonicity under min.

### 5d. Binding-component interpretability

Min uniquely identifies which component sets each bank's structural floor. This "binding G component" is reported per bank and enables diagnostic analysis: the external anchor case set documents a recurring binding-component shift (from asset-quality metrics to total risk-based capital) in the final quarters before bank failure. This diagnostic would not exist under geometric or harmonic mean, where G is a blended value with no identifiable floor.

---

## 6. The Honest Limitations

**Min is sensitive to single-component failures.** If one FDIC field is misreported or temporarily anomalous, min amplifies that error into G. Geometric or harmonic mean would be more robust to data noise. The RBCRWAJ zero-exclusion bug (documented in the freeze record) was exactly this kind of single-component sensitivity — unreported Total Risk-Based Capital drove thousands of false Critical classifications before the fix. The fix (excluding components where the raw input is zero and the transformed value is < 0.01) is a patch for this vulnerability, not a resolution of it.

**Min overstates structural impairment for banks with localized, moderate weakness.** A bank with noncurrent loans at 3% (G_ncl ≈ 0.40) but three strong components (G > 0.90) receives G = 0.40 under min and G ≈ 0.73 under geometric mean. Min classifies this bank as potentially Watch-eligible; geometric mean places it comfortably in Stable. Whether the moderate noncurrent-loan weakness warrants a structural flag is a judgment call, not an empirical fact. Min is the conservative choice.

**Mean-G slightly outperforms min-G on external failure targets.** The benchmark expansion found Mean-G achieves 13.8pp spread on GFC failure vs. min-G's 13.0pp — a reversal of the internal-target result. Mean incorporates information from all four components rather than discarding three, which helps when any component can drive failure. This is a real cost of the min operator: a small external-discrimination penalty in exchange for internal warning-surface resolution.

**The choice is purpose-dependent, not arbitrary.** Whether a wider or narrower warning surface is preferable depends on the use case. For a conservative surveillance tool that prioritizes detecting structural constraint, min is appropriate. For a balanced risk ranking that minimizes false alarms, geometric or arithmetic mean might be preferable. The instrument's stated purpose — structural divergence monitoring via a binding-constraint floor — selects for min. A different purpose would select a different operator. This is not indeterminacy; it is specificity.

---

## 7. Summary

The aggregation operator is the most consequential single design choice in the A/G framework. Four operators were tested:

| Property | Min | Weighted Min | Geometric | Harmonic |
|----------|-----|-------------|-----------|----------|
| Watch banks (2025Q4) | 483 | 483 | 11 | 47 |
| Test B monotonic | Yes | Yes | No | No |
| Test B spread | 81.0pp | 81.2pp | 11.7pp | 28.8pp |
| External G spread | 13.0pp | ~13.0pp | ~13–14pp | ~14.1pp |
| Binding component ID | Yes | Yes | No | No |

Min and weighted min preserve the warning surface, maintain monotonicity, and enable binding-component diagnostics. Geometric and harmonic mean collapse the warning surface by 90–98%, break monotonicity, and eliminate the binding-component concept.

External G-only discrimination is comparable across all operators (13–14pp). The operator choice does not determine whether G predicts failure. It determines the resolution and interpretability of the internal warning system built on top of G.

The min operator is chosen because the instrument measures structural viability as a bottleneck phenomenon. This is the stated design intent. The empirical evidence confirms that the bottleneck assumption produces a more informative, more stable, and more interpretable warning surface than any of its alternatives. The cost — modest external-discrimination penalty and sensitivity to single-component data errors — is documented and acknowledged.

---

*This note documents a design choice and its empirical consequences across four aggregation operators. It does not constitute financial advice.*
