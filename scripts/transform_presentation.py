import os
import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN

SRC_PPT = r"C:\Users\anura\Downloads\legacycoderzzzzzzzz.pptx"
OUT_DIR = r"C:\Users\anura\Downloads\sih2026"
OUT_PPT_MAIN = os.path.join(OUT_DIR, "LegacyCoderzSIH2026.pptx")
OUT_PPT_NAMED = os.path.join(OUT_DIR, "LegacyCoderz_PS26246_KaushalYuva.pptx")
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

def ensure_charts():
    chart1 = os.path.join(SCRIPTS_DIR, "chart_wape.png")
    chart2 = os.path.join(SCRIPTS_DIR, "chart_accuracy.png")
    if not (os.path.exists(chart1) and os.path.exists(chart2)):
        import generate_charts_pil
        # already executed or can import
    return chart1, chart2

def set_text(shape, text, font_size=None, bold=None, color=None, font_name="Segoe UI", align=None):
    tf = shape.text_frame
    tf.word_wrap = True
    old_size = None
    old_bold = None
    old_color = None
    if tf.paragraphs and tf.paragraphs[0].runs:
        r0 = tf.paragraphs[0].runs[0]
        old_size = r0.font.size
        old_bold = r0.font.bold
        if r0.font.color and r0.font.color.type == 1:
            old_color = r0.font.color.rgb

    tf.text = ""
    lines = text.split("\n")
    for idx, line in enumerate(lines):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.space_after = Pt(2)
        if align:
            p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = font_size or old_size or Pt(10.5)
        run.font.bold = bold if bold is not None else (old_bold if old_bold is not None else False)
        if color:
            run.font.color.rgb = color
        elif old_color:
            run.font.color.rgb = old_color

def set_prefix_text(shape, prefix, rest, font_size=None, font_name="Segoe UI"):
    tf = shape.text_frame
    tf.word_wrap = True
    tf.text = ""
    p = tf.paragraphs[0]
    p.space_after = Pt(1)
    
    r1 = p.add_run()
    r1.text = prefix
    r1.font.name = font_name
    r1.font.bold = True
    r1.font.size = font_size or Pt(10.5)
    r1.font.color.rgb = RGBColor(15, 23, 42)
    
    r2 = p.add_run()
    r2.text = rest
    r2.font.name = font_name
    r2.font.bold = False
    r2.font.size = font_size or Pt(10)
    r2.font.color.rgb = RGBColor(51, 65, 85)

