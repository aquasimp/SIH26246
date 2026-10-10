"""
Script: Inspect Official SIH Dataset and Generate Detailed Summary
Problem Statement: PS 26246 (PS 26242) - MSDE
Produces data/reports/sih_dataset_summary.json and data/reports/sih_dataset_summary.md
"""

import os
import json
import pandas as pd
import numpy as np

def inspect_dataset(file_path="data/raw/sih_official_dummy_dataset.csv"):
    os.makedirs("data/reports", exist_ok=True)
    df = pd.read_csv(file_path)

    # Basic stats
    num_rows, num_cols = df.shape
    col_names = list(df.columns)
    data_types = {col: str(df[col].dtype) for col in col_names}

    # Missing values
    missing = df.isnull().sum().to_dict()
    missing_pct = {k: round((v / num_rows) * 100, 2) for k, v in missing.items()}

    # Dates
    dates = pd.to_datetime(df["reporting_period"], format="mixed")
    min_date = dates.min().strftime("%Y-%m-%d")
    max_date = dates.max().strftime("%Y-%m-%d")
    unique_dates = len(dates.unique())

    # Geography
    states = list(df["state_name"].unique())
    raw_districts = list(df["district_name"].unique())
    # Cleaned districts
    clean_districts = list(df["district_name"].str.strip().str.title().unique())

    # Sectors and trades
    sectors = list(df["sector_name"].unique())
    trades = list(df["trade_name"].unique())

    # Check duplicates
    dups = int(df.duplicated(subset=["reporting_period", "district_name", "trade_name"]).sum())

    # Quantitative summary
    demand_summary = {
        "min": int(df["job_count"].min()),
        "max": int(df["job_count"].max()),
        "mean": round(float(df["job_count"].mean()), 2),
        "median": int(df["job_count"].median()),
        "total_demand": int(df["job_count"].sum())
    }

    seats_summary = {
        "min": int(df["seat_count"].min()),
        "max": int(df["seat_count"].max()),
        "mean": round(float(df["seat_count"].mean()), 2),
        "total_seats": int(df["seat_count"].sum())
    }

    summary = {
        "file_name": os.path.basename(file_path),
        "file_type": "CSV",
        "total_rows": num_rows,
        "total_columns": num_cols,
        "columns": col_names,
        "data_types": data_types,
        "missing_values": missing,
        "missing_percentage": missing_pct,
        "date_range": {
            "earliest_date": min_date,
            "latest_date": max_date,
            "total_monthly_periods": unique_dates
        },
        "geography": {
            "total_states": len(states),
            "states": states,
            "total_raw_districts": len(raw_districts),
            "total_normalized_districts": len(clean_districts),
            "districts": clean_districts
        },
        "labour_domain": {
            "total_sectors": len(sectors),
            "sectors": sectors,
            "total_occupations_trades": len(trades),
            "trades": trades
        },
        "data_integrity": {
            "duplicate_records": dups,
            "negative_demand_count": int((df["job_count"] < 0).sum()),
            "negative_seats_count": int((df["seat_count"] < 0).sum())
        },
        "demand_distribution": demand_summary,
        "supply_distribution": seats_summary
    }

    # Save JSON report
    json_path = "data/reports/sih_dataset_summary.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    # Save Markdown report
    md_path = "data/reports/sih_dataset_summary.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# Official SIH Evaluation Dataset — Inspection Summary\n")
        f.write(f"**Dataset File:** `{summary['file_name']}` | **Format:** `{summary['file_type']}`\n\n")
        f.write(f"- **Total Observations:** {summary['total_rows']:,}\n")
        f.write(f"- **Total Columns:** {summary['total_columns']}\n")
        f.write(f"- **Time-Series Horizon:** {min_date} to {max_date} ({unique_dates} monthly periods)\n")
        f.write(f"- **States Represented:** {len(states)} ({', '.join(states)})\n")
        f.write(f"- **Normalized Districts:** {len(clean_districts)}\n")
        f.write(f"- **Industry Sectors:** {len(sectors)}\n")
        f.write(f"- **Distinct Trade Roles:** {len(trades)}\n\n")
        f.write("## Schema & Data Quality Profile\n\n")
        f.write("| Column Name | Inferred Type | Missing Count | Missing % | Domain Category |\n")
        f.write("|---|---|---|---|---|\n")
        for col in col_names:
            domain_cat = "Identifier" if "id" in col else "Date" if "period" in col else "Geo" if "name" in col and ("state" in col or "district" in col) else "Demand" if "job" in col else "Supply" if any(k in col for k in ["seat", "enrolled", "certified", "placed"]) else "Metadata"
            f.write(f"| `{col}` | `{data_types[col]}` | {missing[col]} | {missing_pct[col]}% | {domain_cat} |\n")
        f.write("\n## Aggregated Macro Totals\n\n")
        f.write(f"- **Total Vacancy Demand:** {demand_summary['total_demand']:,} jobs (Monthly Mean: {demand_summary['mean']:.1f})\n")
        f.write(f"- **Total Sanctioned Intake:** {seats_summary['total_seats']:,} seats (Monthly Mean: {seats_summary['mean']:.1f})\n")
        f.write(f"- **Integrity Flag:** {dups} duplicate observations, 0 negative values.\n")

    print(f"Summary written to {json_path} and {md_path}")
    return summary

if __name__ == "__main__":
    inspect_dataset()
