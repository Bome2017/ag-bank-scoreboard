# A/G Scoreboard

Public-data dashboard for A/G bank structural monitoring, validation, and quarterly updates.

## Overview

A/G Scoreboard is a public-facing dashboard built from FDIC quarterly banking data. It tracks:

* **Ground (G):** Structural condition
* **Appearance (A):** Surface performance
* **MHI (Mirror-Horizon Index):** Appearance-to-ground mismatch
* **Tiering and Temporal Features:** Critical, Watch, Diverging, Stable, plus persistence and trajectory context

The public dashboard is designed to show current-quarter conditions, historical trend context, and validation summaries in a readable format.

## What the Public Dashboard Shows

* Current-quarter summary
* Historical trend charts
* Top current-quarter Critical and Watch institutions
* Current Watch-cohort breakdowns
* Validation summaries
* Failed-bank anchoring summaries
* Baseline comparison summaries

## Scope

This is a **structural warning system**, not a deterministic failure oracle. 

It is intended to measure divergence between observed performance and structural condition using public data. It does **not** claim to prove insolvency, predict specific bank failures with certainty, or replicate supervisory models using nonpublic inputs.

## Files Powering the Dashboard

The public site reads from these exported files:

* `output/macro_mhi_summary.csv`
* `output/compare_2019_2022_2025.csv`
* `output/latest_quarter_temporal.csv`
* `output/baseline_compare_mhi.csv`
* `output/baseline_compare_g.csv`
* `output/baseline_compare_texas_proxy.csv`
* `output/failed_bank_leadtime_summary.csv`

## Local Preview

To run locally, execute the following command in your terminal:

```bash
python -m http.server 8000

Then open your browser to: http://localhost:8000/

Commercial Use
The public dashboard is provided for informational, research, and non-commercial use.

Commercial use, bulk extraction, automated scraping, redistribution, or integration into institutional risk, trading, lending, or advisory workflows requires a commercial license or prior written permission.

See the Commercial Use & Licensing page on the site for details.

Contact
For commercial licensing, institutional access, or data inquiries:
bomeh2017@gmail.com

Ownership
© 2026 Sanjit Singh Mehat. All rights reserved.