def update_slide_4(slide, chart1_path, chart2_path):
    print("Updating Slide 4 (Feasibility and Viability)...")
    
    # 1. Replace Picture 42 and Picture 43 images
    for s in slide.shapes:
        if s.name == "Picture 42":
            blip = s._element.xpath(".//a:blip/@r:embed")[0]
            part = slide.part.related_part(blip)
            with open(chart1_path, "rb") as f:
                part._blob = f.read()
            print("  Replaced Picture 42 with chart_wape.png")
        elif s.name == "Picture 43":
            blip = s._element.xpath(".//a:blip/@r:embed")[0]
            part = slide.part.related_part(blip)
            with open(chart2_path, "rb") as f:
                part._blob = f.read()
            print("  Replaced Picture 43 with chart_accuracy.png")

    # Helper to find shape recursively by name
    def find_shapes(shape_list):
        res = {}
        for s in shape_list:
            res[s.name] = s
            if s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.GROUP:
                for child in s.shapes:
                    res[child.name] = child
        return res

    shapes_map = find_shapes(slide.shapes)

    # Legends above charts
    if "TextBox 36" in shapes_map:
        set_text(shapes_map["TextBox 36"], "Before: Seasonal Naive Baseline (12M Lag)", font_size=Pt(9), bold=True)
    if "TextBox 41" in shapes_map:
        set_text(shapes_map["TextBox 41"], "After: KaushalYuva Production Blend (LGBM + Theta + ETS)", font_size=Pt(9), bold=True)

    # Verification string under chart
    if "TextBox 147" in shapes_map:
        tf = shapes_map["TextBox 147"].text_frame
        tf.word_wrap = True
        tf.text = ""
        p0 = tf.paragraphs[0]
        p0.space_after = Pt(2)
        r0 = p0.add_run()
        r0.text = "3M WAPE: 6.94% → 3.71% | 6M WAPE: 7.62% → 3.58% | 12M WAPE: 8.15% → 3.41% | MASE: 1.028 → 0.553"
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = RGBColor(15, 23, 42)
        
        p1 = tf.add_paragraph()
        r1 = p1.add_run()
        r1.text = "Rolling-origin backtest: 8,704 observations • 6 origins • strict t-1 lag (zero data leakage)"
        r1.font.bold = False
        r1.font.size = Pt(9)
        r1.font.color.rgb = RGBColor(71, 85, 105)

    # Section 1, 2, 3 on top right
    if "TextBox 123" in shapes_map:
        set_prefix_text(
            shapes_map["TextBox 123"],
            "Technically Viable : ",
            "Zero-leakage LightGBM & Tri-Model Ensemble evaluated on 8,704 official observations across 6 rolling origins; achieves 3.41%–3.71% WAPE (42.8% error reduction over naive); 30/30 automated pytest tests passing.",
            font_size=Pt(9)
        )
    if "TextBox 124" in shapes_map:
        set_prefix_text(
            shapes_map["TextBox 124"],
            "Operationally Practical : ",
            "Runs on lightweight CPU or edge VM (<250ms inference), with Docker CPU/GPU containers. Fully bilingual (Devanagari Hindi & English) Liquid Glass UI, 13 REST API endpoints, and direct 1-click CSV/JSON policy brief exports.",
            font_size=Pt(9)
        )
    if "TextBox 125" in shapes_map:
        set_prefix_text(
            shapes_map["TextBox 125"],
            "Economically Scalable : ",
            "Standardized LGD-keyed schema enables instant zero-code scale from 16 pilot districts to all 780+ Indian districts. Open-source Python & React stack requires zero proprietary per-seat enterprise licensing.",
            font_size=Pt(9)
        )

    # Validation center title
    if "TextBox 140" in shapes_map:
        set_text(shapes_map["TextBox 140"], "Validation & Stress Testing (WAPE • MASE • Pinball Loss)", font_size=Pt(12), bold=True)

    # Center bottom domain tags
    if "TextBox 143" in shapes_map:
        set_text(shapes_map["TextBox 143"], "GREEN & RENEWABLE", font_size=Pt(11), bold=True, color=RGBColor(4, 120, 87))
    if "TextBox 141" in shapes_map:
        set_text(shapes_map["TextBox 141"], "Solar PV, EV Technician, Smart Meter\nHigh-growth clean energy corridor\nSevere shortage detected (Score 94)", font_size=Pt(8.5), bold=False)

    if "TextBox 144" in shapes_map:
        set_text(shapes_map["TextBox 144"], "PRECISION MFG", font_size=Pt(11), bold=True, color=RGBColor(217, 119, 6))
    if "TextBox 139" in shapes_map:
        set_text(shapes_map["TextBox 139"], "CNC Operator, Industrial Automation\nIndustrial capex momentum tracking\nBalanced-to-moderate shortage", font_size=Pt(8.5), bold=False)

    if "TextBox 145" in shapes_map:
        set_text(shapes_map["TextBox 145"], "TRADITIONAL SERVICES", font_size=Pt(10), bold=True, color=RGBColor(37, 99, 235))
    if "TextBox 142" in shapes_map:
        set_text(shapes_map["TextBox 142"], "Retail Sales Associate, Data Entry\nSaturated legacy training capacity\nDonor pool identified (Score 47)", font_size=Pt(8.5), bold=False)

    # Potential Challenges
    if "TextBox 129" in shapes_map:
        set_prefix_text(shapes_map["TextBox 129"], "Informal Sector Invisibility — ", "Job portals capture formal vacancies but miss 80%+ unorganized & micro-enterprise labour demand.", font_size=Pt(9))
    if "TextBox 130" in shapes_map:
        set_prefix_text(shapes_map["TextBox 130"], "Trainee Pipeline Attrition — ", "Sanctioned ITI seats do not equal certified, employable graduates entering the workforce.", font_size=Pt(9))
    if "TextBox 131" in shapes_map:
        set_prefix_text(shapes_map["TextBox 131"], "Donor Depletion Risk — ", "Reallocating seats from declining trades risks over-cutting and creating secondary skill deficits.", font_size=Pt(9))
    if "TextBox 132" in shapes_map:
        set_prefix_text(shapes_map["TextBox 132"], "District Heterogeneity — ", "State Skill Missions (SSDMs) record and format operational skilling data disparately.", font_size=Pt(9))
    if "TextBox 133" in shapes_map:
        set_prefix_text(shapes_map["TextBox 133"], "Inter-District Commute Drift — ", "Trained technicians frequently commute to neighbouring industrial clusters for wage premiums.", font_size=Pt(9))

    # Strategies to Overcome Challenges
    if "TextBox 134" in shapes_map:
        set_prefix_text(shapes_map["TextBox 134"], "Multi-Source Data Fusion — ", "Fuses e-Shram unorganized registrations with NCS portal vacancies & PLFS macro signals.", font_size=Pt(9))
    if "TextBox 135" in shapes_map:
        set_prefix_text(shapes_map["TextBox 135"], "4-Stage Supply Funnel — ", "Discounts capacity across utilization (92%), pass rate (88%), participation (82%), and readiness (70%).", font_size=Pt(9))
    if "TextBox 136" in shapes_map:
        set_prefix_text(shapes_map["TextBox 136"], "PuLP Non-Depletion Guardrails — ", "Constrains post-transfer gap ratio ≤ 0.05, keeping donor score safely ≤ 59 (Balanced).", font_size=Pt(9))
    if "TextBox 137" in shapes_map:
        set_prefix_text(shapes_map["TextBox 137"], "3-Tier NCO Normalizer — ", "Cascaded Exact, Token Jaccard & Levenshtein matching aligns records to NCO-2015 & LGD.", font_size=Pt(9))
    if "TextBox 138" in shapes_map:
        set_prefix_text(shapes_map["TextBox 138"], "Calibrated Mobility Multiplier — ", "Applies 0%–30% inter-district commute elasticity to effective supply equations.", font_size=Pt(9))

