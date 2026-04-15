# A/G Bank Structural Divergence Scoreboard

A two-channel structural monitoring system for U.S. banks. Ground (G) measures structural viability — low G predicts external failure. The Mirror-Horizon Index (MHI = Appearance / Ground) measures divergence between surface performance and structural condition — high MHI flags banks whose observable health exceeds their structural floor.

**Not a prediction of failure.** G provides a structural viability ranking. MHI identifies where the gap between performed health and structural reality is widest. The system qualifies traditional risk rather than replacing it.

## How It Works

Each bank is scored using two independently constructed channels with **zero variable overlap**:

**Ground (G)** — Structural viability (min of components):
- Tier 1 Leverage Ratio (logistic transform, centered at 5%)
- Total Risk-Based Capital Ratio (logistic, centered at 10%)
- Noncurrent Loans / Total Loans (inverse transform)
- Net Charge-offs / Total Loans (inverse transform)

**Appearance (A)** — Surface performance (mean of components):
- Return on Assets (logistic, centered at 0%)
- Efficiency Ratio (inverted logistic, centered at 70%)
- Net Interest Margin (logistic, centered at 3%)

**Mirror-Horizon Index: MHI = A / G**

MHI > 1.0 means appearance exceeds ground. The higher the MHI, the larger the gap.

## Quick Start

### 1. Install dependencies
```bash
pip install numpy pandas
```

### 2. Get FDIC data
1. Go to https://banks.data.fdic.gov
2. Select **Financial** as Data Type
3. Select a quarter and year (e.g., Q4 2024)
4. Select **CSV** format
5. Click **Download Selected Data**
6. Place the downloaded CSV in the `data/` folder

Repeat for additional quarters to build historical tracking.

### 3. Run
```bash
# Score all quarters in data/
python run.py

# Score only the latest quarter
python run.py --latest-only

# Score a specific file
python run.py --file data/Financial_2024Q4.csv
```

### 4. View results
Open `output/dashboard_YYYYQN.html` in any browser.

## Output Files

| File | Description |
|------|-------------|
| `output/ranked_YYYYQN.csv` | All banks with G, A, MHI, tier, and binding component (sorted by MHI descending) |
| `output/dashboard_YYYYQN.html` | Visual dashboard (open in browser) |
| `output/historical_ledger.csv` | Running record across quarters |

## Updating

Each quarter when new FDIC data is available:
1. Download the new CSV from banks.data.fdic.gov
2. Drop it in `data/`
3. Run `python run.py --latest-only`

The historical ledger automatically accumulates, letting you track how individual banks' scores change over time.

## What This Measures

The A/G framework separates two independently constructed signals with zero variable overlap:

- **G (Ground)** measures structural viability. Low G predicts external failure (13pp decile spread on GFC-era bank closures, the only metric with full monotonicity on that target). G is the externally validated channel.
- **MHI (A/G ratio)** measures performed continuation — the degree to which surface performance exceeds structural capacity. High MHI identifies the widest gaps between observable health and structural reality. MHI is the internally validated channel: strongest monotonic discriminator on the system's own tier transitions.

A bank with MHI ≈ 1.0 has surface performance matched by structural health. A bank with MHI > 1.5 is performing significantly more health than it possesses. The system qualifies traditional structural risk rather than replacing it.

**Validation** has three layers with distinct claim types:

- *Internal coherence:* MHI decile gradients are monotonic, same-G-band lift is 1.79x, persistence escalation is strong. These use the system's own tier transitions as the outcome.
- *External anchoring:* 573 FDIC-listed bank failures matched against the historical ledger show median Watch lead of 12 quarters. Walk-forward testing against actual FDIC closure and Texas-ratio distress is documented in the validation memo.
- *Still provisional:* No benchmarking against CAMELS or proprietary models. Expanded benchmarks (G-only, Mean-G, NCL-only, ROA-only, Texas proxy, G+A blend) confirm G alone is the dominant external predictor; MHI adds internal-tier discrimination but not incremental external failure prediction beyond G.

**Cross-domain replication** (breast cancer AUC 0.903, diabetes AUC 0.764, corporate bankruptcy AUC 0.722 at 5-year horizon) uses the same functional form but is documented in the parent paper, not in this scoreboard's validation stack.

## Framework

- **Paper:** Mehat, S. (2026). *The Appearance–Ground Ratio as a Universal Decay Metric.*
- **DOI:** [10.5281/zenodo.18489503](https://doi.org/10.5281/zenodo.18489503)
- **License:** CC-BY 4.0

## Disclaimer

This scoreboard is a research instrument. It does not constitute financial advice, investment recommendations, or predictions of bank failure. Use at your own risk.
