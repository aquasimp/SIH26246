"""
KaushalPulse Deterministic Synthetic Dataset Generator
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246 (PS 26242)

Generates 60 months of historical observations across 4 States, 16 Districts,
6 Sectors, and 32 Occupations according to the Canonical Data Contract.
Naturally plants the Gorakhpur Solar PV Installer shortage and Retail Sales oversupply.
"""

import numpy as np
import pandas as pd
import sqlite3
import os
import datetime
from typing import List, Dict, Any
from canonical_schema import CANONICAL_COLUMNS

SEED = 42
np.random.seed(SEED)

STATES_DISTRICTS = {
    "Uttar Pradesh": ["Gorakhpur", "Lucknow", "Varanasi", "Gautam Buddha Nagar"],
    "Maharashtra": ["Pune", "Mumbai Suburban", "Nagpur", "Nashik"],
    "Karnataka": ["Bengaluru Urban", "Mysuru", "Dharwad", "Dakshina Kannada"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"]
}

OCCUPATIONS_DEF = [
    # Green Jobs
    {"title": "Solar PV Installer", "nco": "7126.0101", "sector": "Green Jobs & Renewable Energy", "qp": "QP-SGJ/Q0101", "nsqf": 4, "base_demand": 380, "growth": 0.016, "base_seats": 180, "wage": 23500, "util": 0.92, "pass_rate": 0.88, "part_rate": 0.82, "place_rate": 0.89},
    {"title": "Smart Meter Installation Technician", "nco": "7131.0101", "sector": "Green Jobs & Renewable Energy", "qp": "QP-PSS/Q0110", "nsqf": 3, "base_demand": 320, "growth": 0.018, "base_seats": 160, "wage": 21000, "util": 0.94, "pass_rate": 0.90, "part_rate": 0.83, "place_rate": 0.85},
    {"title": "Solar Plant Maintenance Technician", "nco": "7126.0201", "sector": "Green Jobs & Renewable Energy", "qp": "QP-SGJ/Q0102", "nsqf": 4, "base_demand": 260, "growth": 0.014, "base_seats": 140, "wage": 24000, "util": 0.90, "pass_rate": 0.86, "part_rate": 0.80, "place_rate": 0.86},
    {"title": "Green Building Energy Auditor", "nco": "2149.0101", "sector": "Green Jobs & Renewable Energy", "qp": "QP-SGJ/Q0103", "nsqf": 6, "base_demand": 140, "growth": 0.015, "base_seats": 80, "wage": 38000, "util": 0.91, "pass_rate": 0.85, "part_rate": 0.88, "place_rate": 0.88},
    {"title": "Biomass Pellet Plant Operator", "nco": "8131.0101", "sector": "Green Jobs & Renewable Energy", "qp": "QP-SGJ/Q0201", "nsqf": 4, "base_demand": 190, "growth": 0.010, "base_seats": 120, "wage": 20000, "util": 0.88, "pass_rate": 0.84, "part_rate": 0.80, "place_rate": 0.82},

    # Retail, Logistics & Supply Chain
    {"title": "Retail Sales Associate", "nco": "5223.0101", "sector": "Retail, Logistics & Supply Chain", "qp": "QP-RAS/Q0104", "nsqf": 3, "base_demand": 620, "growth": -0.007, "base_seats": 850, "wage": 14500, "util": 0.95, "pass_rate": 0.91, "part_rate": 0.75, "place_rate": 0.42},
    {"title": "Tele-Sales Executive", "nco": "5244.0101", "sector": "Retail, Logistics & Supply Chain", "qp": "QP-BPO/Q0201", "nsqf": 3, "base_demand": 590, "growth": -0.005, "base_seats": 720, "wage": 15000, "util": 0.96, "pass_rate": 0.91, "part_rate": 0.77, "place_rate": 0.48},
    {"title": "Warehouse Logistics Coordinator", "nco": "4321.0101", "sector": "Retail, Logistics & Supply Chain", "qp": "QP-LSC/Q0101", "nsqf": 4, "base_demand": 380, "growth": 0.012, "base_seats": 320, "wage": 22000, "util": 0.93, "pass_rate": 0.89, "part_rate": 0.84, "place_rate": 0.80},
    {"title": "Inventory Control Clerk", "nco": "4321.0201", "sector": "Retail, Logistics & Supply Chain", "qp": "QP-LSC/Q0102", "nsqf": 3, "base_demand": 310, "growth": -0.002, "base_seats": 420, "wage": 16500, "util": 0.92, "pass_rate": 0.90, "part_rate": 0.78, "place_rate": 0.55},
    {"title": "Cold Chain Storage Technician", "nco": "7127.0101", "sector": "Retail, Logistics & Supply Chain", "qp": "QP-LSC/Q0103", "nsqf": 4, "base_demand": 240, "growth": 0.015, "base_seats": 150, "wage": 25000, "util": 0.90, "pass_rate": 0.87, "part_rate": 0.82, "place_rate": 0.84},

    # Automotive & Advanced Manufacturing
    {"title": "EV Service Technician", "nco": "7233.0102", "sector": "Automotive & Advanced Manufacturing", "qp": "QP-ASC/Q1424", "nsqf": 4, "base_demand": 420, "growth": 0.022, "base_seats": 260, "wage": 28000, "util": 0.94, "pass_rate": 0.88, "part_rate": 0.86, "place_rate": 0.91},
    {"title": "CNC Machine Operator", "nco": "8151.0101", "sector": "Automotive & Advanced Manufacturing", "qp": "QP-CSC/Q0115", "nsqf": 4, "base_demand": 580, "growth": 0.011, "base_seats": 340, "wage": 24000, "util": 0.94, "pass_rate": 0.91, "part_rate": 0.84, "place_rate": 0.85},
    {"title": "Industrial Automation Specialist", "nco": "7412.0101", "sector": "Automotive & Advanced Manufacturing", "qp": "QP-IAS/Q8001", "nsqf": 5, "base_demand": 390, "growth": 0.017, "base_seats": 210, "wage": 32000, "util": 0.93, "pass_rate": 0.89, "part_rate": 0.86, "place_rate": 0.88},
    {"title": "Drone Maintenance Technician", "nco": "7212.0101", "sector": "Automotive & Advanced Manufacturing", "qp": "QP-AER/Q0801", "nsqf": 4, "base_demand": 160, "growth": 0.026, "base_seats": 90, "wage": 29000, "util": 0.94, "pass_rate": 0.88, "part_rate": 0.85, "place_rate": 0.92},
    {"title": "Tool & Die Maker", "nco": "7222.0101", "sector": "Automotive & Advanced Manufacturing", "qp": "QP-CSC/Q0301", "nsqf": 5, "base_demand": 310, "growth": 0.008, "base_seats": 250, "wage": 27000, "util": 0.92, "pass_rate": 0.89, "part_rate": 0.85, "place_rate": 0.82},
    {"title": "Advanced Welder TIG/MIG", "nco": "7212.0201", "sector": "Automotive & Advanced Manufacturing", "qp": "QP-CSC/Q0201", "nsqf": 4, "base_demand": 440, "growth": 0.010, "base_seats": 320, "wage": 25000, "util": 0.93, "pass_rate": 0.90, "part_rate": 0.84, "place_rate": 0.84},

    # IT & ITES
    {"title": "AI/ML Data Annotation Specialist", "nco": "2512.0101", "sector": "IT & ITES", "qp": "QP-SSC/Q8101", "nsqf": 5, "base_demand": 510, "growth": 0.025, "base_seats": 350, "wage": 26000, "util": 0.93, "pass_rate": 0.92, "part_rate": 0.88, "place_rate": 0.89},
    {"title": "General Data Entry Operator", "nco": "4132.0101", "sector": "IT & ITES", "qp": "QP-SSC/Q2212", "nsqf": 3, "base_demand": 640, "growth": -0.010, "base_seats": 940, "wage": 13500, "util": 0.96, "pass_rate": 0.93, "part_rate": 0.73, "place_rate": 0.38},
    {"title": "Cybersecurity Operations Associate", "nco": "2529.0101", "sector": "IT & ITES", "qp": "QP-SSC/Q0909", "nsqf": 5, "base_demand": 410, "growth": 0.021, "base_seats": 280, "wage": 34000, "util": 0.93, "pass_rate": 0.88, "part_rate": 0.86, "place_rate": 0.90},
    {"title": "Cloud Infrastructure Technician", "nco": "3513.0101", "sector": "IT & ITES", "qp": "QP-SSC/Q0112", "nsqf": 5, "base_demand": 380, "growth": 0.018, "base_seats": 240, "wage": 31000, "util": 0.92, "pass_rate": 0.87, "part_rate": 0.86, "place_rate": 0.88},
    {"title": "Telecom Optical Fibre Splicer", "nco": "7422.0101", "sector": "IT & ITES", "qp": "QP-TEL/Q4100", "nsqf": 4, "base_demand": 340, "growth": 0.013, "base_seats": 220, "wage": 22000, "util": 0.91, "pass_rate": 0.89, "part_rate": 0.83, "place_rate": 0.85},

    # Healthcare & Life Sciences
    {"title": "Community Health Assistant", "nco": "3253.0101", "sector": "Healthcare & Life Sciences", "qp": "QP-HSS/Q5101", "nsqf": 4, "base_demand": 420, "growth": 0.015, "base_seats": 290, "wage": 19500, "util": 0.93, "pass_rate": 0.90, "part_rate": 0.82, "place_rate": 0.87},
    {"title": "Medical Equipment Maintenance Assistant", "nco": "3211.0101", "sector": "Healthcare & Life Sciences", "qp": "QP-HSS/Q5601", "nsqf": 5, "base_demand": 210, "growth": 0.016, "base_seats": 140, "wage": 27000, "util": 0.91, "pass_rate": 0.86, "part_rate": 0.84, "place_rate": 0.86},
    {"title": "Phlebotomy Technician", "nco": "3212.0101", "sector": "Healthcare & Life Sciences", "qp": "QP-HSS/Q0301", "nsqf": 4, "base_demand": 310, "growth": 0.012, "base_seats": 230, "wage": 21000, "util": 0.94, "pass_rate": 0.91, "part_rate": 0.83, "place_rate": 0.84},
    {"title": "Emergency Medical Technician (Basic)", "nco": "3258.0101", "sector": "Healthcare & Life Sciences", "qp": "QP-HSS/Q2301", "nsqf": 4, "base_demand": 260, "growth": 0.014, "base_seats": 180, "wage": 23000, "util": 0.92, "pass_rate": 0.88, "part_rate": 0.85, "place_rate": 0.88},
    {"title": "Geriatric Care Aide", "nco": "5322.0101", "sector": "Healthcare & Life Sciences", "qp": "QP-HSS/Q5102", "nsqf": 3, "base_demand": 280, "growth": 0.019, "base_seats": 190, "wage": 18000, "util": 0.90, "pass_rate": 0.89, "part_rate": 0.81, "place_rate": 0.85},

    # Construction & Infrastructure
    {"title": "Construction BIM Modeler", "nco": "3118.0101", "sector": "Construction & Infrastructure", "qp": "QP-CON/Q0301", "nsqf": 5, "base_demand": 220, "growth": 0.020, "base_seats": 130, "wage": 33000, "util": 0.91, "pass_rate": 0.85, "part_rate": 0.86, "place_rate": 0.88},
    {"title": "Bar Bender & Steel Fixer", "nco": "7114.0101", "sector": "Construction & Infrastructure", "qp": "QP-CON/Q0201", "nsqf": 3, "base_demand": 480, "growth": 0.005, "base_seats": 420, "wage": 19000, "util": 0.94, "pass_rate": 0.91, "part_rate": 0.80, "place_rate": 0.78},
    {"title": "Heavy Earthmoving Equipment Operator", "nco": "8342.0101", "sector": "Construction & Infrastructure", "qp": "QP-CON/Q0401", "nsqf": 4, "base_demand": 330, "growth": 0.013, "base_seats": 210, "wage": 26000, "util": 0.93, "pass_rate": 0.88, "part_rate": 0.84, "place_rate": 0.86},
    {"title": "Plumber (General & Fire Piping)", "nco": "7126.0301", "sector": "Construction & Infrastructure", "qp": "QP-PSC/Q0101", "nsqf": 3, "base_demand": 370, "growth": 0.008, "base_seats": 320, "wage": 20000, "util": 0.92, "pass_rate": 0.90, "part_rate": 0.82, "place_rate": 0.80},
    {"title": "Mason (Concrete & Tiling)", "nco": "7112.0101", "sector": "Construction & Infrastructure", "qp": "QP-CON/Q0101", "nsqf": 3, "base_demand": 450, "growth": 0.004, "base_seats": 410, "wage": 19500, "util": 0.93, "pass_rate": 0.91, "part_rate": 0.79, "place_rate": 0.77},
    {"title": "Scaffolder & Formwork Specialist", "nco": "7119.0101", "sector": "Construction & Infrastructure", "qp": "QP-CON/Q0501", "nsqf": 3, "base_demand": 310, "growth": 0.006, "base_seats": 280, "wage": 18500, "util": 0.92, "pass_rate": 0.89, "part_rate": 0.81, "place_rate": 0.79}
]

def generate_monthly_dates(n_months: int = 60) -> List[str]:
    base_date = datetime.date(2021, 11, 1)
    dates = []
    for i in range(n_months):
        year = base_date.year + (base_date.month - 1 + i) // 12
        month = (base_date.month - 1 + i) % 12 + 1
        dates.append(f"{year:04d}-{month:02d}-01")
    return dates

def get_district_modifier(state: str, district: str, occ: Dict) -> float:
    # Pilot Gorakhpur Solar PV acceleration
    if district == "Gorakhpur" and occ["title"] == "Solar PV Installer":
        return 1.45
    # Gorakhpur Retail saturation (e-commerce impact, retail oversupply)
    if district == "Gorakhpur" and occ["title"] == "Retail Sales Associate":
        return 0.28
    # Pune Automotive & EV acceleration
    if district == "Pune" and occ["sector"] == "Automotive & Advanced Manufacturing":
        return 1.35
    # Bengaluru IT & Annotation
    if district == "Bengaluru Urban" and occ["sector"] == "IT & ITES":
        return 1.40
    # Ahmedabad / Surat Manufacturing & Solar
    if district in ["Ahmedabad", "Surat"] and occ["sector"] in ["Green Jobs & Renewable Energy", "Automotive & Advanced Manufacturing"]:
        return 1.25
    return 1.0

def generate_canonical_dataset(output_dir: str = "data"):
    dates = generate_monthly_dates(60)
    records = []

    print(f"Generating deterministic synthetic dataset (60 months, 4 states, 16 districts, 32 occupations)...")

    for state, districts in STATES_DISTRICTS.items():
        for district in districts:
            for occ in OCCUPATIONS_DEF:
                dist_mod = get_district_modifier(state, district, occ)
                base_demand = occ["base_demand"] * dist_mod
                base_seats = occ["base_seats"] * (0.8 if district == "Gorakhpur" and occ["title"] == "Solar PV Installer" else 1.0)
                monthly_growth = occ["growth"]
                
                # Special Gorakhpur Solar PV boost in last 12 months (PM Surya Ghar scheme)
                is_hero_solar = (district == "Gorakhpur" and occ["title"] == "Solar PV Installer")

                for month_idx, dt in enumerate(dates):
                    dt_obj = datetime.datetime.strptime(dt, "%Y-%m-%d")
                    m = dt_obj.month
                    
                    # Seasonality
                    # Construction & Solar dip during monsoon (Jul-Aug)
                    season_factor = 1.0
                    if occ["sector"] in ["Green Jobs & Renewable Energy", "Construction & Infrastructure"]:
                        if m in [7, 8]:
                            season_factor = 0.88
                        elif m in [2, 3, 4, 11, 12]:
                            season_factor = 1.08
                    elif occ["sector"] == "Retail, Logistics & Supply Chain":
                        if m in [10, 11]: # Festive season
                            season_factor = 1.15
                        elif m in [1, 2]:
                            season_factor = 0.90

                    # Demand calculation with realistic noise
                    growth_multiplier = (1 + monthly_growth) ** month_idx
                    if is_hero_solar and month_idx >= 48: # Last year acceleration (+21.4% 6M)
                        growth_multiplier *= (1.008 ** (month_idx - 47))

                    raw_demand = base_demand * growth_multiplier * season_factor
                    noise = np.random.normal(0, 0.04 * raw_demand)
                    final_demand = int(max(20, round(raw_demand + noise)))

                    # Employers
                    emp_count = int(max(5, round(final_demand * 0.055 + np.random.normal(0, 2))))

                    # Training capacity pipeline
                    seats = int(base_seats * (1 + 0.003 * month_idx))
                    if is_hero_solar:
                        seats = 180 # Capacity constrained at 180 seats in Gorakhpur
                    elif district == "Gorakhpur" and occ["title"] == "Retail Sales Associate":
                        seats = 850 # Legacy excess capacity

                    enrolled = int(seats * occ["util"] * (1 + np.random.normal(0, 0.02)))
                    enrolled = min(seats, max(10, enrolled))

                    certified = int(enrolled * occ["pass_rate"] * (1 + np.random.normal(0, 0.02)))
                    certified = min(enrolled, max(8, certified))

                    available = int(certified * occ["part_rate"] * (1 + np.random.normal(0, 0.02)))
                    available = min(certified, max(6, available))

                    base_pr = 0.60 if (district == "Gorakhpur" and occ["title"] == "Retail Sales Associate") else occ["place_rate"]
                    placement_rate = float(np.clip(base_pr + (0.02 if is_hero_solar else 0.0) + np.random.normal(0, 0.015), 0.25, 0.98))
                    wage = int(occ["wage"] * (1 + 0.004 * month_idx) + np.random.normal(0, 250))
                    industry_sig = float(np.clip(dist_mod * (1.2 if is_hero_solar else 1.0) + np.random.normal(0, 0.05), 0.5, 2.5))

                    record = {
                        "date": dt,
                        "state": state,
                        "district": district,
                        "sector": occ["sector"],
                        "occupation": occ["title"],
                        "nco_code": occ["nco"],
                        "qualification": occ["qp"],
                        "nsqf_level": occ["nsqf"],
                        "job_demand": final_demand,
                        "employer_count": emp_count,
                        "training_seats": seats,
                        "enrolled": enrolled,
                        "certified": certified,
                        "available_supply": available,
                        "placement_rate": round(placement_rate, 3),
                        "wage_signal": wage,
                        "industry_signal": round(industry_sig, 3),
                        "source": "Skill India Digital + NCS Aggregates",
                        "data_mode": "synthetic",
                        "confidence": 0.85 if not is_hero_solar else 0.91,
                        "updated_at": "2026-10-04T00:00:00Z"
                    }
                    records.append(record)

    df = pd.DataFrame(records)
    os.makedirs(output_dir, exist_ok=True)

    # 1. Save CSV
    csv_path = os.path.join(output_dir, "canonical_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Saved canonical CSV to: {csv_path} ({len(df)} rows)")

    # 2. Save SQLite Database
    db_path = os.path.join(output_dir, "kaushal_pulse.db")
    conn = sqlite3.connect(db_path)
    df.to_sql("canonical_labour_records", conn, if_exists="replace", index=False)
    
    # Create indexes for fast query performance
    cursor = conn.cursor()
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_district_nco ON canonical_labour_records (district, nco_code);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_date ON canonical_labour_records (date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_state ON canonical_labour_records (state);")
    conn.commit()
    conn.close()
    print(f"Saved SQLite database to: {db_path} with table 'canonical_labour_records'")

    # Validate Gorakhpur Solar PV vs Retail Sales in final month
    latest_month = dates[-1]
    solar_gorakhpur = df[(df["date"] == latest_month) & (df["district"] == "Gorakhpur") & (df["nco_code"] == "7126.0101")].iloc[0]
    retail_gorakhpur = df[(df["date"] == latest_month) & (df["district"] == "Gorakhpur") & (df["nco_code"] == "5223.0101")].iloc[0]

    print("\n=======================================================")
    print("VERIFICATION OF PLANTED DEMO SCENARIO (Date:", latest_month, ")")
    print("=======================================================")
    print(f"Solar PV Installer (Gorakhpur): Demand = {solar_gorakhpur['job_demand']}, Training Seats = {solar_gorakhpur['training_seats']}, Effective Supply = {int(solar_gorakhpur['available_supply'] * solar_gorakhpur['placement_rate'])}")
    print(f"Retail Sales Associate (Gorakhpur): Demand = {retail_gorakhpur['job_demand']}, Training Seats = {retail_gorakhpur['training_seats']}, Effective Supply = {int(retail_gorakhpur['available_supply'] * retail_gorakhpur['placement_rate'])}")
    print("=======================================================\n")

if __name__ == "__main__":
    generate_canonical_dataset()