def update_slide_5(slide):
    print("Updating Slide 5 (Impact and Benefits)...")
    def find_shapes(shape_list):
        res = {}
        for s in shape_list:
            res[s.name] = s
            if s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.GROUP:
                for child in s.shapes:
                    res[child.name] = child
        return res

    shapes_map = find_shapes(slide.shapes)

    # 4 Stakeholders (Left Column)
    if "TextBox 98" in shapes_map:
        set_text(shapes_map["TextBox 98"], "MSDE · NCVET · DGT (Apex Skilling Authorities)", font_size=Pt(11), bold=True)
    if "TextBox 134" in shapes_map:
        set_text(
            shapes_map["TextBox 134"],
            "• Evidence-based annual training targets and NSQF course revisions months before placement outcomes arrive.\n• Single unified national command center aggregating district-level demand across all 36 States & UTs.",
            font_size=Pt(9.2),
            bold=False
        )

    if "TextBox 72" in shapes_map:
        set_text(shapes_map["TextBox 72"], "State Skill Missions (SSDMs) & District Skill Committees (DSCs)", font_size=Pt(11), bold=True)
    if "TextBox 145" in shapes_map:
        set_text(
            shapes_map["TextBox 145"],
            "• Granular District × Trade intelligence for formulating actionable District Skill Development Plans (DSDPs).\n• Ranked, explainable policy intervention briefs with exact seat reallocations and capex requirements.",
            font_size=Pt(9.2),
            bold=False
        )

    if "TextBox 128" in shapes_map:
        set_text(shapes_map["TextBox 128"], "Sector Skill Councils (SSCs) & Industry Associations", font_size=Pt(11), bold=True)
    if "TextBox 151" in shapes_map:
        set_text(
            shapes_map["TextBox 151"],
            "• High-frequency emerging occupation signals to update National Occupational Standards (NOS) & QPs.\n• Direct visibility into localized certified talent pipeline arrival to eliminate enterprise hiring shortages.",
            font_size=Pt(9.2),
            bold=False
        )

    if "TextBox 138" in shapes_map:
        set_text(shapes_map["TextBox 138"], "Youth Trainees & Training Centers (ITIs / PMKKs)", font_size=Pt(11), bold=True)
    if "TextBox 152" in shapes_map:
        set_text(
            shapes_map["TextBox 152"],
            "• Technical training aligned directly to verified local industry hiring demand, boosting formal placement rates.\n• Underutilized classroom infrastructure converted into high-demand green energy and EV service labs.",
            font_size=Pt(9.2),
            bold=False
        )

    # Hero Impact Banner (Bottom)
    if "TextBox 97" in shapes_map:
        set_text(
            shapes_map["TextBox 97"],
            "India trains lakhs of candidates annually, but capacity is chronically misaligned with district hiring. KaushalYuva synthesizes fragmented demand signals into decision-ready seat allocations before funds are committed.",
            font_size=Pt(12),
            bold=True
        )

    # 5 Pillars (Numbered 01 to 05)
    if "TextBox 136" in shapes_map:
        set_text(
            shapes_map["TextBox 136"],
            "₹1.12 Cr public capex saved per district cluster by retrofitting idle labs. ₹21.20 Cr annual youth wages unlocked with 17.6× 1-year wage ROI.",
            font_size=Pt(9),
            bold=False
        )
    if "TextBox 137" in shapes_map:
        set_text(
            shapes_map["TextBox 137"],
            "<250ms optimization & instant PuLP scenario simulation · 13 REST API endpoints — replacing 1-year delayed placement audit reviews.",
            font_size=Pt(9),
            bold=False
        )
    if "TextBox 141" in shapes_map:
        set_text(
            shapes_map["TextBox 141"],
            "100% of Indian districts (780+) scalable via standard LGD & NCO-2015 codes. Piloted across 5 States & 16 priority districts with zero code change.",
            font_size=Pt(9),
            bold=False
        )
    if "TextBox 139" in shapes_map:
        set_text(
            shapes_map["TextBox 139"],
            "Early warning alerts flag emerging skill shortages 3–6 months in advance, enabling proactive faculty hiring and lab setup (e.g. Solar PV for PM Surya Ghar).",
            font_size=Pt(9),
            bold=False
        )
    if "TextBox 140" in shapes_map:
        set_text(
            shapes_map["TextBox 140"],
            "Powers PMKVY 4.0, SANKALP, PMKK, and DGT ITI capacity planning. Aligned with National Skill Qualification Framework (NSQF Levels 3–6).",
            font_size=Pt(9),
            bold=False
        )

    # Government & Policy Impact Box
    if "TextBox 147" in shapes_map:
        set_text(
            shapes_map["TextBox 147"],
            "CAG Audit PMKVY Resolution: Directly resolves CAG audit findings where only 41% of 56 lakh PMKVY candidates were placed while 4.82 lakh ITI seats sat idle for 5+ years.",
            font_size=Pt(9.5),
            bold=False
        )
    if "TextBox 148" in shapes_map:
        set_text(
            shapes_map["TextBox 148"],
            "National Plan Synthesis: Synthesizes 519+ fragmented District Skill Development Plans (DSDPs) into a coherent, real-time national intelligence framework for MSDE apex committees.",
            font_size=Pt(9.5),
            bold=False
        )
    if "TextBox 149" in shapes_map:
        set_text(
            shapes_map["TextBox 149"],
            "Powers PM Surya Ghar & National Green Missions: Rapidly scales Solar PV and EV diagnostic technician cohorts to match PM Surya Ghar targets without constructing redundant greenfield centres.",
            font_size=Pt(9.5),
            bold=False
        )
    if "TextBox 150" in shapes_map:
        set_text(
            shapes_map["TextBox 150"],
            "Economic Return on Investment | 638+ Youth Placed | ₹21.20 Cr Wages Unlocked | ₹1.12 Cr Public Capex Saved",
            font_size=Pt(9.5),
            bold=True,
            color=RGBColor(15, 23, 42)
        )

    # Right Feature Badges
    if "TextBox 129" in shapes_map:
        set_text(shapes_map["TextBox 129"], "OPEN-SOURCE - Zero Licensing", font_size=Pt(10), bold=True)
    if "TextBox 130" in shapes_map:
        set_text(shapes_map["TextBox 130"], "GOV ALIGNED - NCO-2015 & LGD", font_size=Pt(10), bold=True)
    if "TextBox 131" in shapes_map:
        set_text(shapes_map["TextBox 131"], "100% BILINGUAL - Hindi & English", font_size=Pt(10), bold=True)
    if "TextBox 132" in shapes_map:
        set_text(shapes_map["TextBox 132"], "DUAL-MODE - Live & Synthetic", font_size=Pt(10), bold=True)
    if "TextBox 133" in shapes_map:
        set_text(shapes_map["TextBox 133"], "DECISION-READY - REST & CSV", font_size=Pt(10), bold=True)

