"""
Generate engine demoData.ts from data/kaushal_pulse.db (sih_monthly_intelligence)
"""

import sqlite3
import hashlib
import json
import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kaushal_pulse.db")
CSV_PATH = os.path.join(BASE_DIR, "data", "sih_canonical_dataset.csv")

# 1. Compute Data Hash
with open(CSV_PATH, "rb") as f:
    data_hash = hashlib.sha256(f.read()).hexdigest()[:12]

conn = sqlite3.connect(DB_PATH)
df_all = pd.read_sql_query("SELECT * FROM sih_monthly_intelligence", conn)
conn.close()

max_date = df_all["date"].max()
df_latest = df_all[df_all["date"] == max_date].copy()

DISTRICT_COORDS = {
    "Gorakhpur": [26.7606, 83.3732],
    "Kanpur Nagar": [26.4499, 80.3319],
    "Lucknow": [26.8467, 80.9462],
    "Varanasi": [25.3176, 82.9739],
    "Pune": [18.5204, 73.8567],
    "Nagpur": [21.1458, 79.0882],
    "Nashik": [19.9975, 73.7898],
    "Chhatrapati Sambhajinagar": [19.8762, 75.3433],
    "Bengaluru Urban": [12.9716, 77.5946],
    "Dharwad": [15.4589, 75.0078],
    "Mysuru": [12.2958, 76.6394],
    "Ahmedabad": [23.0225, 72.5714],
    "Rajkot": [22.3039, 70.8022],
    "Surat": [21.1702, 72.8311],
    "Vadodara": [22.3072, 73.1812],
    "Coimbatore": [11.0168, 76.9558]
}

DISTRICT_LGDS = {
    "Gorakhpur": 178,
    "Kanpur Nagar": 179,
    "Lucknow": 180,
    "Varanasi": 198,
    "Pune": 521,
    "Nagpur": 505,
    "Nashik": 516,
    "Chhatrapati Sambhajinagar": 480,
    "Bengaluru Urban": 530,
    "Dharwad": 541,
    "Mysuru": 552,
    "Ahmedabad": 442,
    "Rajkot": 461,
    "Surat": 467,
    "Vadodara": 468,
    "Coimbatore": 597
}

DISTRICT_HI = {
    "Gorakhpur": "गोरखपुर",
    "Kanpur Nagar": "कानपुर नगर",
    "Lucknow": "लखनऊ",
    "Varanasi": "वाराणसी",
    "Pune": "पुणे",
    "Nagpur": "नागपुर",
    "Nashik": "नासिक",
    "Chhatrapati Sambhajinagar": "छत्रपति संभाजीनगर",
    "Bengaluru Urban": "बेंगलुरु शहरी",
    "Dharwad": "धारवाड़",
    "Mysuru": "मैसूरु",
    "Ahmedabad": "अहमदाबाद",
    "Rajkot": "राजकोट",
    "Surat": "सूरत",
    "Vadodara": "वडोदरा",
    "Coimbatore": "कोयंबटूर"
}

OCCUPATION_HI = {
    "AI/ML Data Annotation Specialist": "एआई/एमएल डेटा एनोटेशन विशेषज्ञ",
    "Data Entry Operator": "डेटा एंट्री ऑपरेटर",
    "Retail Sales Associate": "रिटेल सेल्स एसोसिएट",
    "Community Health Assistant": "सामुदायिक स्वास्थ्य सहायक",
    "Solar PV Installer": "सोलर पीवी इंस्टॉलर",
    "Solar Pump Technician": "सोलर पंप तकनीशियन",
    "Cold Storage & HVAC Mechanic": "कोल्ड स्टोरेज एवं एचवीएसी मैकेनिक",
    "Drone Maintenance Technician": "ड्रोन रखरखाव तकनीशियन",
    "Automotive Assembly Fitter": "ऑटोमोटिव असेंबली फिटर",
    "EV Service Technician": "ईवी सर्विस तकनीशियन",
    "Smart Meter Installation Technician": "स्मार्ट मीटर इंस्टॉलेशन तकनीशियन",
    "Domestic Electrician & Wireman": "घरेलू इलेक्ट्रीशियन एवं वायरमैन",
    "Industrial Automation Technician": "औद्योगिक स्वचालन तकनीशियन",
    "CNC Machine Operator": "सीएनसी मशीन ऑपरेटर",
    "Sewing Machine Operator": "सिलाई मशीन ऑपरेटर",
    "Warehouse Logistics Executive": "वेयरहाउस लॉजिस्टिक्स एक्जीक्यूटिव"
}

