"""
KaushalPulse Data Adapter: Official SIH Evaluation Dataset Adapter
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Ingests, normalizes, validates, and persists unformatted official SIH evaluation datasets.
Translates heterogeneous raw columns into the canonical MSDE labor market intelligence schema.
"""

import os
import re
import datetime
import sqlite3
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Tuple

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from ml.occupation_normalizer import normalize_occupation

CANONICAL_SYNONYMS = {
    "job_demand": ["job_demand", "job_count", "vacancies", "openings", "demand", "positions", "hiring_count"],
    "district": ["district", "district_name", "dist", "location", "city", "district_id"],
    "state": ["state", "state_name", "region", "province"],
    "occupation": ["occupation", "trade", "trade_name", "job_role", "role", "title", "designation"],
    "date": ["date", "reporting_period", "month", "period", "timestamp", "year_month", "time"],
    "training_seats": ["training_seats", "seat_count", "seats", "capacity", "intake", "sanctioned_seats"],
    "enrolled": ["enrolled", "enrolled_trainees", "admitted", "students", "trainees"],
    "certified": ["certified", "certified_trainees", "passed", "passouts", "graduates"],
    "placed": ["placed_trainees", "placed", "placements", "employed"],
    "wage_signal": ["wage_signal", "avg_reported_salary", "wage", "salary", "median_wage", "pay"],
    "employer_count": ["employer_count", "active_employers", "employers", "enterprises", "companies"]
}

DISTRICT_CANONICAL_MAP = {
    "gorakhpur": "Gorakhpur",
    "lucknow": "Lucknow",
    "varanasi": "Varanasi",
    "kanpur nagar": "Kanpur Nagar",
    "kanpur": "Kanpur Nagar",
    "pune": "Pune",
    "chhatrapati sambhajinagar": "Chhatrapati Sambhajinagar",
    "aurangabad": "Chhatrapati Sambhajinagar",
    "nashik": "Nashik",
    "nagpur": "Nagpur",
    "ahmedabad": "Ahmedabad",
    "rajkot": "Rajkot",
    "surat": "Surat",
    "vadodara": "Vadodara",
    "bengaluru urban": "Bengaluru Urban",
    "bengaluru": "Bengaluru Urban",
    "bangalore": "Bengaluru Urban",
    "mysuru": "Mysuru",
    "mysore": "Mysuru",
    "dharwad": "Dharwad",
    "coimbatore": "Coimbatore"
}

