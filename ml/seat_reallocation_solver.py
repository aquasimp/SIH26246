"""
KaushalPulse ML Module: Linear Programming Seat Reallocation Optimizer
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246 (PS 26242)

Uses PuLP to optimize training seat reallocations from saturated/oversupplied
trades to high-deficit shortage trades subject to:
1. Donor trade capacity bounds & LP Donor Safety Constraint:
   Default rule: post-transfer gap ratio <= 0.05 (strict).
   Selectable settings: 0.10 (moderate) and 0.18 / 0.1895 (permissive, score <= 59).
   Transfer is automatically shrunk if it would violate this constraint.
2. Target trade laboratory absorption bounds.
3. District budget and lab retrofit constraints (e.g. ₹6,500/seat).
"""

import math
import pulp
from typing import Dict, Any, List
from ml.gap_engine import calculate_gap_score_and_severity, classify_band

def optimize_seat_reallocation(
    district: str,
    donor_trades: List[Dict[str, Any]],
    target_trades: List[Dict[str, Any]],
    budget_inr: float = 5000000.0, # ₹50 Lakhs available budget
    cost_per_seat_conversion: float = 6500.0,
    donor_safety_rule: float = 0.05 # Default: post-transfer gap ratio <= 0.05. Selectable: 0.05, 0.10, 0.18
) -> Dict[str, Any]:
    """
    Formulates and solves the seat reallocation optimization problem:
    Maximize: Total shortage deficit reduction
    Subject to:
      - Sum of reallocated seats * cost_per_seat <= budget_inr
      - Seats transferred from donor_i <= donor_i.max_safe_transfer (LP donor safety constraint: post-transfer gap ratio <= donor_safety_rule)
      - Seats transferred to target_j <= target_j.deficit
    """
    prob = pulp.LpProblem("KaushalPulse_Seat_Reallocation", pulp.LpMaximize)

    # 1. Precompute Donor Safety Limits (LP Hardening Requirement)
    donor_limits = {}
    for d in donor_trades:
        d_demand = float(d.get("demand", 380))
        d_supply = float(d.get("effective_supply", d.get("supply", 404)))
        d_seats = int(d.get("seats", 916))
        d_eta_cum = float(d.get("funnel_throughput", 0.4409))
        requested_excess = int(d.get("excess_seats", 500))

        # Donor Safety Rule:
        # Default: post-transfer gap ratio <= 0.05 (Strict)
        # Selectable settings: 0.10 (Moderate), 0.18 / 0.1895 (Permissive)
        max_seats_safe = 0
        for s in range(requested_excess, -1, -1):
            s_post = d_supply - (s * d_eta_cum)
            def_cand = max(0.0, d_demand - s_post)
            ratio_cand = def_cand / max(1.0, d_demand)
            score_cand, sev_cand, _ = calculate_gap_score_and_severity(int(d_demand), int(round(s_post)))
            
            if donor_safety_rule >= 0.189:
                # Permissive legacy bound: gap score <= 59 (Balanced)
                if score_cand <= 59 and "Shortage" not in sev_cand:
                    max_seats_safe = s
                    break
            else:
                if ratio_cand <= (donor_safety_rule + 1e-4) and score_cand <= 59 and "Shortage" not in sev_cand:
                    max_seats_safe = s
                    break

        actual_bound = max(0, min(requested_excess, max_seats_safe))
        was_shrunk = requested_excess > actual_bound

        donor_limits[d["nco"]] = {
            "requested_excess": requested_excess,
            "max_seats_safe": max_seats_safe,
            "actual_bound": actual_bound,
            "was_shrunk": was_shrunk,
            "demand": int(d_demand),
            "supply_0": int(round(d_supply)),
            "seats_0": d_seats,
            "eta_cum": d_eta_cum,
            "donor_safety_rule": donor_safety_rule,
            "shrink_reason": (
                f"LP donor safety constraint active (post-transfer gap ratio <= {donor_safety_rule:.2f}): "
                f"transfer shrunk from {requested_excess} to {actual_bound} "
                f"to prevent donor trade from entering excessive deficit"
                if was_shrunk else "Transfer fully within safe non-depletion boundary"
            )
        }

    # Decision variables: seats transferred from donor_i to target_j
    vars_dict = {}
    for d in donor_trades:
        d_nco = d["nco"]
        d_bound = donor_limits[d_nco]["actual_bound"]
        for t in target_trades:
            t_nco = t["nco"]
            var_name = f"shift_{d_nco}_to_{t_nco}".replace(".", "_")
            max_bound = min(d_bound, int(t.get("deficit", 600)))
            vars_dict[(d_nco, t_nco)] = pulp.LpVariable(
                var_name,
                lowBound=0,
                upBound=max_bound,
                cat=pulp.LpInteger
            )

    # Objective: Maximize total deficit mitigated, weighted by target trade shortage severity
    prob += pulp.lpSum([
        vars_dict[(d["nco"], t["nco"])] * (t.get("gap_score", 80) / 100.0)
        for d in donor_trades for t in target_trades
    ])

    # Constraint 1: Budget Constraint
    prob += pulp.lpSum([
        vars_dict[(d["nco"], t["nco"])] * cost_per_seat_conversion
        for d in donor_trades for t in target_trades
    ]) <= budget_inr

    # Constraint 2: Donor Safety Bound
    for d in donor_trades:
        d_nco = d["nco"]
        prob += pulp.lpSum([
            vars_dict[(d_nco, t["nco"])] for t in target_trades
        ]) <= donor_limits[d_nco]["actual_bound"]

    # Constraint 3: Target absorption limit
    for t in target_trades:
        t_nco = t["nco"]
        prob += pulp.lpSum([
            vars_dict[(d["nco"], t_nco)] for d in donor_trades
        ]) <= int(t.get("deficit", 600))

    # Solve
    solver = pulp.PULP_CBC_CMD(msg=False)
    status = prob.solve(solver)

    allocations = []
    total_seats_shifted = 0
    total_cost = 0

    donor_after_profiles = {}
    target_after_profiles = {}

    for d in donor_trades:
        d_nco = d["nco"]
        d_info = donor_limits[d_nco]
        shifted_from_d = 0

        for t in target_trades:
            t_nco = t["nco"]
            shifted = int(pulp.value(vars_dict[(d_nco, t_nco)])) if (d_nco, t_nco) in vars_dict else 0
            if shifted > 0:
                cost = shifted * cost_per_seat_conversion
                allocations.append({
                    "donor_trade": d["title"],
                    "donor_nco": d_nco,
                    "target_trade": t["title"],
                    "target_nco": t_nco,
                    "seats_reallocated": shifted,
                    "conversion_cost_inr": cost,
                    "cost_per_seat": cost_per_seat_conversion
                })
                shifted_from_d += shifted
                total_seats_shifted += shifted
                total_cost += cost

        d_s0 = d_info["supply_0"]
        d_dem = d_info["demand"]
        d_seats = d_info["seats_0"]
        d_loss = int(round(shifted_from_d * d_info["eta_cum"]))
        d_s1 = d_s0 - d_loss
        d_score0, d_sev0, _ = calculate_gap_score_and_severity(d_dem, d_s0)
        d_score1, d_sev1, _ = calculate_gap_score_and_severity(d_dem, d_s1)
        d_def1 = max(0, d_dem - d_s1)
        d_ratio1 = round(d_def1 / max(1.0, float(d_dem)), 4)

        donor_after_profiles[d_nco] = {
            "title": d["title"],
            "nco": d_nco,
            "seats_before": d_seats,
            "seats_after": d_seats - shifted_from_d,
            "demand": d_dem,
            "supply_before": d_s0,
            "supply_after": d_s1,
            "deficit_before": max(0, d_dem - d_s0),
            "deficit_after": d_def1,
            "gap_ratio_after": d_ratio1,
            "gap_score_before": d_score0,
            "gap_score_after": d_score1,
            "severity_before": d_sev0,
            "severity_after": d_sev1,
            "was_shrunk": d_info["was_shrunk"],
            "requested_excess": d_info["requested_excess"],
            "actual_bound": d_info["actual_bound"],
            "shrink_reason": d_info["shrink_reason"]
        }

    for t in target_trades:
        t_nco = t["nco"]
        t_dem = int(t.get("demand", 808))
        t_s0 = int(t.get("effective_supply", t.get("supply", 97)))
        t_seats = int(t.get("seats", 217))
        t_eta_cum = float(t.get("funnel_throughput", 0.4480))

        shifted_to_t = sum(
            int(pulp.value(vars_dict[(d["nco"], t_nco)]))
            for d in donor_trades if (d["nco"], t_nco) in vars_dict
        )

        t_s1 = t_s0 + int(round(shifted_to_t * t_eta_cum * 1.10))
        t_score0, t_sev0, _ = calculate_gap_score_and_severity(t_dem, t_s0)
        t_score1, t_sev1, _ = calculate_gap_score_and_severity(t_dem, t_s1)
        init_def = max(0, t_dem - t_s0)
        post_def = max(0, t_dem - t_s1)
        red_pct = round(((init_def - post_def) / max(1, init_def)) * 100, 1)

        target_after_profiles[t_nco] = {
            "title": t["title"],
            "nco": t_nco,
            "seats_before": t_seats,
            "seats_after": t_seats + shifted_to_t,
            "demand": t_dem,
            "supply_before": t_s0,
            "supply_after": t_s1,
            "deficit_before": init_def,
            "deficit_after": post_def,
            "gap_score_before": t_score0,
            "gap_score_after": t_score1,
            "severity_before": t_sev0,
            "severity_after": t_sev1,
            "deficit_reduction_percent": red_pct
        }

    # 3-setting sensitivity table for all three options (0.05, 0.10, 0.18 / permissive)
    sensitivity_table = []
    if donor_trades and target_trades:
        d_first = donor_trades[0]
        t_first = target_trades[0]
        d_dem = float(d_first.get("demand", 380))
        d_sup = float(d_first.get("effective_supply", d_first.get("supply", 404)))
        d_eta = float(d_first.get("funnel_throughput", 0.4409))
        t_dem = float(t_first.get("demand", 808))
        t_sup = float(t_first.get("effective_supply", t_first.get("supply", 97)))
        t_eta = float(t_first.get("funnel_throughput", 0.4484))
        t_def0 = max(1.0, t_dem - t_sup)

        for rule, label in [
            (0.05, "Strict (<= 0.05 ratio)"),
            (0.10, "Moderate (<= 0.10 ratio)"),
            (0.1895, "Permissive (Score <= 59)")
        ]:
            s_cand_max = 0
            for s in range(500, -1, -1):
                s_post = d_sup - (s * d_eta)
                def_cand = max(0.0, d_dem - s_post)
                ratio_cand = def_cand / max(1.0, d_dem)
                sc_cand, _, _ = calculate_gap_score_and_severity(int(d_dem), int(round(s_post)))
                if rule >= 0.189:
                    if sc_cand <= 59:
                        s_cand_max = s
                        break
                else:
                    if ratio_cand <= rule + 1e-4 and sc_cand <= 59:
                        s_cand_max = s
                        break
            
            # Donor score
            d_p = d_sup - round(s_cand_max * d_eta)
            sc_d, _, _ = calculate_gap_score_and_severity(int(d_dem), int(round(d_p)))
            
            # Target post realloc alone (0% mobility)
            t_p_realloc = t_sup + round(s_cand_max * t_eta)
            sc_t_realloc, _, _ = calculate_gap_score_and_severity(int(t_dem), int(round(t_p_realloc)))
            pct_realloc = round(max(0.0, (t_p_realloc - t_sup) / t_def0 * 100.0), 1)

            # Target post combo (+150 greenfield lab, 0% mobility)
            t_p_combo_no_mob = t_sup + round((s_cand_max + 150) * t_eta)
            sc_t_combo_no_mob, _, _ = calculate_gap_score_and_severity(int(t_dem), int(round(t_p_combo_no_mob)))
            pct_combo_no_mob = round(max(0.0, (t_p_combo_no_mob - t_sup) / t_def0 * 100.0), 1)

            # Target post combo (+150 greenfield lab, +10% mobility)
            t_p_combo_mob = t_sup + round((s_cand_max + 150) * t_eta * 1.10)
            sc_t_combo_mob, _, _ = calculate_gap_score_and_severity(int(t_dem), int(round(t_p_combo_mob)))
            pct_combo_mob = round(max(0.0, (t_p_combo_mob - t_sup) / t_def0 * 100.0), 1)

            # Cost assumption: ₹6,500/seat retrofit + ₹12 Lakhs lab capex
            cost_total = round((s_cand_max * cost_per_seat_conversion + 1200000.0) / 100000.0, 2)
            d_def_cand = max(0, int(d_dem - d_p))
            d_ratio_cand = round(d_def_cand / max(1.0, float(d_dem)), 4)

            sensitivity_table.append({
                "rule": rule,
                "label": label,
                "seats_moved": s_cand_max,
                "donor_score": sc_d,
                "donor_deficit": d_def_cand,
                "donor_gap_ratio": d_ratio_cand,
                "target_score_realloc": sc_t_realloc,
                "deficit_closed_realloc_pct": pct_realloc,
                "target_score_combo_no_mobility": sc_t_combo_no_mob,
                "deficit_closed_combo_no_mobility_pct": pct_combo_no_mob,
                "target_score_combo": sc_t_combo_mob,
                "deficit_closed_combo_pct": pct_combo_mob,
                "total_cost_lakhs": cost_total
            })

    return {
        "status": pulp.LpStatus[status],
        "district": district,
        "total_seats_reallocated": total_seats_shifted,
        "total_cost_inr": total_cost,
        "budget_utilized_percent": round((total_cost / max(1.0, budget_inr)) * 100, 1) if budget_inr > 0 else 0.0,
        "reallocation_plan": allocations,
        "donor_profiles": donor_after_profiles,
        "target_profiles": target_after_profiles,
        "sensitivity_table": sensitivity_table
    }
