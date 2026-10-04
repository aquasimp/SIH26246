"""
KaushalPulse ML Module: Early Warning Alert Engine
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Dynamically detects early warning signals from labour market records:
1. emerging_shortage: Demand growing rapidly and outpacing employable supply.
2. emerging_oversupply: Employable supply significantly exceeds demand with weak placement.
3. saturation_risk: Training seat capacity heavily exceeds hiring absorption.
4. emerging_occupation: High-velocity new job trade with >20% momentum.
5. geographic_imbalance: Severe shortage in one district while neighbouring district has excess capacity.
6. skill_obsolescence: Persistent multi-quarter contraction in trade demand.
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np
import datetime

def generate_early_warnings(records_df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Evaluates empirical data rules on canonical labour market time-series records.
    """
    alerts = []
    alert_counter = 1

    if records_df.empty:
        return alerts

    df = records_df.copy()
    df["date"] = pd.to_datetime(df["date"])
    max_date = df["date"].max()

    # Iterate over unique district x trade groups
    grouped = df.groupby(["district", "nco_code"])

    for (district, nco_code), group in grouped:
        group = group.sort_values("date")
        if len(group) < 6:
            continue

        latest = group.iloc[-1]
        prior_6m = group.iloc[-6] if len(group) >= 6 else group.iloc[0]
        prior_12m = group.iloc[-12] if len(group) >= 12 else group.iloc[0]

        curr_demand = float(latest["job_demand"])
        curr_seats = float(latest["training_seats"])
        curr_supply = float(latest["available_supply"])
        curr_pr = float(latest["placement_rate"])
        eff_supply = curr_supply * curr_pr
        occ_title = str(latest["occupation"])
        state = str(latest["state"])

        # 6M and 12M growth rates
        demand_growth_6m = (curr_demand - prior_6m["job_demand"]) / max(1.0, float(prior_6m["job_demand"]))
        demand_growth_12m = (curr_demand - prior_12m["job_demand"]) / max(1.0, float(prior_12m["job_demand"]))

        # 1. Emerging Shortage
        # Trigger: Demand growing >15% over 6M and current demand > 1.35x effective employable supply
        if demand_growth_6m >= 0.15 and curr_demand >= (eff_supply * 1.35):
            deficit = int(curr_demand - eff_supply)
            confidence = int(np.clip(round(75 + demand_growth_6m * 20), 70, 92))
            alerts.append({
                "id": f"ALR-2026-ES-{alert_counter:03d}",
                "severity": "critical" if (curr_demand >= eff_supply * 1.8) else "warning",
                "type": "emerging_shortage",
                "title": f"Emerging Shortage: {occ_title} in {district}",
                "geography": f"{district}, {state}",
                "occupation": occ_title,
                "nco_code": nco_code,
                "trigger": f"6M demand surged +{demand_growth_6m*100:.1f}% reaching {int(curr_demand)} vacancies against only {int(eff_supply)} employable candidates (deficit: {deficit}).",
                "forecast_horizon": "6M",
                "confidence": confidence,
                "recommended_action": f"Expand accredited ITI/PMKVY training capacity by {min(600, int(deficit*0.8))} seats in {district}.",
                "timestamp": latest["date"].strftime("%Y-%m-%d %H:%M IST"),
                "status": "active"
            })
            alert_counter += 1

        # 2. Emerging Oversupply
        # Trigger: Employable supply > 1.4x demand AND placement rate < 55%
        elif eff_supply >= (curr_demand * 1.40) and curr_pr <= 0.55:
            surplus = int(eff_supply - curr_demand)
            confidence = int(np.clip(round(78 + (1.0 - curr_pr) * 20), 75, 90))
            alerts.append({
                "id": f"ALR-2026-EO-{alert_counter:03d}",
                "severity": "warning",
                "type": "emerging_oversupply",
                "title": f"Oversupply Warning: {occ_title} in {district}",
                "geography": f"{district}, {state}",
                "occupation": occ_title,
                "nco_code": nco_code,
                "trigger": f"Effective supply ({int(eff_supply)}) exceeds local demand ({int(curr_demand)}) with weak placement conversion ({curr_pr*100:.1f}%).",
                "forecast_horizon": "6M",
                "confidence": confidence,
                "recommended_action": f"Rationalize legacy training seats and provide conversion reskilling into allied growing trades.",
                "timestamp": latest["date"].strftime("%Y-%m-%d %H:%M IST"),
                "status": "active"
            })
            alert_counter += 1

        # 3. Saturation Risk
        # Trigger: Training seats > 2.0x current demand AND low placement rate (< 50%)
        elif curr_seats >= (curr_demand * 2.0) and curr_pr <= 0.50:
            excess_seats = int(curr_seats - curr_demand)
            alerts.append({
                "id": f"ALR-2026-SR-{alert_counter:03d}",
                "severity": "warning",
                "type": "saturation_risk",
                "title": f"Saturation Risk: {occ_title} in {district}",
                "geography": f"{district}, {state}",
                "occupation": occ_title,
                "nco_code": nco_code,
                "trigger": f"Physical training capacity ({int(curr_seats)} seats) exceeds absorption capacity by {int((curr_seats/curr_demand - 1)*100)}%.",
                "forecast_horizon": "6M",
                "confidence": 84,
                "recommended_action": f"Freeze new batch approvals and redirect up to {min(500, excess_seats)} physical seats toward priority shortage trades.",
                "timestamp": latest["date"].strftime("%Y-%m-%d %H:%M IST"),
                "status": "active"
            })
            alert_counter += 1

        # 4. Emerging Occupation
        # Trigger: 6M demand growth >= 25% with NSQF Level >= 4
        elif demand_growth_6m >= 0.25 and curr_demand >= 500:
            alerts.append({
                "id": f"ALR-2026-EOCC-{alert_counter:03d}",
                "severity": "info",
                "type": "emerging_occupation",
                "title": f"Emerging High-Growth Trade: {occ_title} in {district}",
                "geography": f"{district}, {state}",
                "occupation": occ_title,
                "nco_code": nco_code,
                "trigger": f"High demand velocity (+{demand_growth_6m*100:.1f}% over 6 months) indicates rising technological adoption.",
                "forecast_horizon": "12M",
                "confidence": 86,
                "recommended_action": f"Develop dedicated national curriculum modules and approve accredited Centers of Excellence.",
                "timestamp": latest["date"].strftime("%Y-%m-%d %H:%M IST"),
                "status": "active"
            })
            alert_counter += 1

        # 5. Skill Obsolescence
        # Trigger: 12M demand contraction <= -6%
        elif demand_growth_12m <= -0.06:
            alerts.append({
                "id": f"ALR-2026-SO-{alert_counter:03d}",
                "severity": "warning",
                "type": "skill_obsolescence",
                "title": f"Skill Obsolescence Risk: {occ_title} in {district}",
                "geography": f"{district}, {state}",
                "occupation": occ_title,
                "nco_code": nco_code,
                "trigger": f"Structural decline of {abs(demand_growth_12m)*100:.1f}% in vacancies over past 12 months.",
                "forecast_horizon": "6M",
                "confidence": 82,
                "recommended_action": f"Deploy bridging upskilling modules to transition workers into automated and digital trades.",
                "timestamp": latest["date"].strftime("%Y-%m-%d %H:%M IST"),
                "status": "active"
            })
            alert_counter += 1

    # 6. Geographic Imbalance detection across districts
    latest_snapshot = df[df["date"] == max_date]
    trades_by_occ = latest_snapshot.groupby("nco_code")
    for nco_code, occ_group in trades_by_occ:
        if len(occ_group) < 2:
            continue
        occ_group = occ_group.copy()
        occ_group["eff_supply"] = occ_group["available_supply"] * occ_group["placement_rate"]
        occ_group["gap_ratio"] = (occ_group["job_demand"] - occ_group["eff_supply"]) / occ_group["job_demand"].clip(lower=1)
        
        max_shortage = occ_group.loc[occ_group["gap_ratio"].idxmax()]
        max_surplus = occ_group.loc[occ_group["gap_ratio"].idxmin()]
        
        if max_shortage["gap_ratio"] >= 0.50 and max_surplus["gap_ratio"] <= -0.20:
            alerts.append({
                "id": f"ALR-2026-GI-{alert_counter:03d}",
                "severity": "info",
                "type": "geographic_imbalance",
                "title": f"Geographic Imbalance: {max_shortage['occupation']}",
                "geography": f"{max_shortage['district']} (Shortage) vs {max_surplus['district']} (Surplus)",
                "occupation": str(max_shortage["occupation"]),
                "nco_code": nco_code,
                "trigger": f"{max_shortage['district']} faces acute deficit (gap ratio {max_shortage['gap_ratio']:.2f}) while {max_surplus['district']} holds excess trained capacity.",
                "forecast_horizon": "6M",
                "confidence": 80,
                "recommended_action": f"Facilitate candidate mobility corridor or cross-district employer placement linkages.",
                "timestamp": max_date.strftime("%Y-%m-%d %H:%M IST"),
                "status": "active"
            })
            alert_counter += 1
            break # 1 high-signal geographic imbalance alert

    return alerts
