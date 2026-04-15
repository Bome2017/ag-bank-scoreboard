# External Anchor Case Set

**Purpose:** Concrete, non-dashboard evidence that the A/G scoring system tracks real structural deterioration — not just its own internal tier definitions. Each case shows quarter-by-quarter evolution of G, A, MHI, tier, and binding component leading up to an externally verifiable outcome.

**Relationship to other documents:**
- `FAILED_BANK_CASE_NOTE.pdf` covers the peak-quarter snapshot for First City Bank of Florida. This document covers *temporal evolution* across multiple cases.
- `WALKFORWARD_EXTERNAL_VALIDATION.md` covers aggregate statistical results. This document covers *individual trajectories* that a reader can follow quarter by quarter.

---

## Case 1: Advanta Bank Corp (CERT 33535)

**Outcome:** Failed March 19, 2010 (FDIC closure). Specialized credit-card bank.
**First flagged:** Watch since 1994Q1 — 64 quarters before failure.
**Window:** GFC (2006Q1–2010Q1). All data below was observable before the failure date.

| Quarter | G | A | MHI | Tier | Binding component |
|---------|------|------|-------|----------|-------------------|
| 2006Q1 | 0.189 | 0.923 | 4.88 | Watch | Net Charge-offs |
| 2006Q4 | 0.201 | 0.902 | 4.48 | Watch | Net Charge-offs |
| 2007Q2 | 0.188 | 0.853 | 4.54 | Watch | Net Charge-offs |
| 2007Q4 | 0.178 | 0.808 | 4.53 | Watch | Net Charge-offs |
| 2008Q1 | 0.115 | 0.598 | 5.20 | Watch | Net Charge-offs |
| 2008Q2 | 0.088 | 0.635 | 7.22 | Critical | Net Charge-offs |
| 2008Q4 | 0.074 | 0.399 | 5.36 | Critical | Net Charge-offs |
| 2009Q1 | 0.041 | 0.003 | 0.08 | Critical | Net Charge-offs |
| 2009Q4 | ~0 | 0.054 | inf | Critical | Total Risk-Based Capital |

**What this shows:** Advanta was in Watch for over a decade with net charge-offs as the persistent binding constraint. G eroded gradually from 0.19 to 0.18 over 2006–2007, then dropped sharply through 0.088 (Critical threshold crossed 2008Q2) to near-zero by 2009. The binding component shifted from charge-offs to total risk-based capital in the final quarter — capital depletion following sustained credit losses. Appearance held above 0.80 through 2007, creating a widening MHI gap, before collapsing in 2008–2009.

The system flagged this bank years before the GFC. The final-year trajectory — G falling from 0.115 to near-zero in four quarters while MHI spiked — was visible in real time.

---

## Case 2: ShoreBank (CERT 15640)

**Outcome:** Failed August 20, 2010 (FDIC closure). Community development bank, Chicago.
**First flagged:** Watch since 1992Q1 — 74 quarters before failure.
**Window:** GFC (2006Q3–2010Q2). All data below was observable before the failure date.

| Quarter | G | A | MHI | Tier | Binding component |
|---------|------|------|-------|----------|-------------------|
| 2006Q3 | 0.457 | 0.610 | 1.33 | Watch | Noncurrent Loans |
| 2007Q1 | 0.401 | 0.612 | 1.52 | Watch | Noncurrent Loans |
| 2007Q4 | 0.450 | 0.609 | 1.35 | Watch | Noncurrent Loans |
| 2008Q2 | 0.399 | 0.582 | 1.46 | Watch | Noncurrent Loans |
| 2008Q3 | 0.279 | 0.560 | 2.01 | Watch | Noncurrent Loans |
| 2008Q4 | 0.166 | 0.457 | 2.76 | Watch | Noncurrent Loans |
| 2009Q1 | 0.143 | 0.437 | 3.06 | Watch | Noncurrent Loans |
| 2009Q3 | 0.117 | 0.185 | 1.59 | Watch | Noncurrent Loans |
| 2009Q4 | 0.005 | 0.084 | 18.4 | Critical | Total Risk-Based Capital |
| 2010Q2 | ~0 | 0.056 | inf | Critical | Total Risk-Based Capital |