def update_slide_6(slide):
    print("Updating Slide 6 (Research and References)...")
    def find_shapes(shape_list):
        res = {}
        for s in shape_list:
            res[s.name] = s
            if s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.GROUP:
                for child in s.shapes:
                    res[child.name] = child
        return res

    shapes_map = find_shapes(slide.shapes)

    # Left Column Citations
    if "TextBox 27" in shapes_map:
        c1 = (
            "• CAG Report No. 17 of 2023 · Performance Audit of PMKVY (MSDE) — 41% placement rate & chronic trade mismatch [CAG] [REPORT]\n"
            "• DGT ITI Capacity Utilisation Survey (2024) · 4.82 lakh vacant seats across legacy engineering trades [DGT] [SURVEY]\n"
            "• SANKALP National Skill Gap Study · NCAER & MSDE district-level skill vulnerability assessments [SANKALP] [NCAER]"
        )
        set_text(shapes_map["TextBox 27"], c1, font_size=Pt(9.5), bold=False)

    if "TextBox 28" in shapes_map:
        c2 = (
            "• LightGBM — Ke et al., NeurIPS 2017 · GOSS & EFB for high-speed tabular forecasting [PAPER] [CODE]\n"
            "• TreeSHAP — Lundberg & Lee, NeurIPS 2017 · Unified feature attribution for policy explainability [SHAP] [DOCS]"
        )
        set_text(shapes_map["TextBox 28"], c2, font_size=Pt(9.5), bold=False)

    if "TextBox 29" in shapes_map:
        c3 = (
            "• WAPE & MASE Metrics — Hyndman & Koehler, IJF 2006 · Forecast measures for intermittent demand [PAPER]\n"
            "• Constrained Seat Rebalancing — COIN-OR PuLP Simplex LP Solver [PULP] [DOCS]\n"
            "• Standard Classifications — NCO-2015 (8-digit), NSQF (Levels 3–6), LGD District Codes [NCO] [NSQF] [LGD]\n"
            "• Live Working Platform Links:\n"
            "  - Primary Web Platform: https://kaushalyuva.vercel.app [LIVE]\n"
            "  - Video Demo: https://youtu.be/zBtUsWTAiAc [VIDEO]\n"
            "  - Source Code: https://github.com/aquasimp/SIH26246 [REPO]"
        )
        set_text(shapes_map["TextBox 29"], c3, font_size=Pt(9.2), bold=False)

    # Right Column: Remove Object 2 and add crisp Native PowerPoint Table
    for s in list(slide.shapes):
        if s.name == "Object 2":
            sp = s._element
            sp.getparent().remove(sp)
            print("  Removed old OLE Object 2")

    # Bounding box for table
    table_left = 6815242
    table_top = 1452674
    table_width = 10900000
    table_height = 8200000

    table_shape = slide.shapes.add_table(11, 4, table_left, table_top, table_width, table_height)
    table = table_shape.table

    # Column widths
    table.columns[0].width = 2000000  # Features (2.0m)
    table.columns[1].width = 2850000  # Existing Solutions (2.85m)
    table.columns[2].width = 3350000  # Our Solution (KaushalYuva) (3.35m)
    table.columns[3].width = 2700000  # Key Differences (2.70m)

    headers = ["Features", "Existing Solutions", "Our Solution (KaushalYuva)", "Key Differences"]
    for c_idx, h in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(15, 23, 42) # Slate 900
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(255, 255, 255)
        p.alignment = PP_ALIGN.LEFT
        cell.margin_left = Inches(0.08)
        cell.margin_right = Inches(0.08)
        cell.margin_top = Inches(0.05)
        cell.margin_bottom = Inches(0.05)
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE

    rows_data = [
        ("• Data Scope", "❌ Fragmented portal job counts or annual survey lag", "✅ Unified fusion: NCS + e-Shram + PLFS + SSC", "Formal & unorganized coverage"),
        ("• Granularity", "❌ State / national macro totals only", "✅ District × NCO-2015 trade-level (16 pilots to 780+)", "Localized operational clarity"),
        ("• Forecasting", "❌ Backward-looking annual placement audits", "✅ Forward-looking 3M, 6M, 12M monthly forecasts", "Proactive before funds committed"),
        ("• Supply Model", "❌ Raw sanctioned seat counts", "✅ 4-stage funnel (utilization, pass, participation, ready)", "True employable graduate talent"),
        ("• Allocation", "❌ Ad-hoc, manual, political seat allocation", "✅ PuLP LP optimization with non-depletion bounds", "Mathematically guarded transfers"),
        ("• Explainability", "❌ Black-box intuition or static reports", "✅ TreeSHAP feature importance & clear trade cards", "Explainable for DSC planners"),
        ("• Accessibility", "❌ English-only desktop GIS / complex ERPs", "✅ 100% Bilingual (Devanagari Hindi & English)", "Accessible to grassroots officers"),
        ("• Architecture", "❌ Monolithic silos or expensive proprietary BI", "✅ FastAPI + Next.js 14 + SQLite/PostgreSQL", "Open-source, zero license cost"),
        ("• Actionability", "❌ Static PDF reports published with 18-month delay", "✅ Instant 1-click CSV/JSON briefs & scenario sandbox", "Decision-ready policy output"),
        ("• Deployment", "❌ Heavy multi-server enterprise install", "✅ Single-command Docker & cloud serverless ready", "Deploys in under 5 minutes")
    ]

    for r_idx, row_vals in enumerate(rows_data, start=1):
        # Alternating background
        bg_color = RGBColor(255, 255, 255) if r_idx % 2 == 1 else RGBColor(241, 245, 249) # Slate 100
        for c_idx, val in enumerate(row_vals):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_color
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(8.8)
            p.alignment = PP_ALIGN.LEFT
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.08)
            cell.margin_top = Inches(0.04)
            cell.margin_bottom = Inches(0.04)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE

            if c_idx == 0:
                p.font.bold = True
                p.font.color.rgb = RGBColor(15, 23, 42)
            elif c_idx == 1:
                p.font.bold = False
                p.font.color.rgb = RGBColor(185, 28, 28) # Red 700
            elif c_idx == 2:
                p.font.bold = True
                p.font.color.rgb = RGBColor(4, 120, 87) # Emerald 700
            elif c_idx == 3:
                p.font.bold = False
                p.font.color.rgb = RGBColor(30, 41, 59) # Slate 800

    print("  Created native comparison table on Slide 6")