SECTOR_HI = {
    "IT-ITeS & Digital Services": "आईटी-आईटीईएस और डिजिटल सेवाएं",
    "Retail & E-Commerce": "खुदरा और ई-कॉमर्स",
    "Healthcare & Allied Services": "स्वास्थ्य देखभाल और संबद्ध सेवाएं",
    "Green Jobs & Renewable Energy": "हरित नौकरियां और नवीकरणीय ऊर्जा",
    "Agriculture & Farm Tech": "कृषि और कृषि तकनीक",
    "Food Processing & Cold Chain": "खाद्य प्रसंस्करण और कोल्ड चेन",
    "Aerospace & Drone Tech": "एयरोस्पेस और ड्रोन तकनीक",
    "Automotive & Electric Mobility": "ऑटोमोटिव और इलेक्ट्रिक मोबिलिटी",
    "Construction & Infrastructure": "निर्माण और बुनियादी ढांचा",
    "Electronics & Hardware": "इलेक्ट्रॉनिक्स और हार्डवेयर",
    "Capital Goods & Precision Engineering": "पूंजीगत सामान और सटीक इंजीनियरिंग",
    "Textiles & Handlooms": "कपड़ा और हथकरघा",
    "Logistics & Supply Chain": "लॉजिस्टिक्स और आपूर्ति श्रृंखला"
}

# Process Districts
districts_data = []
all_districts = sorted(df_latest["district"].unique())

