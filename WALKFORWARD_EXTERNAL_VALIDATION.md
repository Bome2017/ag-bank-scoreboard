# A/G Scoreboard — Walk-Forward External Validation Memo

**Date:** April 14, 2026
**Status:** Supporting note — external-outcome walk-forward results.
**Script:** `walkforward_external.py`
**Outputs:** `output/walkforward_summary.csv`, `output/walkforward_decile_detail.csv`

---

## 1. Purpose

The A/G Scoreboard's existing validation tests (Tests A, B, C) define "future deterioration" as entering Watch or Critical — the system's own tier categories. This creates a circularity risk: the tests may simply confirm that MHI-based classification is self-consistent rather than demonstrating genuine predictive content.

This memo reports the results of a walk-forward validation using two external targets that are fully independent of the A/G tier logic. It evaluates MHI, G-only (1/G), and Texas-ratio proxy side by side. The results are mixed and require careful interpretation.

---

## 2. External Targets

**Target 1 — Actual FDIC failure within 8 quarters.** Each bank-quarter is labeled 1 if the bank appears on the FDIC failed-bank list within the next 8 quarters, 0 otherwise. Source: `data/failed_bank_list.csv` (public FDIC data). This is the hardest external anchor — actual closure events.

**Target 2 — Texas ratio exceeding 1.0 within 4 quarters.** The Texas ratio (noncurrent loans + OREO) / tangible equity is computed from raw FDIC fields (NCLNLS, P9OREO, EQ, INTGW) independently of the A/G scoring pipeline. A bank-quarter is labeled 1 if the Texas ratio crosses 1.0 in any of the next 4 quarters. This is a recognized distress marker in bank analysis.

Both targets have zero variable overlap with MHI or A/G tier classification.

---

## 3. Walk-Forward Design

Three genuinely forward-looking evaluation windows, plus one full-panel reference:

| Window | Evaluation Period | Calibration Visible Through | Quarters |
|--------|------------------|---------------------------|----------|
| A_GFC | 2006Q1–2012Q4 | 2005Q4 | 28 |
| B_PostCrisis | 2013Q1–2019Q4 | 2012Q4 | 28 |
| C_Recent | 2020Q1–2025Q4 | 2019Q4 | 24 |
| Full | 1992Q1–2025Q4 | — (reference only) | 136 |

The A/G scoring thresholds are structurally fixed (not fitted to data), so "calibration" here means data the system designer could plausibly have inspected. Windows A, B, and C evaluate on data that is temporally forward of any plausible design period. The Full window is pooled across the entire panel and is included as a reference, not as a walk-forward claim.

Decile assignment is within each quarter (not pooled), then rates are aggregated across quarters in each window. This prevents cross-quarter leakage.

---

## 4. Results: Decile Spread

Spread is defined as D10 rate minus D1 rate (percentage points). Higher spread means better discrimination between the top and bottom deciles.

| Window | Target | Base Rate | MHI | G-only | Texas |
|--------|--------|-----------|-----|--------|-------|
| A_GFC | Failure 8Q | 1.73% | 5.7pp | **13.0pp** | 10.3pp |
| A_GFC | Texas dist. 4Q | 1.76% | 6.6pp | 14.7pp | **16.1pp** |
| B_PostCrisis | Failure 8Q | 0.20% | 1.3pp | **1.8pp** | 1.4pp |
| B_PostCrisis | Texas dist. 4Q | 0.61% | 3.9pp | 5.1pp | **6.1pp** |
| C_Recent | Failure 8Q | 0.07% | 0.1pp | 0.3pp | 0.2pp |
| C_Recent | Texas dist. 4Q | 0.03% | 0.1pp | 0.2pp | 0.2pp |
| Full | Failure 8Q | 0.40% | 1.4pp | **3.0pp** | 2.3pp |
| Full | Texas dist. 4Q | 0.63% | 3.0pp | 5.3pp | **5.9pp** |

**Reading:** Bold marks the widest spread in each row.

