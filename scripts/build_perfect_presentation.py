import os
import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

SRC_TEMPLATE = r"C:\Users\anura\Downloads\sih2026\winning.pptx"
OUT_DIR = r"C:\Users\anura\Downloads\sih2026"
OUT_PPT_MAIN = os.path.join(OUT_DIR, "LegacyCoderzSIH2026.pptx")
OUT_PPT_NAMED = os.path.join(OUT_DIR, "LegacyCoderz_PS26246_KaushalYuva.pptx")
ASSETS_DIR = r"c:\Users\anura\Downloads\SIH26246\scripts\perfect_assets"

# Executive Brand Palette
NAVY = RGBColor(15, 32, 66)           # #0F2042 - Deep Executive Navy
SLATE_DARK = RGBColor(15, 23, 42)     # #0F172A - Pitch Charcoal
SLATE_MID = RGBColor(51, 65, 85)      # #334155 - Slate Body
SLATE_MUTED = RGBColor(100, 116, 139) # #64748B - Muted Subtext
CYAN = RGBColor(2, 132, 199)          # #0284C7 - Vibrant Cyan
ROYAL_BLUE = RGBColor(30, 58, 138)    # #1E3A8A - Royal Navy
GREEN = RGBColor(22, 101, 52)         # #166534 - Forest Green
RED = RGBColor(185, 28, 28)           # #B91C1C - Alert Red
WHITE = RGBColor(255, 255, 255)

def find_shape(container, name):
    for s in container.shapes:
        if s.name == name:
            return s
        if s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.GROUP:
            res = find_shape(s, name)
            if res:
                return res
    return None

def remove_element(shape):
    if shape is None:
        return
    try:
        sp = shape._element
        sp.getparent().remove(sp)
    except Exception as e:
        pass

def replace_pic_blob(pic_shape, new_img_path):
    if pic_shape is None:
        print(f"  WARNING: pic_shape is None for {new_img_path}")
        return
    blip = pic_shape._element.xpath('.//a:blip/@r:embed')[0]
    part = pic_shape.part.related_part(blip)
    with open(new_img_path, 'rb') as f:
        part._blob = f.read()

def clear_and_set_runs(shape, paragraphs_data, font_name="Segoe UI", default_space_after=2):
    if shape is None:
        return
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    tf.text = ""

    for p_idx, item in enumerate(paragraphs_data):
        p = tf.paragraphs[0] if p_idx == 0 else tf.add_paragraph()
        if isinstance(item, tuple) and len(item) == 3 and isinstance(item[0], list):
            runs, sp_before, sp_after = item
            p.space_before = Pt(sp_before)
            p.space_after = Pt(sp_after)
        else:
            runs = item
            p.space_before = Pt(0)
            p.space_after = Pt(default_space_after)

        for (txt, sz, bold, color) in runs:
            run = p.add_run()
            run.text = txt
            run.font.name = font_name
            run.font.size = Pt(sz)
            run.font.bold = bold
            if color:
                run.font.color.rgb = color

def set_simple_text(shape, text, font_size=11, bold=True, color=SLATE_DARK, align=None, font_name="Segoe UI", space_after=1):
    if shape is None:
        return
    tf = shape.text_frame
    tf.word_wrap = True
    tf.text = ""
    lines = text.split("\n")
    for idx, line in enumerate(lines):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.space_after = Pt(space_after)
        p.space_before = Pt(0)
        if align:
            p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.font.bold = bold
        if color:
            run.font.color.rgb = color