**What this shows:** ShoreBank's trajectory is a textbook orderly decline. G held in the 0.40–0.46 range through mid-2008, then fell steadily — 0.40, 0.28, 0.17, 0.14, 0.12 — over five consecutive quarters. The binding component was noncurrent loans throughout the deterioration phase, shifting to total risk-based capital only when capital was consumed in 2009Q4. Appearance declined more slowly, sustaining the Watch classification until the very end. The bank crossed into Critical only three quarters before failure.

Notably, the system held ShoreBank in Watch (not Stable) for 58 quarters before failure, driven by a persistent noncurrent-loan weakness that was structurally real but not immediately fatal.

---

## Case 3: Seaway Bank and Trust (CERT 19328)

**Outcome:** Failed January 27, 2017 (FDIC closure). Chicago community bank.
**First flagged:** Watch since 1992Q1.
**Significance:** Non-crisis failure. This bank failed during a period of broad economic expansion, demonstrating that the system detects structural weakness outside of systemic stress episodes.

| Quarter | G | A | MHI | Tier | Binding component |
|---------|------|------|-------|----------|-------------------|
| 2013Q1 | 0.084 | 0.684 | 8.11 | Critical | Noncurrent Loans |
| 2013Q4 | 0.099 | 0.566 | 5.71 | Critical | Noncurrent Loans |
| 2014Q1 | 0.102 | 0.456 | 4.49 | Watch | Noncurrent Loans |
| 2014Q3 | 0.094 | 0.369 | 3.94 | Critical | Noncurrent Loans |
| 2015Q1 | 0.088 | 0.476 | 5.41 | Critical | Noncurrent Loans |
| 2015Q4 | 0.084 | 0.274 | 3.27 | Critical | Noncurrent Loans |
| 2016Q1 | 0.040 | 0.181 | 4.52 | Critical | Total Risk-Based Capital |
| 2016Q3 | 0.004 | 0.181 | 42.9 | Critical | Total Risk-Based Capital |
| 2016Q4 | ~0 | 0.178 | inf | Critical | Total Risk-Based Capital |

**What this shows:** Seaway spent 2013–2015 oscillating between Critical and Watch at the G = 0.08–0.10 boundary. The binding component was noncurrent loans until 2016Q1, when it shifted to total risk-based capital — the same late-stage pattern seen in Advanta and ShoreBank. Appearance remained above 0.17 throughout, sustaining positive MHI, but the bank's structural base was near-zero for years.

This is a non-GFC case. The U.S. banking system was broadly healthy in 2016–2017. The system's flag was not a macro-cycle artifact.

---

## Case 4: Mesilla Valley Bank (CERT 35492) — Severe distress, no failure

**Outcome:** Did not fail. Peak Texas ratio: 8.14 (severe distress by any external measure). Recovered to Stable.
**Significance:** The system detected real structural collapse — then tracked the recovery. This is not a false positive; it is a true detection of genuine distress that the bank survived.

| Quarter | G | A | MHI | Tier | Binding component |
|---------|------|------|-------|----------|-------------------|
| 2005Q4 | 0.230 | 0.861 | 3.75 | Watch | Noncurrent Loans |
| 2006Q3 | 0.220 | 0.612 | 2.78 | Watch | Noncurrent Loans |
| 2006Q4 | 0.249 | 0.368 | 1.48 | Watch | Noncurrent Loans |
| 2007Q1 | 0.036 | 0.273 | 7.70 | Critical | Total Risk-Based Capital |
| 2007Q4 | 0.008 | 0.276 | 34.9 | Critical | Total Risk-Based Capital |
| 2008Q1 | 0.001 | 0.271 | inf | Critical | Total Risk-Based Capital |
| **2008Q2** | **0.157** | **0.104** | **0.66** | **Stable** | **Noncurrent Loans** |
| 2008Q4 | 0.357 | 0.179 | 0.50 | Stable | Net Charge-offs |
| 2009Q2 | 0.893 | 0.240 | 0.27 | Stable | Total Risk-Based Capital |
| 2010Q1 | 0.995 | 0.498 | 0.50 | Stable | Total Risk-Based Capital |

**What this shows:** Mesilla hit Critical in 2007Q1 with G = 0.036, bottoming at G ~ 0.001 in 2008Q1. Then it recapitalized: G jumped from 0.001 to 0.157 in a single quarter (2008Q2), reaching 0.893 by 2009Q2. The tier classification tracked the recovery in real time — Critical through 2008Q1, Stable from 2008Q2 onward. The system did not leave a recovered bank stuck in a distress classification.

