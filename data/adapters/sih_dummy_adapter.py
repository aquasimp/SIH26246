"""
KaushalPulse Data Adapter: Official SIH Dummy Dataset Adapter & Schema Mapper
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Pluggable ingestion adapter for external SIH hackathon evaluation datasets.
Provides automated schema detection, column mapping review, normalization,
and model retraining hooks without requiring frontend redesign.
"""

import os
import re
import pandas as pd
import sqlite3
import datetime
from typing import Dict, List, Any, Optional, Tuple

CANONICAL_SYNONYMS = {
    "job_demand": ["job_demand", "job_count", "vacancies", "openings", "demand", "positions", "hiring_count"],
    "district": ["district", "district_name", "dist", "location", "city", "district_id"],
    "state": ["state", "state_name", "region", "province"],
    "occupation": ["occupation", "trade", "job_role", "role", "title", "designation"],
    "nco_code": ["nco_code", "nco", "nco2015", "code", "nco_id"],
    "date": ["date", "month", "period", "timestamp", "year_month", "time"],
    "training_seats": ["training_seats", "seats", "capacity", "intake", "sanctioned_seats"],
    "enrolled": ["enrolled", "admitted", "students", "trainees"],
    "certified": ["certified", "passed", "passouts", "graduates", "assessments_passed"],
    "available_supply": ["available_supply", "available_labour", "available_workers", "job_seekers"],
    "placement_rate": ["placement_rate", "placement_pct", "placed_ratio", "employment_rate"],
    "wage_signal": ["wage_signal", "wage", "salary", "median_wage", "avg_salary", "pay"],
    "employer_count": ["employer_count", "employers", "enterprises", "companies", "hirers"]
}

class SIHDummyDataAdapter:
    def __init__(self, db_path: str = "data/kaushal_pulse.db"):
        self.db_path = db_path

    def inspect_file(self, file_path: str) -> pd.DataFrame:
        """Inspects uploaded file format (CSV, XLSX, JSON) and reads DataFrame."""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".csv":
            df = pd.read_csv(file_path)
        elif ext in [".xlsx", ".xls"]:
            df = pd.read_excel(file_path)
        elif ext == ".json":
            df = pd.read_json(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}. Expected CSV, XLSX, or JSON.")
        return df

    def review_schema_mapping(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyzes source columns and proposes canonical mapping without silently guessing critical fields.
        """
        source_cols = list(df.columns)
        mapped = {}
        unmapped = []
        confidences = {}

        for src in source_cols:
            clean_src = re.sub(r"[^a-zA-Z0-9_]", "", src.lower().strip())
            best_match = None
            best_conf = 0.0

            for canonical_col, synonyms in CANONICAL_SYNONYMS.items():
                for syn in synonyms:
                    if clean_src == syn:
                        best_match = canonical_col
                        best_conf = 0.98
                        break
                    elif syn in clean_src or clean_src in syn:
                        conf = 0.85 if len(syn) > 3 else 0.70
                        if conf > best_conf:
                            best_match = canonical_col
                            best_conf = conf
                if best_conf >= 0.95:
                    break

            if best_match and best_match not in mapped.values():
                mapped[src] = best_match
                confidences[src] = round(best_conf, 2)
            else:
                unmapped.append(src)

        # Check required fields
        required_fields = ["date", "district", "occupation", "job_demand"]
        missing_critical = [req for req in required_fields if req not in mapped.values()]

        return {
            "total_source_columns": len(source_cols),
            "mapped_mappings": [
                {"source_column": src, "canonical_column": mapped[src], "confidence": confidences[src]}
                for src in mapped
            ],
            "unmapped_columns": unmapped,
            "missing_critical_fields": missing_critical,
            "is_valid": len(missing_critical) == 0
        }

    def transform_and_ingest(
        self,
        df: pd.DataFrame,
        confirmed_mapping: Dict[str, str],
        data_mode: str = "sih_dummy",
        retrain_model: bool = False
    ) -> Dict[str, Any]:
        """
        Transforms source dataframe into canonical schema and persists into SQLite table.
        """
        # Rename columns according to confirmed mapping
        renamed = df.rename(columns=confirmed_mapping).copy()

        # Fill default fields if missing
        if "state" not in renamed.columns:
            renamed["state"] = "Uttar Pradesh"
        if "sector" not in renamed.columns:
            renamed["sector"] = "General Trades"
        if "nco_code" not in renamed.columns:
            renamed["nco_code"] = "9999.0000"
        if "qualification" not in renamed.columns:
            renamed["qualification"] = "QP-GEN/Q0001"
        if "nsqf_level" not in renamed.columns:
            renamed["nsqf_level"] = 4
        if "training_seats" not in renamed.columns:
            renamed["training_seats"] = (renamed["job_demand"] * 0.7).astype(int)
        if "enrolled" not in renamed.columns:
            renamed["enrolled"] = (renamed["training_seats"] * 0.9).astype(int)
        if "certified" not in renamed.columns:
            renamed["certified"] = (renamed["enrolled"] * 0.85).astype(int)
        if "available_supply" not in renamed.columns:
            renamed["available_supply"] = (renamed["certified"] * 0.8).astype(int)
        if "placement_rate" not in renamed.columns:
            renamed["placement_rate"] = 0.75
        if "wage_signal" not in renamed.columns:
            renamed["wage_signal"] = 20000
        if "employer_count" not in renamed.columns:
            renamed["employer_count"] = (renamed["job_demand"] * 0.05).astype(int).clip(1)
        if "industry_signal" not in renamed.columns:
            renamed["industry_signal"] = 1.0

        renamed["source"] = "Official SIH Evaluation Dataset"
        renamed["data_mode"] = data_mode
        renamed["confidence"] = 0.90
        renamed["updated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Format date
        renamed["date"] = pd.to_datetime(renamed["date"]).dt.strftime("%Y-%m-01")

        # Save into SQLite table
        conn = sqlite3.connect(self.db_path)
        renamed.to_sql("canonical_labour_records", conn, if_exists="replace", index=False)
        conn.close()

        result = {
            "status": "success",
            "ingested_records": len(renamed),
            "data_mode": data_mode,
            "table": "canonical_labour_records",
            "model_retrained": False
        }

        if retrain_model:
            from ml.train_demand_model import train_and_evaluate
            train_and_evaluate()
            result["model_retrained"] = True

        return result