class SIHDummyDataAdapter:
    def __init__(self, db_path: str = "data/kaushal_pulse.db"):
        self.db_path = db_path

    def review_schema_mapping(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyzes source columns and proposes canonical mapping without silently guessing critical fields."""
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

    def load_raw_file(self, file_path: str = "data/raw/sih_official_dummy_dataset.csv") -> pd.DataFrame:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Raw SIH dataset not found at {file_path}")
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".csv":
            return pd.read_csv(file_path)
        elif ext in [".xlsx", ".xls"]:
            return pd.read_excel(file_path)
        elif ext == ".json":
            return pd.read_json(file_path)
        else:
            raise ValueError(f"Unsupported format: {ext}")

    def normalize_and_validate(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        raw_rows = len(df)
        warnings = []
        errors = []

        # 1. Normalize dates
        date_col = None
        for col in df.columns:
            clean = col.lower().strip()
            if any(syn == clean or syn in clean for syn in CANONICAL_SYNONYMS["date"]):
                date_col = col
                break
        
        if not date_col:
            raise ValueError("Required date/reporting_period column not found in SIH dataset")

        df["canonical_date"] = pd.to_datetime(df[date_col], format="mixed").dt.strftime("%Y-%m-01")

        # 2. Normalize geography
        state_col = "state_name" if "state_name" in df.columns else "state"
        dist_col = "district_name" if "district_name" in df.columns else "district"

        def clean_district(d_str: str) -> str:
            raw = str(d_str).strip().lower()
            return DISTRICT_CANONICAL_MAP.get(raw, str(d_str).strip().title())

        df["canonical_state"] = df[state_col].astype(str).str.strip().str.title()
        df["canonical_district"] = df[dist_col].apply(clean_district)

        # 3. Normalize Occupations and NCO Codes
        trade_col = "trade_name" if "trade_name" in df.columns else "occupation"
        normalized_occs = []
        nco_codes = []
        occ_confidences = []

        for trade in df[trade_col]:
            norm_res = normalize_occupation(str(trade))
            normalized_occs.append(norm_res["canonical_title"])
            nco_codes.append(norm_res["mapped_nco"])
            occ_confidences.append(norm_res["confidence"])

        df["canonical_occupation"] = normalized_occs
        df["canonical_nco"] = nco_codes
        df["occ_confidence"] = occ_confidences

        # 4. Map Quantitative Demands and Supplies
        demand_col = "job_count" if "job_count" in df.columns else "job_demand"
        seat_col = "seat_count" if "seat_count" in df.columns else "training_seats"
        enrolled_col = "enrolled_trainees" if "enrolled_trainees" in df.columns else "enrolled"
        cert_col = "certified_trainees" if "certified_trainees" in df.columns else "certified"
        placed_col = "placed_trainees" if "placed_trainees" in df.columns else "placed"

        df["canonical_demand"] = df[demand_col].fillna(0).astype(int).clip(lower=0)
        df["canonical_seats"] = df[seat_col].fillna(0).astype(int).clip(lower=0)
        df["canonical_enrolled"] = df[enrolled_col].fillna(df["canonical_seats"] * 0.9).astype(int).clip(lower=0)
        df["canonical_certified"] = df[cert_col].fillna(df["canonical_enrolled"] * 0.85).astype(int).clip(lower=0)
        
        if placed_col in df.columns:
            placed = df[placed_col].fillna(df["canonical_certified"] * 0.65).astype(int).clip(lower=0)
            df["canonical_placement_rate"] = np.where(
                df["canonical_certified"] > 0,
                (placed / df["canonical_certified"]).round(3),
                0.65
            )
        else:
            df["canonical_placement_rate"] = 0.72

        df["canonical_available_supply"] = (df["canonical_certified"] * 0.82).astype(int)

        # 5. Wages and Employers
        wage_col = "avg_reported_salary" if "avg_reported_salary" in df.columns else "wage_signal"
        emp_col = "active_employers" if "active_employers" in df.columns else "employer_count"
        sector_col = "sector_name" if "sector_name" in df.columns else "sector"

        df["canonical_wage"] = df[wage_col].fillna(22000).astype(int) if wage_col in df.columns else 22000
        df["canonical_employers"] = df[emp_col].fillna(10).astype(int).clip(lower=1) if emp_col in df.columns else 10
        df["canonical_sector"] = df[sector_col].astype(str).str.strip() if sector_col in df.columns else "General Industry"

        # 6. Quality and Validation Flags
        null_critical = df[["canonical_date", "canonical_district", "canonical_nco", "canonical_demand"]].isnull().any(axis=1)
        if null_critical.any():
            warnings.append(f"Found {null_critical.sum()} records with missing critical fields. Dropping them.")
            df = df[~null_critical].copy()

        # Deduplication on (date, district, nco_code)
        dups = df.duplicated(subset=["canonical_date", "canonical_district", "canonical_nco"])
        if dups.any():
            warnings.append(f"Found {dups.sum()} duplicate observation rows. Aggregating/keeping first.")
            df = df.drop_duplicates(subset=["canonical_date", "canonical_district", "canonical_nco"])

        # Construct Canonical DataFrame
        canonical_df = pd.DataFrame({
            "date": df["canonical_date"],
            "state": df["canonical_state"],
            "district": df["canonical_district"],
            "sector": df["canonical_sector"],
            "occupation": df["canonical_occupation"],
            "nco_code": df["canonical_nco"],
            "qualification": "QP-" + df["canonical_nco"].str.replace(".", "/", regex=False),
            "nsqf_level": 4,
            "job_demand": df["canonical_demand"],
            "employer_count": df["canonical_employers"],
            "training_seats": df["canonical_seats"],
            "enrolled": df["canonical_enrolled"],
            "certified": df["canonical_certified"],
            "available_supply": df["canonical_available_supply"],
            "placement_rate": df["canonical_placement_rate"],
            "wage_signal": df["canonical_wage"],
            "industry_signal": 1.25,
            "source": df.get("data_source_feed", "Official SIH Evaluation Feed"),
            "data_mode": "sih_dummy",
            "confidence": df["occ_confidence"],
            "validation_status": "VALID",
            "quality_flag": "CLEAN",
            "updated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        })

        # Sort chronologically
        canonical_df = canonical_df.sort_values(by=["district", "nco_code", "date"]).reset_index(drop=True)

        audit_report = {
            "raw_records": raw_rows,
            "clean_records": len(canonical_df),
            "dropped_records": raw_rows - len(canonical_df),
            "warnings": warnings,
            "errors": errors,
            "occupation_mapping_accuracy": round(float(canonical_df["confidence"].mean()), 3),
            "date_range": [canonical_df["date"].min(), canonical_df["date"].max()],
            "districts_count": int(canonical_df["district"].nunique()),
            "occupations_count": int(canonical_df["nco_code"].nunique())
        }

        return canonical_df, audit_report

    def ingest_to_database(self, canonical_df: pd.DataFrame, table_name: str = "sih_monthly_intelligence") -> int:
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        
        # Save into specialized SIH table
        canonical_df.to_sql(table_name, conn, if_exists="replace", index=False)

        # Create indexes for high-speed queries
        cursor = conn.cursor()
        cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_{table_name}_dist_nco ON {table_name} (district, nco_code)")
        cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_{table_name}_date ON {table_name} (date)")
        cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_{table_name}_mode ON {table_name} (data_mode)")
        conn.commit()
        conn.close()

        # Also persist clean CSV artifact
        csv_out = "data/sih_canonical_dataset.csv"
        canonical_df.to_csv(csv_out, index=False)
        print(f"Ingested {len(canonical_df)} records into SQLite table '{table_name}' and saved {csv_out}")
        return len(canonical_df)

    def run_full_pipeline(self, raw_path: str = "data/raw/sih_official_dummy_dataset.csv") -> Dict[str, Any]:
        raw_df = self.load_raw_file(raw_path)
        canonical_df, report = self.normalize_and_validate(raw_df)
        ingested_count = self.ingest_to_database(canonical_df)
        report["ingested_count"] = ingested_count
        return report

if __name__ == "__main__":
    adapter = SIHDummyDataAdapter()
    res = adapter.run_full_pipeline()
    print("SIH Dummy Data Adapter Result:", res)