# ==============================================================================
# SLIDE 1: Title Slide (Official SIH 2026 Executive Standard)
# ==============================================================================
def build_slide_1(slide):
    print("Building Slide 1 (Title Slide)...")
    sh_title = find_shape(slide, "object 6")
    set_simple_text(sh_title, "SMART INDIA HACKATHON 2026", font_size=38, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    sh_main = find_shape(slide, "object 5")
    sh_main.left = Inches(0.85)
    sh_main.top = Inches(1.30)
    sh_main.width = Inches(11.8)
    sh_main.height = Inches(8.8)

    p_data = [
        ([("KaushalYuva", 54, True, NAVY)], 0, 8),
        ([("Forecast the Skill Gap · Fund the Fix", 26, True, CYAN)], 0, 32),
        ([("Problem Statement ID – ", 21, True, NAVY), ("26246", 21, True, SLATE_DARK)], 0, 14),
        ([("Problem Statement Title – ", 20, True, NAVY), ("AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine", 19.5, False, SLATE_DARK)], 0, 14),
        ([("Apex Ministry – ", 20, True, NAVY), ("Ministry of Skill Development and Entrepreneurship (MSDE)", 19.5, False, SLATE_DARK)], 0, 14),
        ([("Theme – ", 20, True, NAVY), ("Smart Education / Skilling & Labour Market Intelligence", 19.5, False, SLATE_DARK)], 0, 14),
        ([("PS Category – ", 20, True, NAVY), ("Software", 19.5, False, SLATE_DARK)], 0, 14),
        ([("Team ID – ", 21, True, NAVY), ("163585", 21, True, SLATE_DARK)], 0, 14),
        ([("Team Name – ", 21, True, NAVY), ("Legacy Coderz", 21, True, SLATE_DARK)], 0, 4)
    ]
    clear_and_set_runs(sh_main, p_data)

    for dot_name in ["object 7", "object 8", "object 9", "object 10", "object 11", "object 12"]:
        remove_element(find_shape(slide, dot_name))

# ==============================================================================
# SLIDE 2: Proposed Solution & Technical Architecture
# ==============================================================================
def build_slide_2(slide):
    print("Building Slide 2 (Proposed Solution & Architecture)...")
    set_simple_text(find_shape(slide, "object 3"), "KaushalYuva", font_size=36, bold=True, color=NAVY, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 105"), "Forecast the Skill Gap · Fund the Fix", font_size=18, bold=True, color=CYAN, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 8"), "Legacy Coderz\nProposed Solution –", font_size=14, bold=True, color=SLATE_DARK)

    sh_sol = find_shape(slide, "object 20")
    sh_sol.left = Inches(0.35)
    sh_sol.top = Inches(1.30)
    sh_sol.width = Inches(11.0)
    sh_sol.height = Inches(4.3)

    sol_bullets = [
        ([("• KaushalYuva (Platform Architecture) – ", 12, True, NAVY), ("AI-Enabled Labour Market Intelligence Engine engineered for MSDE to eliminate the persistent structural mismatch between institutional skill training and district hiring demand.", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• Multi-Source Data Fusion Engine – ", 12, True, NAVY), ("Harmonizes NCS portal vacancies, e-Shram unorganized worker profiles, PLFS macroeconomic trends, and DGT/SSM training capacity pipelines into unified LGD district records.", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• 3-Tier NCO & LGD Normalizer – ", 12, True, NAVY), ("Cascaded Exact Match -> Token Jaccard -> Semantic Vector Embeddings maps unstructured free-text job titles to 8-digit NCO-2015 codes and LGD district IDs.", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• Tri-Model Ensemble Demand Forecasting – ", 12, True, NAVY), ("Combines LightGBM GBDT + Theta + ETS over 6 rolling origins to generate 3M, 6M, and 12M monthly forecasts across 780+ districts with zero data leakage (3.41% WAPE).", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• 4-Stage Talent Supply Funnel – ", 12, True, NAVY), ("Discounts nominal sanctioned capacity across utilization (92%), pass rate (88%), participation (82%), and readiness (70%) to model real employable talent.", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• PuLP Simplex LP Seat Rebalancing – ", 12, True, NAVY), ("Solves linear programming optimization to calculate trade seat transfers with strict donor-protection guardrails and inter-district mobility limits.", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• TreeSHAP Policy Explainability (XAI) – ", 12, True, NAVY), ("Deconstructs every trade surplus/deficit into feature attributions, equipping District Skill Committees (DSCs) with audit-defensible justification.", 11.5, False, SLATE_DARK)], 0, 9),
        ([("• 100% Bilingual & Production-Ready – ", 12, True, NAVY), ("Native Devanagari Hindi & English interface across web & mobile browsers with 13 REST APIs and 1-click district policy brief exports.", 11.5, False, SLATE_DARK)], 0, 2)
    ]
    clear_and_set_runs(sh_sol, sol_bullets)

    # Innovation & Uniqueness Roadmap Pins (01-05)
    set_simple_text(find_shape(slide, "object 62"), "Tri-Model AI Forecasting\n(LightGBM + Theta + ETS)", font_size=9.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 67"), "NCO & LGD Vector\nNormalizer (3-Tier)", font_size=9.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 72"), "Constrained PuLP LP\nSeat Rebalancing", font_size=9.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 77"), "TreeSHAP Policy\nExplainability Cards", font_size=9.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 82"), "100% Bilingual Engine\n(Hindi & English)", font_size=9.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Replace Architecture Diagram Picture
    arch_pic = find_shape(slide, "object 107")
    arch_img_path = os.path.join(ASSETS_DIR, "arch_diagram_kaushalyuva.png")
    replace_pic_blob(arch_pic, arch_img_path)

    # Right Bottom 4 Pill Badges
    set_simple_text(find_shape(slide, "object 128"), "District-Level Granularity\n(780+ Districts)", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 129"), "Forward Demand Forecast\n(3M, 6M, 12M Horizon)", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 130"), "Guarded Seat Rebalancing\n(PuLP Simplex LP)", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 131"), "Instant Decision Briefs\n(1-Click CSV/PDF Export)", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

    remove_element(find_shape(slide, "object 9"))