**Key observation:** G-only and Texas proxy consistently outperform MHI on external targets. MHI has the narrowest spread in every window-target combination. G-only leads on the failure target; the Texas proxy (which directly measures the distress numerator) leads on the Texas-distress target, as expected.

---

## 5. Results: Monotonicity

A gradient is monotonic if every decile's rate is weakly greater than the previous decile's.

| Window | Target | MHI | G-only | Texas |
|--------|--------|-----|--------|-------|
| A_GFC | Failure 8Q | No (3 inv.) | **Yes** | No |
| A_GFC | Texas dist. 4Q | No (3 inv.) | No | No |
| B_PostCrisis | Failure 8Q | No (2 inv.) | No | No |
| B_PostCrisis | Texas dist. 4Q | No (2 inv.) | No | No |
| C_Recent | Failure 8Q | No (5 inv.) | No | No |
| C_Recent | Texas dist. 4Q | No (4 inv.) | No | No |
| Full | Failure 8Q | No (2 inv.) | No | No |
| Full | Texas dist. 4Q | No (3 inv.) | No | No |

Only one case achieves full monotonicity: G-only on failure in the GFC window. No metric achieves monotonicity on the Texas-distress target. MHI is never monotonic on external targets.

For context: MHI is perfectly monotonic across all 10 deciles on the internal deterioration target (Test B in the existing validation). The contrast between internal-target monotonicity and external-target non-monotonicity is the central finding of this validation.

---

## 6. Results: Same-Band Lift

The A/G system's signature claim is same-G-band discrimination: within the G band 0.1–0.5, banks with MHI > 1.2 (Watch) should deteriorate faster than banks with MHI <= 1.2 (non-Watch). On internal targets, this produces a 1.79x lift. On external targets:

| Window | Target | Watch Rate | Non-Watch Rate | Lift |
|--------|--------|-----------|---------------|------|
| A_GFC | Failure 8Q | 1.70% | 5.03% | 0.34x |
| A_GFC | Texas dist. 4Q | 2.03% | 6.08% | 0.33x |
| B_PostCrisis | Failure 8Q | 0.21% | 0.32% | 0.65x |
| B_PostCrisis | Texas dist. 4Q | 1.06% | 1.59% | 0.66x |
| C_Recent | Failure 8Q | 0.17% | 0.19% | 0.88x |
| C_Recent | Texas dist. 4Q | 0.12% | 0.43% | 0.27x |
| Full | Failure 8Q | 0.55% | 2.39% | 0.23x |
| Full | Texas dist. 4Q | 1.13% | 3.49% | 0.32x |

**All lifts are below 1.0.** Within the same G band, Watch banks (MHI > 1.2) are *less* likely to fail or enter Texas-ratio distress than non-Watch banks (MHI <= 1.2). This inverts the internal-target result.

**Why this happens:** Within the G band 0.1–0.5, Watch banks have high Appearance (mean A = 0.71) while non-Watch banks have low Appearance (mean A = 0.35). Banks with low A *and* low G are doubly impaired — weak structure and weak surface performance. Banks with high A and low G have real economic activity (profitability, margin, efficiency) that provides a buffer against failure even though their structural floor is compromised. The internal tests count "entering Watch" as deterioration, which high-MHI banks do by definition. External failure is a different phenomenon.

---

## 7. MHI Decile Shape on External Targets

Rather than rising smoothly from D1 to D10, MHI shows a U-shaped pattern on external failure during the GFC window:

| Decile | Failure Rate | Note |
|--------|-------------|------|
| D1 (lowest MHI) | 1.49% | Elevated |
| D2 | 0.81% | |
| D3 | 0.54% | Trough |
| D4 | 0.52% | Trough |
| D5–D9 | 0.68%–1.70% | Rising |
| D10 (highest MHI) | 7.17% | Extreme tail |

