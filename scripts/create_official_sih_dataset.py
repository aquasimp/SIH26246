"""
Script: Generate Authentic Official SIH Dummy Dataset
Problem Statement: PS 26242 - MSDE
Generates unnormalized, ministry-formatted raw evaluation dataset for testing ingestion adapters.
"""

import os
import random
import datetime
import numpy as np
import pandas as pd

def generate_sih_official_dataset(output_dir="data/raw"):
    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)
    np.random.seed(42)

    districts = [
        {"state": "Uttar Pradesh", "district": "Gorakhpur", "weight": 1.1},
        {"state": "Uttar Pradesh", "district": "Lucknow", "weight": 1.3},
        {"state": "Uttar Pradesh", "district": "Varanasi", "weight": 1.0},
        {"state": "Uttar Pradesh", "district": "Kanpur Nagar", "weight": 1.15},
        {"state": "Maharashtra", "district": "Pune", "weight": 1.4},
        {"state": "Maharashtra", "district": "Chhatrapati Sambhajinagar", "weight": 0.9},
        {"state": "Maharashtra", "district": "Nashik", "weight": 0.95},
        {"state": "Maharashtra", "district": "Nagpur", "weight": 1.05},
        {"state": "Gujarat", "district": "Ahmedabad", "weight": 1.35},
        {"state": "Gujarat", "district": "Rajkot", "weight": 0.95},
        {"state": "Gujarat", "district": "Surat", "weight": 1.25},
        {"state": "Gujarat", "district": "Vadodara", "weight": 1.0},
        {"state": "Karnataka", "district": "Bengaluru Urban", "weight": 1.5},
        {"state": "Karnataka", "district": "Mysuru", "weight": 0.9},
        {"state": "Karnataka", "district": "Dharwad", "weight": 0.85},
        {"state": "Tamil Nadu", "district": "Coimbatore", "weight": 1.2},
    ]

    trades = [
        {"name": "Solar PV Installer (Suryamitra)", "sector": "Green Jobs & Renewable Energy", "base_d": 580, "base_s": 180, "trend": 0.28, "nco": "7126.0101"},
        {"name": "Retail Store Sales Associate", "sector": "Retail & E-Commerce", "base_d": 410, "base_s": 850, "trend": -0.09, "nco": "5223.0101"},
        {"name": "Electric Vehicle (EV) Service Technician", "sector": "Automotive & Electric Mobility", "base_d": 320, "base_s": 90, "trend": 0.38, "nco": "7233.0102"},
        {"name": "Indic Speech AI & Data Annotation Specialist", "sector": "IT-ITeS & Digital Services", "base_d": 260, "base_s": 40, "trend": 0.42, "nco": "2512.0101"},
        {"name": "CNC Milling and Turning Operator", "sector": "Capital Goods & Precision Engineering", "base_d": 480, "base_s": 310, "trend": 0.12, "nco": "8151.0101"},
        {"name": "General Duty Healthcare Assistant (GDA)", "sector": "Healthcare & Allied Services", "base_d": 520, "base_s": 260, "trend": 0.19, "nco": "5321.0101"},
        {"name": "Agricultural Drone Maintenance & Pilot", "sector": "Aerospace & Drone Tech", "base_d": 140, "base_s": 20, "trend": 0.45, "nco": "7212.0101"},
        {"name": "Domestic Electrical & Wireman", "sector": "Construction & Infrastructure", "base_d": 650, "base_s": 580, "trend": 0.04, "nco": "7411.0101"},
        {"name": "Industrial Automation & PLC Technician", "sector": "Electronics & Hardware", "base_d": 290, "base_s": 110, "trend": 0.24, "nco": "7412.0201"},
        {"name": "Smart Water & Utility Metering Technician", "sector": "Green Jobs & Renewable Energy", "base_d": 340, "base_s": 70, "trend": 0.31, "nco": "7233.0201"},
        {"name": "Data Entry and Office Console Operator", "sector": "IT-ITeS & Digital Services", "base_d": 380, "base_s": 690, "trend": -0.12, "nco": "4132.0101"},
        {"name": "Commercial Cold Storage & HVAC Mechanic", "sector": "Food Processing & Cold Chain", "base_d": 220, "base_s": 90, "trend": 0.16, "nco": "7127.0101"},
        {"name": "Warehouse Logistics Picker & Sorter", "sector": "Logistics & Supply Chain", "base_d": 430, "base_s": 390, "trend": 0.08, "nco": "9333.0101"},
        {"name": "Sewing Machine Operator (Apparel)", "sector": "Textiles & Handlooms", "base_d": 310, "base_s": 360, "trend": -0.03, "nco": "8153.0101"},
        {"name": "Micro-Irrigation Solar Pump Technician", "sector": "Agriculture & Farm Tech", "base_d": 280, "base_s": 80, "trend": 0.26, "nco": "7126.0201"},
        {"name": "Automotive Assembly & Body Fitter", "sector": "Automotive & Electric Mobility", "base_d": 490, "base_s": 420, "trend": 0.05, "nco": "7231.0101"},
    ]

    # Generate dates from 2022-01 to 2024-10 (34 months)
    start_date = datetime.date(2022, 1, 1)
    months = []
    curr = start_date
    while curr <= datetime.date(2024, 10, 1):
        months.append(curr)
        # Advance 1 month
        m = curr.month + 1
        y = curr.year
        if m > 12:
            m = 1
            y += 1
        curr = datetime.date(y, m, 1)

    records = []
    rec_id = 100001

    centre_types = ["Government ITI", "PMKK Centre", "Private ITI Hub", "NSDC Training Partner"]
    feeds = ["NCS-SID Batch Sync", "MSDE PMKVY Portal Feed", "State Skill Mission Aggregator"]

    for d in districts:
        dist_name = d["district"]
        state_name = d["state"]
        w = d["weight"]

        for t in trades:
            base_d = t["base_d"] * w
            base_s = t["base_s"] * w
            trend = t["trend"]

            for idx, m_date in enumerate(months):
                progress = idx / len(months)
                season = np.sin(idx * 0.5) * 22
                noise = np.random.normal(0, 15)

                demand = max(10, int(base_d * (1 + trend * progress) + season + noise))
                seats = max(10, int(base_s * (1 + trend * 0.2 * progress) + np.random.normal(0, 8)))
                enrolled = max(5, int(seats * np.random.uniform(0.85, 0.98)))
                certified = max(5, int(enrolled * np.random.uniform(0.78, 0.94)))
                placed = max(2, int(certified * (0.85 if trend > 0.1 else 0.45 if trend < 0 else 0.65)))
                wage = int(16000 + (demand * 9) + np.random.normal(0, 800))
                employers = max(2, int(demand * 0.06 + np.random.normal(0, 2)))

                # Occasional realistic formatting noise
                fmt_dist = dist_name.upper() if idx % 17 == 0 else dist_name.lower() if idx % 23 == 0 else dist_name
                fmt_date = m_date.strftime("%Y/%m/%d") if idx % 11 == 0 else m_date.strftime("%Y-%m-%d")
                inspection = round(np.random.uniform(3.2, 4.9), 1) if idx % 9 != 0 else None

                records.append({
                    "record_id": f"SIH-REC-{rec_id}",
                    "reporting_period": fmt_date,
                    "state_name": state_name,
                    "district_name": fmt_dist,
                    "sector_name": t["sector"],
                    "trade_name": t["name"],
                    "job_count": demand,
                    "seat_count": seats,
                    "enrolled_trainees": enrolled,
                    "certified_trainees": certified,
                    "placed_trainees": placed,
                    "avg_reported_salary": wage,
                    "active_employers": employers,
                    "training_partner_id": f"TP-IN-{hash(dist_name)%899 + 100}",
                    "centre_type": random.choice(centre_types),
                    "inspection_rating": inspection,
                    "data_source_feed": random.choice(feeds)
                })
                rec_id += 1

    df = pd.DataFrame(records)

    # Save CSV
    csv_path = os.path.join(output_dir, "sih_official_dummy_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated Official SIH CSV: {csv_path} ({len(df)} rows, {len(df.columns)} columns)")

    # Save Excel (first 5000 rows sample for xlsx to keep it fast and light)
    xlsx_path = os.path.join(output_dir, "sih_official_dummy_dataset.xlsx")
    df.head(5000).to_excel(xlsx_path, index=False, sheet_name="MSDE_Evaluation_Data")
    print(f"Generated Official SIH Excel: {xlsx_path}")

    return csv_path, xlsx_path

if __name__ == "__main__":
    generate_sih_official_dataset()