def main():
    print(f"Loading presentation from: {SRC_PPT}")
    prs = pptx.Presentation(SRC_PPT)
    print(f"Total slides loaded: {len(prs.slides)}")

    # Ensure charts are ready
    c1, c2 = ensure_charts()

    # SLIDE 1, 2, 3: SKIP (preserve untouched)
    print("Skipping Slide 1, Slide 2, Slide 3 as requested...")

    # SLIDE 4: FEASIBILITY AND VIABILITY (index 3)
    update_slide_4(prs.slides[3], c1, c2)

    # SLIDE 5: IMPACT AND BENEFITS (index 4)
    update_slide_5(prs.slides[4])

    # SLIDE 6: RESEARCH AND REFERENCES (index 5)
    update_slide_6(prs.slides[5])

    # Ensure output directory exists
    os.makedirs(OUT_DIR, exist_ok=True)

    # Save to OUT_PPT_MAIN and OUT_PPT_NAMED
    print(f"Saving presentation to: {OUT_PPT_MAIN}")
    prs.save(OUT_PPT_MAIN)
    print(f"Saving presentation to: {OUT_PPT_NAMED}")
    prs.save(OUT_PPT_NAMED)

    print("\nTransformation complete! Both files successfully saved.")

if __name__ == "__main__":
    main()