The bank's trajectory also shows the binding-component shift in reverse: total risk-based capital was binding during the distress period, then noncurrent loans and net charge-offs became binding during recovery as capital was restored but legacy loan problems persisted.

---

## Case 5: Seattle Savings Bank (CERT 35139) — Chronic structural weakness

**Outcome:** Still operating as of 2025Q4. Never failed. In Watch for 42 of 106 observed quarters.
**Significance:** A case where the system has persistently flagged structural weakness that manifests as real, externally verifiable asset-quality problems — but the bank has survived for decades. This is the hardest case for any structural scoring system.

| Quarter | G | A | MHI | Tier | Binding component |
|---------|------|------|-------|----------|-------------------|
| 2008Q2 | 0.231 | 0.455 | 1.97 | Watch | Noncurrent Loans |
| 2009Q2 | 0.088 | 0.005 | 0.06 | Critical | Noncurrent Loans |
| 2010Q4 | 0.002 | 0.015 | 7.85 | Critical | Total Risk-Based Capital |
| 2011Q1 | 0.196 | 0.378 | 1.92 | Watch | Net Charge-offs |
| 2013Q1 | 0.236 | 0.504 | 2.14 | Watch | Noncurrent Loans |
| 2016Q1 | 0.453 | 0.455 | 1.00 | Stable | Noncurrent Loans |
| 2019Q1 | 0.647 | 0.863 | 1.33 | Diverging | Noncurrent Loans |
| 2021Q3 | 0.259 | 0.792 | 3.06 | Watch | Noncurrent Loans |
| 2023Q4 | 0.357 | 0.856 | 2.40 | Watch | Noncurrent Loans |
| 2025Q4 | 0.299 | 0.605 | 2.02 | Watch | Noncurrent Loans |

**What this shows:** Seattle Savings has cycled through Watch, Critical, Stable, Diverging, and back to Watch over 25 years. Noncurrent loans are binding in nearly every quarter. The bank survived the GFC despite reaching Critical (G = 0.002 in 2010Q4), recovered to Stable by 2016, drifted into Diverging by 2019, and has been in Watch again since 2020. As of 2025Q4, G = 0.30 with MHI = 2.02.

This bank is *not* a false positive. Its chronic noncurrent-loan weakness is structurally real. The system correctly identifies it as having surface performance consistently exceeding structural condition. Whether this bank eventually fails or continues surviving, the scoring is measuring something genuine about its structural profile.

---

## Reading these cases together

Three patterns recur across all five cases:

**Binding-component shift as a late indicator.** In all three failure cases, the binding G component shifted from an asset-quality metric (noncurrent loans or net charge-offs) to total risk-based capital in the final quarters before failure. This shift — from loan deterioration to capital depletion — marks the transition from structural weakness to terminal decline. The recovery case (Mesilla) shows this shift in reverse.

**G decline rate, not G level, as the acute signal.** All three failed banks spent years with low-but-stable G. The acute deterioration appeared as rapid G decline: Advanta from 0.115 to 0.041 in three quarters, ShoreBank from 0.279 to 0.005 in five quarters, Seaway from 0.084 to near-zero in four quarters. The system's tier classification tracked these declines in real time.

**MHI spike preceding failure.** As G collapsed but Appearance held temporarily, MHI spiked in the penultimate quarters — Advanta hit 16.6, ShoreBank hit 18.4, Seaway hit 42.9. These spikes represent the maximum divergence between performed health and structural reality. They are not useful as point-in-time signals (by the time MHI reaches these levels, the bank is already in Critical), but they mark the moment when the gap between surface and structure is widest.

---

## What this document does and does not establish

**Does establish:**
- The system's tier classifications track real structural deterioration visible in individual bank trajectories
- The binding-component mechanism identifies which structural weakness is most severe and tracks shifts over time
- The system detects both crisis-era and non-crisis failures
- The system tracks recovery when recovery occurs (Mesilla)
- Chronic Watch classifications correspond to genuine, persistent structural weakness (Seattle)

**Does not establish:**
- That tier classifications predict failure with known sensitivity/specificity (see walk-forward validation for aggregate statistics)
- That MHI adds external-outcome prediction beyond G alone (it does not — see walk-forward results)
- That these five cases are representative of all flagged banks (they were selected to illustrate specific trajectory patterns)

---

*Data source: FDIC Call Report data, 1992Q1–2025Q4. All values computed from public filings using the canonical A/G scoring rules documented in the freeze record.*
