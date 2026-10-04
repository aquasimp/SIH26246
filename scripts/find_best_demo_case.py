"""
Script: Automatically Find the Strongest Real Demo Case from SIH Dataset
Problem Statement: PS 26246 - MSDE
Ranks candidate (District x Trade) pairs based on econometric urgency, demand momentum,
supply deficit, and policy recommendation clarity.
"""

import sqlite3
import pandas as pd
import numpy as np

def find_best_demo_case(db_path="data/kaushal_pulse.db", table_name="sih_monthly_intelligence"):
    conn = sqlite3.connect(db_path)
    df = pd.read_sql(f"SELECT * FROM {table_name}", conn)
    conn.close()

    df["date"] = pd.to_datetime(df["date"])
    latest_date = df["date"].max()
    six_months_ago = latest_date - pd.DateOffset(months=6)

    candidates = []

    for (dist, nco), group in df.groupby(["district", "nco_code"]):
        group = group.sort_values("date")
        if len(group) < 24:
            continue

        latest_rec = group[group["date"] == latest_date].iloc[0]
        past_rec = group[group["date"] <= six_months_ago].iloc[-1]

        cur_demand = int(latest_rec["job_demand"])
        past_demand = int(past_rec["job_demand"])
        growth_6m = ((cur_demand - past_demand) / max(1, past_demand)) * 100

        cur_supply = int(latest_rec["available_supply"])
        seats = int(latest_rec["training_seats"])
        deficit = cur_demand - cur_supply
        
        # Calculate gap score (0-100 scale: 100 = acute shortage, 0 = acute oversupply, 50 = balanced)
        ratio = cur_demand / max(1, cur_supply)
        if ratio >= 2.5:
            gap_score = min(100, int(80 + (ratio - 2.5) * 10))
        elif ratio >= 1.2:
            gap_score = int(60 + (ratio - 1.2) * 15)
        elif ratio >= 0.8:
            gap_score = int(45 + (ratio - 0.8) * 35)
        else:
            gap_score = max(5, int(45 - (0.8 - ratio) * 40))

        confidence = float(latest_rec["confidence"])
        state = latest_rec["state"]
        occ = latest_rec["occupation"]

        # Composite Demo Priority Score:
        # High demand growth + large deficit + high gap score + high confidence
        demo_score = (
            (growth_6m * 1.5) + 
            (deficit * 0.1) + 
            (gap_score * 0.8) + 
            (confidence * 20)
        )

        candidates.append({
            "state": state,
            "district": dist,
            "occupation": occ,
            "nco_code": nco,
            "current_demand": cur_demand,
            "effective_supply": cur_supply,
            "training_seats": seats,
            "deficit": deficit,
            "gap_score": gap_score,
            "growth_6m": round(growth_6m, 1),
            "confidence": int(confidence * 100),
            "demo_score": round(demo_score, 1)
        })

    cand_df = pd.DataFrame(candidates).sort_values("demo_score", ascending=False).reset_index(drop=True)

    top = cand_df.iloc[0]

    # Generate recommended action based on deficit
    rec_seats = int(np.clip(round(top['deficit'] * 0.65, -1), 100, 800))
    action_text = f"Expand local training capacity by reallocating {rec_seats} PMKVY seats to {top['occupation']} in {top['district']}"

    output_summary = f"""
================================================================================
KAUSHALPULSE — RECOMMENDED REAL DEMO CASE (SIH EVALUATION DATASET)
================================================================================
Rank: 1 (Composite Score: {top['demo_score']})
State:             {top['state']}
District:          {top['district']}
Occupation:        {top['occupation']} (NCO: {top['nco_code']})
Current Demand:    {top['current_demand']} verified industry vacancies
Effective Supply:  {top['effective_supply']} available candidates ({top['training_seats']} sanctioned seats)
Net Deficit:       {top['deficit']} unmet job positions
Current Gap Score: {top['gap_score']} / 100 (Severe Shortage)
6-Month Growth:    +{top['growth_6m']}% demand acceleration
Data Confidence:   {top['confidence']}%
Recommended Action:{action_text}
================================================================================

Top 5 Candidates Evaluated:
"""
    for i, r in cand_df.head(5).iterrows():
        output_summary += f"{i+1}. {r['district']}, {r['state']} — {r['occupation']} | Demand: {r['current_demand']}, Supply: {r['effective_supply']}, Gap: {r['gap_score']}, Score: {r['demo_score']}\n"

    print(output_summary)

    with open("data/reports/recommended_demo_case.txt", "w", encoding="utf-8") as f:
        f.write(output_summary)

    return top.to_dict()

if __name__ == "__main__":
    find_best_demo_case()
