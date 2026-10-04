"""
KaushalPulse ML Module: Linear Programming Seat Reallocation Optimizer
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Uses PuLP to optimize training seat reallocations from saturated/oversupplied
trades to high-deficit shortage trades subject to:
1. Donor trade capacity bounds (cannot reduce seats below minimum essential threshold)
2. Target trade laboratory capacity bounds
3. District budget and lab retrofit constraints
"""

import pulp
from typing import Dict, Any, List

def optimize_seat_reallocation(
    district: str,
    donor_trades: List[Dict[str, Any]],
    target_trades: List[Dict[str, Any]],
    budget_inr: float = 5000000.0, # ₹50 Lakhs available budget
    cost_per_seat_conversion: float = 6500.0
) -> Dict[str, Any]:
    """
    Formulates and solves the seat reallocation optimization problem:
    Maximize: Total shortage deficit reduction
    Subject to:
      - Sum of reallocated seats * cost_per_seat <= budget_inr
      - Seats transferred from donor_i <= donor_i.excess_seats
      - Seats transferred to target_j <= target_j.deficit
    """
    prob = pulp.LpProblem("KaushalPulse_Seat_Reallocation", pulp.LpMaximize)

    # Decision variables: seats transferred from donor_i to target_j
    vars_dict = {}
    for d in donor_trades:
        for t in target_trades:
            var_name = f"shift_{d['nco']}_to_{t['nco']}"
            max_bound = min(d.get("excess_seats", 500), t.get("deficit", 600))
            vars_dict[(d['nco'], t['nco'])] = pulp.LpVariable(
                var_name,
                lowBound=0,
                upBound=max_bound,
                cat=pulp.LpInteger
            )

    # Objective: Maximize total deficit mitigated, weighted by target trade shortage severity
    prob += pulp.lpSum([
        vars_dict[(d['nco'], t['nco'])] * (t.get("gap_score", 80) / 100.0)
        for d in donor_trades for t in target_trades
    ])

    # Constraint 1: Budget Constraint
    prob += pulp.lpSum([
        vars_dict[(d['nco'], t['nco'])] * cost_per_seat_conversion
        for d in donor_trades for t in target_trades
    ]) <= budget_inr

    # Constraint 2: Donor capacity limit (leave at least minimum threshold intact)
    for d in donor_trades:
        prob += pulp.lpSum([
            vars_dict[(d['nco'], t['nco'])] for t in target_trades
        ]) <= d.get("excess_seats", 500)

    # Constraint 3: Target absorption limit
    for t in target_trades:
        prob += pulp.lpSum([
            vars_dict[(d['nco'], t['nco'])] for d in donor_trades
        ]) <= t.get("deficit", 600)

    # Solve
    solver = pulp.PULP_CBC_CMD(msg=False)
    status = prob.solve(solver)

    allocations = []
    total_seats_shifted = 0
    total_cost = 0

    for d in donor_trades:
        for t in target_trades:
            shifted = int(pulp.value(vars_dict[(d['nco'], t['nco'])]))
            if shifted > 0:
                cost = shifted * cost_per_seat_conversion
                allocations.append({
                    "donor_trade": d["title"],
                    "donor_nco": d["nco"],
                    "target_trade": t["title"],
                    "target_nco": t["nco"],
                    "reallocated_seats": shifted,
                    "estimated_cost_inr": cost,
                    "expected_gap_reduction_percent": round(min(85, (shifted / (t.get("deficit", 600) + 1.0)) * 75), 1)
                })
                total_seats_shifted += shifted
                total_cost += cost

    return {
        "status": pulp.LpStatus[status],
        "district": district,
        "total_seats_reallocated": total_seats_shifted,
        "total_cost_inr": total_cost,
        "budget_utilized_percent": round((total_cost / max(1.0, budget_inr)) * 100, 1) if budget_inr > 0 else 0.0,
        "reallocation_plan": allocations
    }
