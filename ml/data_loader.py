"""
KaushalPulse ML Module: Data Loader
Loads and validates canonical records from SQLite database / CSV.
"""

import os
import sqlite3
import pandas as pd
from typing import Optional

def load_canonical_data(
    db_path: str = "data/kaushal_pulse.db", 
    csv_backup: str = "data/canonical_dataset.csv",
    table_name: str = "canonical_labour_records"
) -> pd.DataFrame:
    """Load canonical labour market data from SQLite database with fallback to CSV."""
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        # Check if table exists
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
        if not cursor.fetchone():
            table_name = "canonical_labour_records"
        df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
        conn.close()
    elif os.path.exists("data/sih_canonical_dataset.csv"):
        df = pd.read_csv("data/sih_canonical_dataset.csv")
    elif os.path.exists(csv_backup):
        df = pd.read_csv(csv_backup)
    else:
        raise FileNotFoundError(f"Neither {db_path} nor {csv_backup} could be found.")

    # Validate required columns
    required_cols = [
        "date", "state", "district", "sector", "occupation", "nco_code",
        "job_demand", "employer_count", "training_seats", "enrolled",
        "certified", "available_supply", "placement_rate"
    ]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Canonical dataset missing required columns: {missing}")

    # Ensure chronological ordering per series (crucial for time series lags)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["district", "nco_code", "date"]).reset_index(drop=True)
    return df
