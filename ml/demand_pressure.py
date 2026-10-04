"""
KaushalPulse ML Module: Demand Pressure Index Calculation
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Formula Specification:
Demand Pressure Index (0 - 100) measures labour market tension and recruitment difficulty:
  Pressure = w_growth * Score(3M Growth) +
             w_emp * Score(Employer Hiring Activity) +
             w_persist * Score(Vacancy Duration) +
             w_ind * Score(Industrial Capex Signal) +
             w_vol * Score(Normalized Demand Volume)
"""

import numpy as np

def calculate_demand_pressure_index(
    current_demand: int,
    growth_rate_3m: float,
    growth_rate_12m: float,
    employer_count: int,
    industry_signal: float,
    wage_signal: int
) -> int:
    """
    Computes an empirical 0 - 100 Demand Pressure Index.
    """
    # 1. Growth Component (0 - 30 points)
    growth_score = np.clip((growth_rate_3m * 40.0) + (growth_rate_12m * 20.0), -10, 30)

    # 2. Employer Activity Intensity (0 - 25 points)
    emp_ratio = employer_count / (current_demand + 1.0)
    emp_score = np.clip(emp_ratio * 400.0, 0, 25)

    # 3. Industry / CAPEX Signal (0 - 20 points)
    ind_score = np.clip((industry_signal - 0.5) * 15.0, 0, 20)

    # 4. Wage Market Premium (0 - 15 points)
    wage_score = np.clip((wage_signal - 15000) / 1500.0, 0, 15)

    # 5. Volume Scale (0 - 10 points)
    vol_score = np.clip(np.log1p(current_demand) * 1.5, 0, 10)

    raw_pressure = 25.0 + growth_score + emp_score + ind_score + wage_score + vol_score
    final_pressure = int(np.clip(round(raw_pressure), 5, 98))
    return final_pressure