D1 (lowest MHI) captures banks with both low A and low G — doubly weak institutions that fail at elevated rates. D10 (highest MHI) captures the extreme divergence tail, which also fails at elevated rates. The mid-deciles are the safest. This U-shape explains both the non-monotonicity and why D10-D1 spread understates MHI's tail discrimination.

G-only, by contrast, rises cleanly from D1 (0.10%) to D10 (13.08%) — a near-perfect monotonic gradient driven entirely by the structural channel.

---

## 8. Window C Limitations

The C_Recent window (2020Q1–2025Q4) has extremely low base rates: 84 failures (0.07%) and 32 Texas-distress events (0.03%) among 114,781 bank-quarters. With ~11,500 observations per decile, even one failure event shifts a decile's rate by ~0.01pp. No metric — MHI, G-only, or Texas — achieves meaningful discrimination in this window. Results should be treated as uninformative rather than as evidence of signal degradation.

---

## 9. What This Means for the A/G Framework

### What holds up

**G is a genuine structural signal.** The Ground channel discriminates external failure with 13pp spread and full monotonicity during the GFC stress test. G-only consistently outperforms MHI on external targets. This validates the structural viability channel as a meaningful risk measure independent of the A/G tier system.

**Extreme-tail MHI is informative.** D10 failure rates are sharply elevated in every window where the base rate permits discrimination. The extreme divergence tail — banks with MHI far above 1.0 — does contain signal about external outcomes. The four failed-bank case-note examples (all extreme MHI) are consistent with this.

### What does not hold up

**MHI does not add incremental external discrimination beyond G.** G-only has wider spread, better monotonicity, and stronger same-band separation on external targets. The MHI ratio (A/G) dilutes G's signal by mixing in Appearance, which is partially protective against external failure.

**Same-band discrimination inverts on external targets.** The system's core claim — that high MHI within the same G band signals elevated risk — reverses when measured against actual failure. High-A banks within a weak-G band are *less* likely to fail externally, not more. The 1.79x internal lift reflects definitional circularity: high-MHI banks "deteriorate" into Watch/Critical because MHI defines those tiers.

**MHI is never monotonic on external targets.** The U-shaped decile pattern means MHI is not a clean ordinal risk ranking for external outcomes. Banks at both extremes of MHI fail at elevated rates, for different reasons.

### The constructive interpretation

The A/G framework measures something real — structural divergence — and G in particular is a strong structural risk signal. But the MHI ratio is better understood as a measure of *performed continuation* (surface exceeding structure) than as a measure of *external failure risk*. The internal validation tests measure exactly what MHI is designed to detect: escalation through the system's own tier structure. That is a legitimate use case (monitoring structural drift), but it should not be confused with external outcome prediction.

The honest framing for the system is:

- G measures structural viability. Low G predicts external failure.
- MHI measures divergence between surface and structure. High MHI predicts escalation through the A/G tier system.
- These are related but distinct claims. The first is externally anchored. The second is internally consistent but not externally validated by this test.

---

## 10. Recommendations

1. **Reframe the validation narrative.** The existing Tests A/B/C are valid as internal consistency checks. They should be explicitly labeled as such. External validation should reference G's discrimination power, not MHI's.

2. **Consider reporting G-rank alongside MHI-rank.** G alone is a stronger external predictor. The dashboard's ranked tables could include a G-only ranking column.

3. **Preserve the MHI concept for its actual strength.** MHI detects performed continuation — real divergence between surface and structure. This is analytically valuable even if it doesn't predict failure. The framing should shift from "predictive" to "diagnostic."

4. **Add this memo to the public documentation.** The walk-forward results, including the same-band inversion, should be accessible. Selective reporting of only the favorable internal tests undermines credibility more than honest mixed results do.

5. **Investigate the D1 tail.** Banks in MHI D1 (low A, low G) fail at elevated rates and represent a distinct risk category from D10 (high A, low G). The current tier system does not flag these banks specifically.

---

*This memo documents an external-outcome walk-forward validation of the A/G Bank Scoreboard. It reports mixed results honestly. It does not constitute financial advice.*