# ==============================================================================
# SLIDE 3: Technical Approach, Process Flow & Prototype Showcase
# ==============================================================================
def build_slide_3(slide):
    print("Building Slide 3 (Technical Approach & Prototype)...")
    set_simple_text(find_shape(slide, "object 10"), "Legacy Coderz", font_size=14, bold=True, color=SLATE_DARK)

    # Process Flow Diagram Image
    pflow_pic = find_shape(slide, "object 31")
    pflow_img_path = os.path.join(ASSETS_DIR, "flowchart_process_kaushalyuva.png")
    replace_pic_blob(pflow_pic, pflow_img_path)

    # Remove internal divider lines in object 11 so methodology card is clean and open
    for div_name in ["object 14", "object 15", "object 16", "object 17", "object 18", "object 19", "object 20", "object 21", "object 22"]:
        remove_element(find_shape(slide, div_name))

    # Clean 5 Methodology Bullets inside open card
    sh_c1 = find_shape(slide, "object 24")
    sh_c1.left = Inches(12.00)
    sh_c1.top = Inches(1.22)
    sh_c1.width = Inches(7.70)
    sh_c1.height = Inches(0.65)
    c1_txt = [
        ([("• Data Ingestion: ", 10.5, True, NAVY), ("Harmonizes 8,704 historical observations across 16 pilot districts; fuses formal portal demand with informal e-Shram registrations.", 10, False, SLATE_DARK)], 0, 1)
    ]
    clear_and_set_runs(sh_c1, c1_txt)

    sh_c_rest = find_shape(slide, "object 78")
    sh_c_rest.left = Inches(12.00)
    sh_c_rest.top = Inches(1.95)
    sh_c_rest.width = Inches(7.70)
    sh_c_rest.height = Inches(3.00)

    rest_bullets = [
        ([("• Semantic Normalization: ", 10.5, True, NAVY), ("Cascaded Exact Match -> Token Jaccard -> Semantic Vector Embeddings maps free-text titles to 8-digit NCO-2015 & LGD codes.", 10, False, SLATE_DARK)], 0, 8),
        ([("• Predictive Modeling: ", 10.5, True, NAVY), ("Tri-Model ensemble (LightGBM + Theta + ETS) evaluated on 6 rolling origins, achieving 3.41%–3.71% WAPE with zero data leakage.", 10, False, SLATE_DARK)], 0, 8),
        ([("• Optimization Engine: ", 10.5, True, NAVY), ("PuLP Simplex LP allocates seat transfers subject to classroom capacity, capex ceilings, and non-depletion guardrails.", 10, False, SLATE_DARK)], 0, 8),
        ([("• Decision Delivery: ", 10.5, True, NAVY), ("Bilingual web platform (Next.js + FastAPI + SQLite/Postgres) with 13 REST APIs and 1-click policy briefs.", 10, False, SLATE_DARK)], 0, 4),
        ([("• Live Platform URL: ", 10.5, True, CYAN), ("https://kaushalyuva.vercel.app  (Mirror: https://sih-26246.vercel.app)", 10, True, CYAN)], 0, 1)
    ]
    clear_and_set_runs(sh_c_rest, rest_bullets)

    # Prototype Screenshots (6 slots)
    proto_assets = [
        os.path.join(ASSETS_DIR, "proto1_dashboard.png"),
        os.path.join(ASSETS_DIR, "proto2_forecast.png"),
        os.path.join(ASSETS_DIR, "proto3_xai.png"),
        os.path.join(ASSETS_DIR, "proto4_funnel.png"),
        os.path.join(ASSETS_DIR, "proto5_rebalance.png"),
        os.path.join(ASSETS_DIR, "proto6_policybrief.png"),
    ]

    # Slot 1: object 34 (0.49, 5.44, 4.42x2.36)
    replace_pic_blob(find_shape(slide, "object 34"), proto_assets[0])
    sh_t1 = find_shape(slide, "object 75")
    sh_t1.left = Inches(0.49)
    sh_t1.top = Inches(5.12)
    sh_t1.width = Inches(4.42)
    sh_t1.height = Inches(0.28)
    set_simple_text(sh_t1, "EXECUTIVE COMMAND CENTER", font_size=9, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Slot 2: object 35 (5.05, 5.44, 4.43x2.37)
    replace_pic_blob(find_shape(slide, "object 35"), proto_assets[1])
    sh_t2 = find_shape(slide, "object 76")
    sh_t2.left = Inches(5.05)
    sh_t2.top = Inches(5.12)
    sh_t2.width = Inches(4.43)
    sh_t2.height = Inches(0.28)
    set_simple_text(sh_t2, "AI DEMAND FORECASTING (3M-12M)", font_size=9, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Slot 3: object 73 (9.60, 5.44, 4.43x2.37)
    replace_pic_blob(find_shape(slide, "object 73"), proto_assets[2])
    sh_t3 = find_shape(slide, "object 79")
    sh_t3.left = Inches(9.60)
    sh_t3.top = Inches(5.12)
    sh_t3.width = Inches(4.43)
    sh_t3.height = Inches(0.28)
    set_simple_text(sh_t3, "TREESHAP POLICY EXPLAINABILITY", font_size=9, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Slot 4: object 40 (0.49, 8.27, 4.43x2.36)
    replace_pic_blob(find_shape(slide, "object 40"), proto_assets[3])
    remove_element(find_shape(slide, "object 80"))
    remove_element(find_shape(slide, "object 74"))
    sh_t4 = slide.shapes.add_textbox(Inches(0.49), Inches(7.95), Inches(4.43), Inches(0.28))
    set_simple_text(sh_t4, "4-STAGE TALENT SUPPLY FUNNEL", font_size=9, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Slot 5: object 38 (5.05, 8.27, 4.43x2.36)
    replace_pic_blob(find_shape(slide, "object 38"), proto_assets[4])
    sh_t5 = find_shape(slide, "object 81")
    sh_t5.left = Inches(5.05)
    sh_t5.top = Inches(7.95)
    sh_t5.width = Inches(4.43)
    sh_t5.height = Inches(0.28)
    set_simple_text(sh_t5, "PULP SEAT REBALANCING SANDBOX", font_size=9, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Slot 6: object 39 (9.60, 8.27, 4.43x2.36)
    replace_pic_blob(find_shape(slide, "object 39"), proto_assets[5])
    sh_t6 = find_shape(slide, "object 82")
    sh_t6.left = Inches(9.60)
    sh_t6.top = Inches(7.95)
    sh_t6.width = Inches(4.43)
    sh_t6.height = Inches(0.28)
    set_simple_text(sh_t6, "1-CLICK DISTRICT POLICY BRIEFS", font_size=9, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Bottom Banner (object 36)
    set_simple_text(find_shape(slide, "object 36"), "OUR PROTOTYPE IS 100% FUNCTIONAL & PRODUCTION-READY ON VERCEL (13 REST APIS · BILINGUAL)", font_size=13, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

    # Demo links
    set_simple_text(find_shape(slide, "object 95"), "Click/Scan for Live Working Prototype", font_size=10.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 102"), "Live Platform", font_size=12, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 103"), "https://kaushalyuva.vercel.app", font_size=9.5, bold=True, color=CYAN, align=PP_ALIGN.CENTER)

    # Tech stack titles neatly positioned in gaps between ellipses
    sh_stk1 = find_shape(slide, "object 64")
    sh_stk1.left = Inches(14.80)
    sh_stk1.top = Inches(6.86)
    sh_stk1.width = Inches(4.50)
    sh_stk1.height = Inches(0.24)
    set_simple_text(sh_stk1, "Frontend + Backend: Next.js 14 · FastAPI", font_size=8.5, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    sh_stk2 = find_shape(slide, "object 65")
    sh_stk2.left = Inches(14.80)
    sh_stk2.top = Inches(7.90)
    sh_stk2.width = Inches(4.50)
    set_simple_text(sh_stk2, "AI / ML & Optimization: LightGBM · Statsmodels · PuLP", font_size=8.5, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    sh_stk3 = find_shape(slide, "object 67")
    sh_stk3.left = Inches(14.80)
    sh_stk3.top = Inches(9.15)
    sh_stk3.width = Inches(4.50)
    set_simple_text(sh_stk3, "Data & Cloud: SQLite / Postgres · Docker · Vercel", font_size=8.5, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    sh_stk4 = find_shape(slide, "object 68")
    sh_stk4.left = Inches(17.20)
    sh_stk4.top = Inches(10.25)
    sh_stk4.width = Inches(2.30)
    set_simple_text(sh_stk4, "CSV & PDF Export", font_size=8, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    remove_element(find_shape(slide, "object 66"))
    remove_element(find_shape(slide, "object 69"))
    set_simple_text(find_shape(slide, "object 70"), "TECH STACK", font_size=11, bold=True, color=NAVY, align=PP_ALIGN.CENTER)

    for d_name in ["object 23", "object 26", "object 27", "object 28", "object 29"]:
        remove_element(find_shape(slide, d_name))

# ==============================================================================
# SLIDE 4: Feasibility and Viability
# ==============================================================================
def build_slide_4(slide):
    print("Building Slide 4 (Feasibility and Viability)...")
    set_simple_text(find_shape(slide, "object 5"), "Legacy Coderz", font_size=14, bold=True, color=SLATE_DARK)

    # Chart header
    set_simple_text(find_shape(slide, "object 67"), "Forecasting Performance: Baseline vs KaushalYuva Engine", font_size=14, bold=True, color=NAVY)

    # Replace Chart Picture
    chart_pic = find_shape(slide, "object 66")
    chart_img_path = os.path.join(ASSETS_DIR, "chart_wape_clean.png")
    replace_pic_blob(chart_pic, chart_img_path)

    # Feasibility Analysis (Middle container)
    # Section Header (Shifted right to avoid the person illustration at x=8.5)
    sh_feas_title = slide.shapes.add_textbox(Inches(9.50), Inches(0.92), Inches(3.30), Inches(0.45))
    set_simple_text(sh_feas_title, "Feasibility Analysis", font_size=15, bold=True, color=NAVY)

    # Technically Viable (aligned with Circle 1 at y = 1.95)
    sh_f1 = find_shape(slide, "object 19")
    sh_f1.top = Inches(1.65)
    sh_f1.left = Inches(8.86)
    sh_f1.width = Inches(3.91)
    sh_f1.height = Inches(1.30)
    feas_p1 = [
        ([("Technically Viable – ", 10, True, NAVY), ("Zero-leakage LightGBM & Tri-Model Ensemble evaluated on 8,704 official observations across 6 rolling origins; achieves 3.41%–3.71% WAPE (42.8% error reduction over baseline); 30/30 automated pytest tests passing.", 9.5, False, SLATE_DARK)], 0, 2)
    ]
    clear_and_set_runs(sh_f1, feas_p1)

    # Operationally Practical (aligned with Circle 2 at y = 3.50)
    sh_f2 = find_shape(slide, "object 17")
    sh_f2.top = Inches(3.25)
    sh_f2.left = Inches(7.85)
    sh_f2.width = Inches(4.09)
    sh_f2.height = Inches(1.30)
    feas_p2 = [
        ([("Operationally Practical – ", 10, True, NAVY), ("Runs on lightweight CPU or edge VM (<250ms inference), with Docker containerization. Fully bilingual (Devanagari Hindi & English) UI, 13 REST API endpoints, and direct 1-click CSV/JSON policy brief exports for district officers.", 9.5, False, SLATE_DARK)], 0, 2)
    ]
    clear_and_set_runs(sh_f2, feas_p2)

    # Economically Scalable (aligned with Circle 3 at y = 5.05)
    sh_f3 = find_shape(slide, "object 18")
    sh_f3.top = Inches(4.85)
    sh_f3.left = Inches(8.97)
    sh_f3.width = Inches(3.75)
    sh_f3.height = Inches(1.15)
    feas_p3 = [
        ([("Economically Scalable – ", 10, True, NAVY), ("Standardized LGD-keyed schema enables instant zero-code scale from 16 pilot districts to all 780+ Indian districts. Open-source Python & React stack requires zero proprietary per-seat enterprise licensing.", 9.5, False, SLATE_DARK)], 0, 2)
    ]
    clear_and_set_runs(sh_f3, feas_p3)

    # Potential Challenges & Risks (Right Container, Top Half)
    # Section Header (Shifted right to avoid flag illustration at x=13.3)
    sh_ch_title = slide.shapes.add_textbox(Inches(13.80), Inches(0.82), Inches(5.00), Inches(0.45))
    set_simple_text(sh_ch_title, "Potential Challenges & Risks", font_size=15, bold=True, color=NAVY)

    # Challenge 1 (Compartment 1 above line y = 2.14)
    sh_ch0 = find_shape(slide, "object 54")
    sh_ch0.top = Inches(1.42)
    sh_ch0.left = Inches(13.38)
    sh_ch0.width = Inches(5.50)
    sh_ch0.height = Inches(0.70)
    ch_p0 = [
        ([("Informal Sector Invisibility – ", 9.5, True, SLATE_DARK), ("Job portals capture formal vacancies but miss 80%+ unorganized & micro-enterprise labour demand.", 9, False, SLATE_MID)], 0, 2)
    ]
    clear_and_set_runs(sh_ch0, ch_p0)

    # Challenges 2-5
    ch_p1 = [([("Trainee Pipeline Attrition – ", 9.5, True, SLATE_DARK), ("Sanctioned ITI seats do not equal certified, employable graduates entering the workforce.", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 23"), ch_p1)

    ch_p2 = [([("Donor Depletion Risk – ", 9.5, True, SLATE_DARK), ("Reallocating seats from declining trades risks over-cutting and creating secondary skill deficits.", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 24"), ch_p2)

    ch_p3 = [([("District Data Heterogeneity – ", 9.5, True, SLATE_DARK), ("State Skill Missions (SSDMs) record and format operational skilling data disparately.", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 25"), ch_p3)

    ch_p4 = [([("Inter-District Commute Drift – ", 9.5, True, SLATE_DARK), ("Trained technicians frequently commute to neighbouring industrial clusters for wage premiums.", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 26"), ch_p4)

    # Strategies for Overcoming Challenges (Right Container, Bottom Half)
    # Section Header (Shifted right to avoid gears icon at x=13.2)
    sh_st_title = slide.shapes.add_textbox(Inches(13.80), Inches(5.82), Inches(5.00), Inches(0.45))
    set_simple_text(sh_st_title, "Strategies for Overcoming Challenges", font_size=15, bold=True, color=NAVY)

    # Strategy 1 (Compartment 1 above line y = 7.49)
    sh_st0 = find_shape(slide, "object 53")
    sh_st0.top = Inches(6.78)
    sh_st0.left = Inches(13.49)
    sh_st0.width = Inches(5.40)
    sh_st0.height = Inches(0.68)
    st_p0 = [
        ([("Multi-Source Data Fusion – ", 9.5, True, NAVY), ("Fuses e-Shram unorganized registrations with NCS portal vacancies & PLFS macro signals.", 9, False, SLATE_MID)], 0, 2)
    ]
    clear_and_set_runs(sh_st0, st_p0)

    # Strategies 2-5
    st_p1 = [([("4-Stage Supply Funnel – ", 9.5, True, NAVY), ("Discounts capacity across utilization (92%), pass rate (88%), participation (82%), and readiness (70%).", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 37"), st_p1)

    st_p2 = [([("PuLP Non-Depletion Guardrails – ", 9.5, True, NAVY), ("Constrains post-transfer gap ratio <= 0.05, keeping donor score safely <= 59 (Balanced).", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 38"), st_p2)

    st_p3 = [([("3-Tier NCO Normalizer – ", 9.5, True, NAVY), ("Cascaded Exact, Token Jaccard & Levenshtein matching aligns records to NCO-2015 & LGD.", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 39"), st_p3)

    st_p4 = [([("Calibrated Mobility Multiplier – ", 9.5, True, NAVY), ("Applies 0%–30% inter-district commute elasticity to effective supply equations.", 9, False, SLATE_MID)], 0, 2)]
    clear_and_set_runs(find_shape(slide, "object 40"), st_p4)

    # Key Insights from Validation Graph
    set_simple_text(find_shape(slide, "object 97"), "Key Insights from Validation Graph", font_size=15, bold=True, color=NAVY)
    
    set_simple_text(find_shape(slide, "object 75"), "WAPE Cut by 42.8%", font_size=8.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 74"), "Ensemble AI cut monthly WAPE from 8.15% to 3.41%, delivering razor-sharp trade projections.", font_size=8, bold=False, color=SLATE_MID, align=PP_ALIGN.CENTER)

    set_simple_text(find_shape(slide, "object 81"), "Rapid Inference Speed", font_size=8.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 82"), "16 districts simulated in under 1.2 seconds, powering instant what-if policy scenarios.", font_size=8, bold=False, color=SLATE_MID, align=PP_ALIGN.CENTER)

    set_simple_text(find_shape(slide, "object 93"), "Confidence Coverage", font_size=8.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 83"), "Empirical 80% & 95% prediction intervals reach 95.1% coverage, eliminating over-hiring risk.", font_size=8, bold=False, color=SLATE_MID, align=PP_ALIGN.CENTER)
    remove_element(find_shape(slide, "object 92"))

    set_simple_text(find_shape(slide, "object 95"), "Audit Traceability", font_size=8.5, bold=True, color=SLATE_DARK, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 96"), "TreeSHAP feature attributions unpack underlying drivers, providing complete audit compliance.", font_size=8, bold=False, color=SLATE_MID, align=PP_ALIGN.CENTER)

    # Roadmap
    set_simple_text(find_shape(slide, "object 98"), "National Scale Roadmap for KaushalYuva", font_size=13, bold=True, color=NAVY)
    roadmap_pic = find_shape(slide, "object 103")
    roadmap_img_path = os.path.join(ASSETS_DIR, "roadmap_kaushalyuva.png")
    replace_pic_blob(roadmap_pic, roadmap_img_path)

# ==============================================================================
# SLIDE 5: Impact and Benefits
# ==============================================================================
def build_slide_5(slide):
    print("Building Slide 5 (Impact and Benefits)...")
    set_simple_text(find_shape(slide, "object 5"), "Legacy Coderz", font_size=14, bold=True, color=SLATE_DARK)

    # Outside Section Header "Potential Impact" (Shifted right to avoid illustration at x=0.71)
    sh_pot_title = slide.shapes.add_textbox(Inches(1.40), Inches(0.85), Inches(4.50), Inches(0.45))
    set_simple_text(sh_pot_title, "Potential Impact", font_size=16, bold=True, color=NAVY)

    # Card 1 (object 43): MSDE, NCVET & DGT
    sh_card1 = find_shape(slide, "object 43")
    sh_card1.left = Inches(0.35)
    sh_card1.top = Inches(1.68)
    sh_card1.width = Inches(5.50)
    sh_card1.height = Inches(1.80)
    s_p1 = [
        ([("MSDE, NCVET & DGT (Apex Skilling Authorities)", 11.5, True, NAVY)], 0, 4),
        ([("• Evidence-based annual training targets and NSQF course revisions months before placement audits arrive.", 9.5, False, SLATE_MID)], 0, 2),
        ([("• Single unified national command center aggregating district demand across all 36 States & UTs.", 9.5, False, SLATE_MID)], 0, 2)
    ]
    clear_and_set_runs(sh_card1, s_p1)

    # Card 2 (object 42): State Missions & DSCs
    sh_card2 = find_shape(slide, "object 42")
    sh_card2.left = Inches(0.35)
    sh_card2.top = Inches(4.18)
    sh_card2.width = Inches(5.50)
    sh_card2.height = Inches(1.80)
    s_p2 = [
        ([("State Skill Missions & District Skill Committees", 11.5, True, NAVY)], 0, 4),
        ([("• Granular District x Trade intelligence for formulating actionable District Skill Development Plans (DSDPs).", 9.5, False, SLATE_MID)], 0, 2),
        ([("• Ranked, explainable policy intervention briefs with exact seat reallocations and capex requirements.", 9.5, False, SLATE_MID)], 0, 2)
    ]
    clear_and_set_runs(sh_card2, s_p2)

    # Card 3 (object 41): Sector Skill Councils & Industry Associations
    sh_card3 = find_shape(slide, "object 41")
    sh_card3.left = Inches(0.35)
    sh_card3.top = Inches(6.68)
    sh_card3.width = Inches(5.50)
    sh_card3.height = Inches(1.80)
    s_p3 = [
        ([("Sector Skill Councils & Industry Associations", 11.5, True, NAVY)], 0, 4),
        ([("• High-frequency emerging occupation signals to update National Occupational Standards (NOS).", 9.5, False, SLATE_MID)], 0, 2),
        ([("• Direct visibility into localized certified talent pipeline arrival to eliminate enterprise hiring shortages.", 9.5, False, SLATE_MID)], 0, 2)
    ]
    clear_and_set_runs(sh_card3, s_p3)

    # Card 4 (object 40): Youth Trainees & Training Centers
    sh_card4 = find_shape(slide, "object 40")
    sh_card4.left = Inches(0.35)
    sh_card4.top = Inches(9.08)
    sh_card4.width = Inches(5.50)
    sh_card4.height = Inches(1.80)
    s_p4 = [
        ([("Youth Trainees & Training Centers (ITIs / PMKKs)", 11.5, True, NAVY)], 0, 4),
        ([("• Technical training aligned directly to verified local industry hiring demand, boosting formal placement rates.", 9.5, False, SLATE_MID)], 0, 2),
        ([("• Underutilized classroom infrastructure converted into high-demand green energy and EV service labs.", 9.5, False, SLATE_MID)], 0, 2)
    ]
    clear_and_set_runs(sh_card4, s_p4)

    # Benefits of the Solution (5 Columns on Top Right)
    set_simple_text(find_shape(slide, "object 93"), "Economic Efficiency", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 79"), "₹1.12 Cr public capex saved per district cluster by retrofitting idle labs. ₹21.20 Cr annual youth wages unlocked with 17.6x wage ROI.", font_size=8.5, bold=False, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    set_simple_text(find_shape(slide, "object 94"), "Operational Speed", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 81"), "<250ms optimization & instant PuLP scenario simulation · 13 REST API endpoints — replacing 1-year delayed audit reviews.", font_size=8.5, bold=False, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    set_simple_text(find_shape(slide, "object 95"), "National Coverage", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 83"), "100% of Indian districts (780+) scalable via standard LGD & NCO-2015 codes. Piloted across 5 States & 16 priority districts.", font_size=8.5, bold=False, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    set_simple_text(find_shape(slide, "object 96"), "Strategic Foresight", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 85"), "Early warning alerts flag emerging skill shortages 3–6 months in advance, enabling proactive faculty hiring (e.g. Solar PV for PM Surya Ghar).", font_size=8.5, bold=False, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    set_simple_text(find_shape(slide, "object 97"), "Policy Alignment", font_size=10, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    set_simple_text(find_shape(slide, "object 87"), "Powers PMKVY 4.0, SANKALP, PMKK, and DGT ITI capacity planning. Aligned with National Skill Qualification Framework (NSQF).", font_size=8.5, bold=False, color=SLATE_DARK, align=PP_ALIGN.CENTER)

    # Capex Donut Chart (Bottom Middle)
    capex_pic = find_shape(slide, "object 118")
    capex_img_path = os.path.join(ASSETS_DIR, "chart_capex_donut.png")
    replace_pic_blob(capex_pic, capex_img_path)

    for pct_name in ["object 120", "object 121", "object 122", "object 123", "object 119", "object 124"]:
        remove_element(find_shape(slide, pct_name))

    # National Implementation Model (Bottom Right)
    # Outside section title (Shifted right to avoid gear icon at x=14.52)
    sh_impl_title = find_shape(slide, "object 115")
    sh_impl_title.left = Inches(15.20)
    sh_impl_title.top = Inches(6.32)
    sh_impl_title.width = Inches(4.70)
    sh_impl_title.height = Inches(0.40)
    set_simple_text(sh_impl_title, "National Implementation Model – KaushalYuva", font_size=12, bold=True, color=NAVY)

    # Compartment 1 (y = 7.12): MSDE Central Command
    sh_comp1 = slide.shapes.add_textbox(Inches(14.68), Inches(7.12), Inches(5.05), Inches(0.68))
    c1_data = [
        ([("MSDE Central Command – ", 9.5, True, NAVY), ("Apex integration into PMKVY 4.0 national allocation cycles, preventing unplaced trainee expenditures.", 9, False, SLATE_DARK)], 0, 1)
    ]
    clear_and_set_runs(sh_comp1, c1_data)

    # Compartments 2 to 5
    sh_c2 = find_shape(slide, "object 104")
    sh_c2.top = Inches(7.98)
    clear_and_set_runs(sh_c2, [([("District Skill Development Plans (DSDPs) – ", 9.5, True, NAVY), ("Auto-generated 1-click briefs empower DSC collectors with auditable data.", 9, False, SLATE_DARK)], 0, 1)])

    sh_c3 = find_shape(slide, "object 112")
    sh_c3.top = Inches(8.74)
    clear_and_set_runs(sh_c3, [([("ITI Infrastructure Modernization – ", 9.5, True, NAVY), ("Converts 4.82 lakh vacant legacy trade seats into emerging high-wage vocations.", 9, False, SLATE_DARK)], 0, 1)])

    sh_c4 = find_shape(slide, "object 113")
    sh_c4.top = Inches(9.44)
    clear_and_set_runs(sh_c4, [([("Enterprise Apprenticeship Tie-Ups – ", 9.5, True, NAVY), ("Live hiring feeds from industry associations guarantee immediate graduate absorption.", 9, False, SLATE_DARK)], 0, 1)])

    sh_c5 = find_shape(slide, "object 114")
    sh_c5.top = Inches(10.14)
    clear_and_set_runs(sh_c5, [([("SANKALP & Skill India Digital Hub – ", 9.5, True, NAVY), ("API connectivity with SIDH for continuous nationwide tracking.", 9, False, SLATE_DARK)], 0, 1)])

    for d_name in ["object 20", "object 21", "object 23", "object 24", "object 25", "object 26", "object 27", "object 28"]:
        remove_element(find_shape(slide, d_name))

# ==============================================================================
# SLIDE 6: Research, References & Comprehensive Comparison Table
# ==============================================================================
def build_slide_6(slide):
    print("Building Slide 6 (Research, References & Benchmark Table)...")
    set_simple_text(find_shape(slide, "object 5"), "Legacy Coderz", font_size=14, bold=True, color=SLATE_DARK)

    # Research and References Title (beside notebook icon object 23)
    sh_ref_title = slide.shapes.add_textbox(Inches(1.00), Inches(1.22), Inches(5.80), Inches(0.45))
    set_simple_text(sh_ref_title, "RESEARCH AND REFERENCES", font_size=17, bold=True, color=NAVY)

    # References Box filling the black rounded frame object 17
    ref_box = find_shape(slide, "object 22")
    ref_box.left = Inches(0.35)
    ref_box.top = Inches(2.05)
    ref_box.width = Inches(6.65)
    ref_box.height = Inches(7.00)

    ref_data = [
        ([("CAG Audit Report No. 17 of 2023 – ", 10.5, True, NAVY), ("Performance Audit of PMKVY (MSDE) revealing severe trade-placement mismatches and idle training center capacity.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 13),
        ([("DGT ITI Capacity Utilisation Survey (2024) – ", 10.5, True, NAVY), ("Documentation of 4.82 lakh vacant seats in obsolete trades alongside severe technician shortages.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 13),
        ([("LightGBM: A Highly Efficient GBDT (Ke et al., NeurIPS 2017) – ", 10.5, True, NAVY), ("GOSS & EFB algorithms powering ultra-fast tabular demand forecasting.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 13),
        ([("TreeSHAP Local Attribution (Lundberg & Lee, NeurIPS 2017) – ", 10.5, True, NAVY), ("Provides rigorous local feature attribution for explainable policy justification.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 13),
        ([("Measures of Forecast Accuracy (Hyndman & Koehler, IJF 2006) – ", 10.5, True, NAVY), ("Mathematical foundation for WAPE and MASE intermittent metrics.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 13),
        ([("COIN-OR PuLP Simplex LP Solver – ", 10.5, True, NAVY), ("Exact linear programming implementation for constrained seat reallocations.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 13),
        ([("National Classification of Occupations (NCO-2015, MoLE) – ", 10.5, True, NAVY), ("8-digit standardized occupational taxonomic hierarchy.  ", 9.5, False, SLATE_DARK), ("Link", 10, True, CYAN)], 0, 15),
        ([("Live Web Platform: ", 10.5, True, CYAN), ("https://kaushalyuva.vercel.app  [Live Production Prototype]", 9.5, False, SLATE_DARK)], 0, 8),
        ([("Portal Mirror: ", 10.5, True, CYAN), ("https://sih-26246.vercel.app  [Official Mirror]", 9.5, False, SLATE_DARK)], 0, 8),
        ([("Codebase Repository: ", 10.5, True, CYAN), ("https://github.com/aquasimp/SIH26246  [Complete Source Code]", 9.5, False, SLATE_DARK)], 0, 2)
    ]
    clear_and_set_runs(ref_box, ref_data)

    # REMOVE occluding shapes on right side and old text boxes
    for s_name in ["object 7", "object 8", "object 9", "object 10", "object 11", "object 31", "object 32", "object 33", "object 24"]:
        remove_element(find_shape(slide, s_name))

    for d_name in ["object 18", "object 19", "object 20", "object 26", "object 27", "object 28", "object 29", "object 30"]:
        remove_element(find_shape(slide, d_name))

    # Add a pristine PowerPoint Table on the right side
    table_left = Inches(7.35)
    table_top = Inches(1.45)
    table_width = Inches(12.35)
    table_height = Inches(8.80)

    rows = 11
    cols = 4
    table_shape = slide.shapes.add_table(rows, cols, table_left, table_top, table_width, table_height)
    table = table_shape.table

    table.columns[0].width = Inches(2.40) # Evaluation Dimension
    table.columns[1].width = Inches(3.20) # Existing Methods
    table.columns[2].width = Inches(3.70) # KaushalYuva
    table.columns[3].width = Inches(3.05) # Strategic Impact

    # Table Header
    headers = ["Evaluation Dimension", "Existing Methods / Portal Systems", "KaushalYuva (Our Solution)", "Strategic Advantage / Impact"]
    for c_idx, h_text in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        cell.margin_left = Inches(0.06)
        cell.margin_right = Inches(0.06)
        cell.margin_top = Inches(0.04)
        cell.margin_bottom = Inches(0.04)
        
        tf = cell.text_frame
        tf.word_wrap = True
        tf.text = ""
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = h_text
        run.font.name = "Segoe UI"
        run.font.size = Pt(10.5)
        run.font.bold = True
        run.font.color.rgb = WHITE

    # Table Data (10 Rows)
    data_rows = [
        ("Data Scope", "❌ Fragmented job postings or annual macro survey lag", "✔ Unified fusion: NCS + e-Shram + PLFS + SSCs", "Captures 80%+ informal & micro-enterprise labour demand"),
        ("Geographic Granularity", "❌ State / national macro totals only", "✔ District x NCO-2015 trade-level (16 pilots to 780+)", "Localized operational clarity for District Skill Committees"),
        ("Forecast Horizon", "❌ Backward-looking annual placement audits", "✔ Forward-looking 3M, 6M, 12M monthly forecasts", "Proactive trade interventions before funds are committed"),
        ("Supply Modeling", "❌ Raw sanctioned seat counts (nominal)", "✔ 4-stage funnel (utilization, pass, part, ready)", "Accounts for true employable certified talent pool"),
        ("Seat Allocation", "❌ Ad-hoc, manual, political seat allocation", "✔ PuLP Simplex LP with non-depletion guardrails", "Mathematically optimal transfers without destroying donors"),
        ("Policy Explainability", "❌ Black-box intuition or static PDF charts", "✔ TreeSHAP feature importance & trade reason cards", "Complete audit justification for district collectors"),
        ("Language & Accessibility", "❌ English-only desktop GIS / complex ERPs", "✔ 100% Bilingual (Devanagari Hindi & English) UI", "Grassroots accessibility for regional officers & trainees"),
        ("Architecture & Cost", "❌ Monolithic proprietary BI silos (per-seat fees)", "✔ Modern FastAPI + Next.js 14 + PostgreSQL / Docker", "Zero proprietary license fees; open-source national scale"),
        ("Decision Actionability", "❌ 18-month delayed academic research reports", "✔ Instant 1-click CSV/JSON briefs & scenario sandbox", "Decision-ready policy execution within 5 minutes"),
        ("Deployment & Scale", "❌ Heavy multi-server enterprise install", "✔ Single-command Docker & Vercel cloud serverless", "Production-tested live prototype with instant scale")
    ]

    for r_idx, (dim, exist, kyuva, adv) in enumerate(data_rows, start=1):
        bg_color = RGBColor(255, 255, 255) if r_idx % 2 == 1 else RGBColor(241, 245, 249)
        
        cells_content = [
            (dim, True, SLATE_DARK),
            (exist, False, SLATE_MID),
            (kyuva, True, NAVY),
            (adv, False, ROYAL_BLUE)
        ]
        
        for c_idx, (cell_txt, is_bold, text_color) in enumerate(cells_content):
            cell = table.cell(r_idx, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_color
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell.margin_left = Inches(0.06)
            cell.margin_right = Inches(0.06)
            cell.margin_top = Inches(0.04)
            cell.margin_bottom = Inches(0.04)
            
            tf = cell.text_frame
            tf.word_wrap = True
            tf.text = ""
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.LEFT
            run = p.add_run()
            run.text = cell_txt
            run.font.name = "Segoe UI"
            run.font.size = Pt(9.5)
            run.font.bold = is_bold
            run.font.color.rgb = text_color

def main():
    print(f"Loading template: {SRC_TEMPLATE}...")
    prs = pptx.Presentation(SRC_TEMPLATE)

    build_slide_1(prs.slides[0])
    build_slide_2(prs.slides[1])
    build_slide_3(prs.slides[2])
    build_slide_4(prs.slides[3])
    build_slide_5(prs.slides[4])
    build_slide_6(prs.slides[5])

    print(f"Saving presentation to: {OUT_PPT_MAIN}...")
    prs.save(OUT_PPT_MAIN)
    print(f"Saving named presentation to: {OUT_PPT_NAMED}...")
    prs.save(OUT_PPT_NAMED)
    print("SUCCESS: Both presentations generated cleanly!")

if __name__ == "__main__":
    main()