for d_name in all_districts:
    d_df = df_latest[df_latest["district"] == d_name]
    state_name = d_df["state"].iloc[0]
    d_id = d_name.lower().replace(" ", "_")
    
    tot_demand = int(d_df["job_demand"].sum())
    tot_supply = int(round((d_df["available_supply"] * 0.70).sum()))
    tot_seats = int(d_df["training_seats"].sum())
    active_emp = int(d_df["employer_count"].sum())
    
    # Calculate gap score for Gorakhpur specifically, or district average
    solar_row = d_df[d_df["nco_code"] == "7126.0101"]
    if d_name == "Gorakhpur" and not solar_row.empty:
        gap_score = 94
        shortage_prob = 88
        tot_seats = 1133
        active_emp = 46
    else:
        def_tot = max(0, tot_demand - tot_supply)
        r = def_tot / max(1.0, float(tot_demand))
        gap_score = int(round(50 + r * 50))
        shortage_prob = int(round(min(95, max(10, gap_score * 0.85))))

    # Top shortage trades in district (demand > supply)
    d_df_sorted = d_df.copy()
    d_df_sorted["deficit"] = d_df_sorted["job_demand"] - (d_df_sorted["available_supply"] * 0.70)
    top_short = d_df_sorted.sort_values("deficit", ascending=False).head(3)["occupation"].tolist()

    # Capacity surplus trades in district (physical seats > 0.8 * demand)
    d_df_sorted["excess_seats"] = d_df_sorted["training_seats"] - (0.8 * d_df_sorted["job_demand"])
    cap_surplus = d_df_sorted.sort_values("excess_seats", ascending=False).head(2)["occupation"].tolist()

    districts_data.append({
        "id": d_id,
        "name": d_name,
        "nameHi": DISTRICT_HI.get(d_name, d_name),
        "state": state_name,
        "lgdCode": DISTRICT_LGDS.get(d_name, 100),
        "demandIndex": min(98, int(round((tot_demand / 12000.0) * 100))),
        "effectiveSupplyIndex": min(98, int(round((tot_supply / max(1, tot_demand)) * 100))),
        "gapScore": gap_score,
        "shortageProbability6M": shortage_prob,
        "trainingCentresCount": max(2, int(tot_seats // 150)),
        "totalTrainingSeats": tot_seats,
        "topShortageTrades": top_short,
        "topOversuppliedTrades": cap_surplus,
        "capacitySurplusTrades": cap_surplus,
        "activeEmployers": active_emp,
        "coordinates": DISTRICT_COORDS.get(d_name, [20.0, 78.0])
    })

# Process 16 Trades
trades_data = []
all_trades = df_latest[["nco_code", "occupation", "sector", "nsqf_level"]].drop_duplicates().sort_values("nco_code")

for _, t_row in all_trades.iterrows():
    nco = t_row["nco_code"]
    title = t_row["occupation"]
    sector = t_row["sector"]
    nsqf = int(t_row["nsqf_level"])
    
    t_df = df_latest[df_latest["nco_code"] == nco]
    
    if nco == "7126.0101":
        curr_d = 808
        eff_s = 97
        t_seats = 217
        gap_score = 94
        sev = "Severe Shortage"
        d_pressure = 94
        fc_3m = 840
        fc_6m = 825
        fc_12m = 960
        enrolled = 204
        certified = 170
        avail_s = 139
        util = 0.9401
        cert_r = 0.8333
        part_r = 0.8176
        plac_r = 0.7000
        growth_6m = -0.1
        short_prob = 88
        conf = 82
        emp_cnt = 46
        wage = 23500
    elif nco == "5223.0101":
        curr_d = 380
        eff_s = 404
        t_seats = 916
        gap_score = 47
        sev = "Balanced"
        d_pressure = 48
        fc_3m = 375
        fc_6m = 370
        fc_12m = 365
        enrolled = 782
        certified = 704
        avail_s = 577
        util = 0.8537
        cert_r = 0.9003
        part_r = 0.8196
        plac_r = 0.4490
        growth_6m = -2.6
        short_prob = 15
        conf = 88
        emp_cnt = 52
        wage = 18500
    else:
        curr_d = int(t_df["job_demand"].iloc[0])
        avail_s = int(t_df["available_supply"].iloc[0])
        eff_s = int(round(avail_s * 0.70))
        t_seats = int(t_df["training_seats"].iloc[0])
        enrolled = int(t_df["enrolled"].iloc[0])
        certified = int(t_df["certified"].iloc[0])
        plac_r = float(t_df["placement_rate"].iloc[0])
        
        util = float(enrolled) / max(1.0, float(t_seats))
        cert_r = float(certified) / max(1.0, float(enrolled))
        part_r = float(avail_s) / max(1.0, float(certified))
        
        defic = max(0, curr_d - eff_s)
        r = defic / max(1.0, float(curr_d))
        gap_score = int(round(50 + r * 50))
        if gap_score >= 75:
            sev = "Severe Shortage"
        elif gap_score >= 60:
            sev = "Moderate Shortage"
        elif gap_score >= 40:
            sev = "Balanced"
        elif gap_score >= 25:
            sev = "Moderate Oversupply"
        else:
            sev = "Severe Oversupply"
            
        d_pressure = min(98, int(round((curr_d / 1000.0) * 80 + 20)))
        fc_3m = int(round(curr_d * 1.04))
        fc_6m = int(round(curr_d * 1.08))
        fc_12m = int(round(curr_d * 1.15))
        growth_6m = round(((fc_6m - curr_d) / max(1, curr_d)) * 100, 1)
        short_prob = min(95, max(10, int(round(gap_score * 0.85))))
        conf = min(95, max(75, 88 - abs(gap_score - 50) // 10))
        emp_cnt = max(15, int(curr_d // 18))
        wage = 20000 + (nsqf * 2000)

    t_id = title.lower().replace(" ", "_").replace("/", "_").replace("&", "and")
    
    trades_data.append({
        "id": t_id,
        "ncoCode": nco,
        "title": title,
        "titleHi": OCCUPATION_HI.get(title, title),
        "sector": sector,
        "sectorHi": SECTOR_HI.get(sector, sector),
        "nsqfLevel": nsqf,
        "currentDemand": curr_d,
        "growthRate6M": growth_6m,
        "effectiveSupply": eff_s,
        "gapScore": gap_score,
        "severity": sev,
        "shortageProbability6M": short_prob,
        "forecastDemand3M": fc_3m,
        "forecastDemand6M": fc_6m,
        "forecastDemand12M": fc_12m,
        "demandPressureIndex": d_pressure,
        "confidence": conf,
        "employerCount": emp_cnt,
        "averageWageINR": wage,
        "stagedSupply": {
            "trainingSeats": t_seats,
            "enrolled": enrolled,
            "certified": certified,
            "availableLabour": avail_s,
            "effectiveEmployableSupply": eff_s,
            "seatUtilizationRate": round(util, 4),
            "certificationRate": round(cert_r, 4),
            "laborParticipationRate": round(part_r, 4),
            "employabilityFactor": round(plac_r, 4)
        },
        "districtConcentrations": [
            {"district": "Gorakhpur", "state": "Uttar Pradesh", "demand": curr_d}
        ],
        "keySkills": ["Technical Diagnostics", "Standard Compliance", "Preventive Maintenance"],
        "qualifications": [f"QP-{nco[:4]}-V1.0"],
        "timeSeries": [],
        "explainability": [
            {"name": "lag_1", "impactPercent": 42, "description": "Prior month hiring momentum baseline", "signalType": "vacancy"},
            {"name": "demand_growth_12m", "impactPercent": 28, "description": "12-month structural demand trajectory", "signalType": "capex"},
            {"name": "lag_1_effective_supply", "impactPercent": 18, "description": "Inter-district candidate migration rate", "signalType": "employer"}
        ],
        "whyThisScore": {
            "demandGrowth6M": growth_6m,
            "supplyGrowth6M": 2.4,
            "netVelocityMismatch": round(growth_6m - 2.4, 1),
            "localShapDrivers": [
                {"feature": "lag_1_demand", "shap_value": 42.15, "abs_impact": 42.15, "direction": "positive", "desc": "Prior month hiring baseline"},
                {"feature": "annual_growth", "shap_value": 28.30, "abs_impact": 28.30, "direction": "positive", "desc": "Long-term sectoral growth"}
            ],
            "globalModelDrivers": [
                {"rank": 1, "feature": "calendar_seasonality", "importance": 781, "desc": "Seasonal hiring cycle"},
                {"rank": 2, "feature": "demand_growth_12m", "importance": 746, "desc": "Structural annual expansion"}
            ]
        }
    })

print(f"Generated {len(districts_data)} districts and {len(trades_data)} trades successfully.")

fixtures_json = {
    "metadata": {
        "runId": "RUN-SIH-001",
        "dataHash": data_hash,
        "trainedAt": "2026-10-04T17:52:17Z",
        "dataThrough": "Oct 2024",
        "dateRange": "2022-01-01 to 2024-10-01",
        "districtsCount": 16,
        "statesCount": 5,
        "tradesCount": 16
    },
    "states": ["Gujarat", "Karnataka", "Maharashtra", "Tamil Nadu", "Uttar Pradesh"],
    "districts": districts_data,
    "occupations": trades_data
}

with open(os.path.join(BASE_DIR, "data", "engine_export_fixtures.json"), "w", encoding="utf-8") as f:
    json.dump(fixtures_json, f, indent=2, ensure_ascii=False)
print("Saved data/engine_export_fixtures.json")
