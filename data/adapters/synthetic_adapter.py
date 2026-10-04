"""
KaushalPulse Data Adapter: Synthetic Dataset Adapter
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246
"""

import pandas as pd
import sqlite3
import os
from typing import Dict, Any

class SyntheticDataAdapter:
    def __init__(self, db_path: str = "data/kaushal_pulse.db"):
        self.db_path = db_path

    def load_data(self) -> pd.DataFrame:
        if not os.path.exists(self.db_path):
            from synthetic_generator import generate_canonical_dataset
            generate_canonical_dataset()
        
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql("SELECT * FROM canonical_labour_records", conn)
        conn.close()
        return df

    def get_summary(self) -> Dict[str, Any]:
        df = self.load_data()
        return {
            "source": "Synthetic Benchmark Generator",
            "data_mode": "synthetic",
            "total_records": len(df),
            "states_count": df["state"].nunique(),
            "districts_count": df["district"].nunique(),
            "occupations_count": df["nco_code"].nunique(),
            "date_range": [df["date"].min(), df["date"].max()]
        }
