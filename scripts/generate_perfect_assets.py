import os
import math
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = r"c:\Users\anura\Downloads\SIH26246\scripts\perfect_assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

def get_font(size, bold=False):
    # Try Windows system fonts
    font_names = [
        "segoeuib.ttf" if bold else "segoeui.ttf",
        "arialbd.ttf" if bold else "arial.ttf",
        "calibrib.ttf" if bold else "calibri.ttf"
    ]
    fonts_dir = r"C:\Windows\Fonts"
    for fn in font_names:
        fp = os.path.join(fonts_dir, fn)
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                pass
    return ImageFont.load_default()

def generate_slide4_wape_chart():
    """Generates the high-resolution Before vs After accuracy chart for Slide 4."""
    w, h = 1600, 950
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Rounded card background
    draw.rounded_rectangle([10, 10, w - 10, h - 10], radius=24, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)

    # Sub-header / Legend
    font_legend = get_font(28, bold=True)
    font_sub = get_font(22, bold=False)
    
    # Legend boxes
    draw.rounded_rectangle([60, 40, 90, 70], radius=6, fill=(239, 68, 68, 255)) # Red/Coral for Baseline
    draw.text((105, 42), "Baseline (Seasonal Naive 12M Lag)", font=font_legend, fill=(51, 65, 85, 255))

    draw.rounded_rectangle([720, 40, 750, 70], radius=6, fill=(14, 165, 233, 255)) # Sky/Cyan for KaushalYuva
    draw.text((765, 42), "KaushalYuva Production Blend (LGBM + Theta + ETS)", font=font_legend, fill=(15, 23, 42, 255))

    # Metrics
    # 5 Categories: 3M WAPE, 6M WAPE, 12M WAPE, Directional Acc (%), 80% PI Coverage (%)
    categories = [
        ("3M WAPE\n(Lower is better)", 6.94, 3.71, "%", True),
        ("6M WAPE\n(Lower is better)", 7.62, 3.58, "%", True),
        ("12M WAPE\n(Lower is better)", 8.15, 3.41, "%", True),
        ("Directional Acc\n(Higher is better)", 65.4, 86.4, "%", False),
        ("80% PI Coverage\n(Higher is better)", 79.8, 95.1, "%", False),
    ]

    # Chart Plot Area
    chart_x0 = 80
    chart_y0 = 130
    chart_x1 = w - 60
    chart_y1 = h - 170

    # Draw grid lines
    draw.line([(chart_x0, chart_y1), (chart_x1, chart_y1)], fill=(203, 213, 225, 255), width=2)
    for gy in range(1, 5):
        y_pos = chart_y1 - gy * (chart_y1 - chart_y0) / 4
        draw.line([(chart_x0, y_pos), (chart_x1, y_pos)], fill=(241, 245, 249, 255), width=2)

    cat_w = (chart_x1 - chart_x0) / len(categories)
    font_val = get_font(26, bold=True)
    font_cat = get_font(24, bold=True)
    font_unit = get_font(20, bold=False)

    for i, (cat_name, b_val, k_val, unit, is_error) in enumerate(categories):
        center_x = chart_x0 + i * cat_w + cat_w / 2
        bar_w = 64
        spacing = 16

        # Normalize height based on scale
        max_scale = 100.0 if not is_error else 10.0
        b_h = (b_val / max_scale) * (chart_y1 - chart_y0 - 50)
        k_h = (k_val / max_scale) * (chart_y1 - chart_y0 - 50)

        # Baseline bar
        bx0 = center_x - bar_w - spacing / 2
        by0 = chart_y1 - b_h
        draw.rounded_rectangle([bx0, by0, bx0 + bar_w, chart_y1], radius=8, fill=(248, 113, 113, 230))
        # Value label
        b_text = f"{b_val:.1f}{unit}"
        draw.text((bx0 + bar_w / 2 - 25, by0 - 36), b_text, font=font_val, fill=(220, 38, 38, 255))

        # KaushalYuva bar
        kx0 = center_x + spacing / 2
        ky0 = chart_y1 - k_h
        draw.rounded_rectangle([kx0, ky0, kx0 + bar_w, chart_y1], radius=8, fill=(14, 165, 233, 255))
        # Value label
        k_text = f"{k_val:.1f}{unit}"
        draw.text((kx0 + bar_w / 2 - 25, ky0 - 36), k_text, font=font_val, fill=(2, 132, 199, 255))

        # Improvement pill above
        if is_error:
            pct_imp = f"-{(1 - k_val/b_val)*100:.1f}%"
            pill_fill = (240, 253, 244, 255)
            pill_border = (34, 197, 94, 255)
            pill_text_color = (22, 101, 52, 255)
        else:
            pct_imp = f"+{(k_val - b_val):.1f}%"
            pill_fill = (240, 253, 244, 255)
            pill_border = (34, 197, 94, 255)
            pill_text_color = (22, 101, 52, 255)

        pill_w, pill_h = 100, 34
        pill_x = center_x - pill_w / 2
        pill_y = min(by0, ky0) - 78
        draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=12, fill=pill_fill, outline=pill_border, width=2)
        draw.text((pill_x + 16, pill_y + 4), pct_imp, font=get_font(20, bold=True), fill=pill_text_color)

        # Category labels
        lines = cat_name.split("\n")
        draw.text((center_x - 70, chart_y1 + 16), lines[0], font=font_cat, fill=(15, 23, 42, 255))
        if len(lines) > 1:
            draw.text((center_x - 65, chart_y1 + 48), lines[1], font=font_unit, fill=(100, 116, 139, 255))

    # Bottom summary footnote
    font_foot = get_font(22, bold=False)
    foot_text = "Rolling-origin backtest: 8,704 observations * 6 rolling origins * strict t-1 lag (zero data leakage) * MASE: 1.028 -> 0.553"
    draw.text((w / 2 - 470, h - 50), foot_text, font=font_foot, fill=(71, 85, 105, 255))

    out_path = os.path.join(ASSETS_DIR, "chart_wape_clean.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")
    return out_path

def generate_slide4_roadmap():
    """Generates the clean 3-tier national expansion roadmap for Slide 4."""
    w, h = 1100, 750
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # 3 Steps: Phase 1 (Pilots), Phase 2 (State scale), Phase 3 (Apex MSDE command)
    steps = [
        ("Phase 1: District Pilots", "16 Districts across 5 States\nDirect NCS + e-Shram Pipeline\nPuLP LP Validation with DSCs", (14, 165, 233)),
        ("Phase 2: State Expansion", "36 States & Union Territories\nSSDM Portal API Integration\nCross-District Commute Multipliers", (245, 158, 11)),
        ("Phase 3: National Command", "All 780+ Districts (Pan-India)\nMSDE Central Allocation Engine\nPMKVY 4.0 & SIDH Integration", (34, 197, 94))
    ]

    card_h = 190
    card_w = w - 40
    start_y = 20

    for i, (title, desc, color) in enumerate(steps):
        cy = start_y + i * (card_h + 55)
        # Card background
        draw.rounded_rectangle([20, cy, 20 + card_w, cy + card_h], radius=18, fill=(248, 250, 252, 255), outline=color, width=3)
        # Number badge
        draw.rounded_rectangle([40, cy + 30, 120, cy + 110], radius=16, fill=color)
        draw.text((65, cy + 42), f"0{i+1}", font=get_font(42, bold=True), fill=(255, 255, 255, 255))
        # Title
        draw.text((150, cy + 32), title, font=get_font(32, bold=True), fill=(15, 23, 42, 255))
        # Description
        desc_lines = desc.split("\n")
        for d_idx, d_line in enumerate(desc_lines):
            draw.text((150, cy + 80 + d_idx * 30), f"* {d_line}", font=get_font(23, bold=False), fill=(51, 65, 85, 255))

        # Connecting arrow
        if i < 2:
            arrow_y = cy + card_h + 8
            draw.polygon([(w/2 - 15, arrow_y), (w/2 + 15, arrow_y), (w/2, arrow_y + 36)], fill=(148, 163, 184, 255))

    out_path = os.path.join(ASSETS_DIR, "roadmap_kaushalyuva.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")
    return out_path

def generate_slide5_capex_chart():
    """Generates the high-resolution Capex Optimization Donut Chart for Slide 5."""
    w, h = 1400, 850
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Donut slices data
    slices = [
        ("Green Energy & Industry 4.0 Labs (Solar PV, EV, CNC)", 45, (14, 165, 233)), # Sky Blue
        ("Advanced Faculty Upskilling & Master Trainer Certs", 25, (16, 185, 129)), # Emerald
        ("Digital Infrastructure & High-Speed Simulators", 15, (245, 158, 11)), # Amber
        ("Industry Apprenticeships & On-Job Stipends", 10, (139, 92, 246)), # Violet
        ("Continuous NCO Audits & Platform Maintenance", 5, (239, 68, 68)) # Rose
    ]

    center_x, center_y = 350, h / 2
    outer_r = 260
    inner_r = 150

    start_deg = -90
    for label, pct, color in slices:
        sweep_deg = pct * 3.6
        end_deg = start_deg + sweep_deg
        draw.pieslice([center_x - outer_r, center_y - outer_r, center_x + outer_r, center_y + outer_r],
                      start=start_deg, end=end_deg, fill=color)
        start_deg = end_deg

    # Cut out donut hole
    draw.ellipse([center_x - inner_r, center_y - inner_r, center_x + inner_r, center_y + inner_r], fill=(255, 255, 255, 255))

    # Center Text
    font_center_title = get_font(38, bold=True)
    font_center_sub = get_font(24, bold=False)
    draw.text((center_x - 85, center_y - 45), "CAPEX", font=font_center_title, fill=(15, 23, 42, 255))
    draw.text((center_x - 110, center_y + 10), "OPTIMIZATION", font=font_center_sub, fill=(100, 116, 139, 255))

    # Legend on right side
    leg_x = 720
    leg_y_start = 120
    font_leg_pct = get_font(34, bold=True)
    font_leg_title = get_font(26, bold=True)
    font_leg_sub = get_font(22, bold=False)

    for i, (label, pct, color) in enumerate(slices):
        cy = leg_y_start + i * 135
        # Color pill
        draw.rounded_rectangle([leg_x, cy, leg_x + 95, cy + 45], radius=10, fill=color)
        draw.text((leg_x + 18, cy + 5), f"{pct}%", font=font_leg_pct, fill=(255, 255, 255, 255))

        # Title & breakdown
        parts = label.split(" (")
        main_t = parts[0]
        sub_t = "(" + parts[1] if len(parts) > 1 else ""
        draw.text((leg_x + 115, cy + 2), main_t, font=font_leg_title, fill=(15, 23, 42, 255))
        if sub_t:
            draw.text((leg_x + 115, cy + 42), sub_t, font=font_leg_sub, fill=(100, 116, 139, 255))

    out_path = os.path.join(ASSETS_DIR, "chart_capex_donut.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")
    return out_path

def generate_slide2_arch_diagram():
    """Generates the Technical Architecture flow diagram for Slide 2."""
    w, h = 1400, 1000
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # 5 Layer Cards
    layers = [
        ("1. Data Ingestion Layer", "NCS Portal (Vacancies) * e-Shram (Unorganized) * PLFS (Macro) * DGT/ITI Capacity", (30, 41, 59)),
        ("2. Semantic Normalization Layer", "3-Tier Cascaded Normalizer: Exact Match -> Token Jaccard -> Semantic Vector Embeddings -> NCO-2015 & LGD", (14, 165, 233)),
        ("3. Predictive Demand Engine", "Tri-Model Ensemble: LightGBM + Theta + ETS (Zero-Leakage Rolling Horizon 3M, 6M, 12M)", (99, 102, 241)),
        ("4. Supply Funnel & LP Optimization", "4-Stage Funnel (Cap -> Pass -> Part -> Ready) + PuLP Simplex LP (Seat Rebalancing with Donor Guardrails)", (16, 185, 129)),
        ("5. Decision Delivery & Policy Briefs", "Bilingual Web UI (Hindi & English) * 13 REST APIs * 1-Click CSV/PDF Briefs for Collectors & MSDE", (245, 158, 11))
    ]

    card_h = 140
    card_w = w - 80
    start_y = 30

    for i, (title, subtitle, color) in enumerate(layers):
        cy = start_y + i * (card_h + 50)
        # Rounded card
        draw.rounded_rectangle([40, cy, 40 + card_w, cy + card_h], radius=16, fill=(248, 250, 252, 255), outline=color, width=3)
        # Left accent pill
        draw.rounded_rectangle([40, cy, 60, cy + card_h], radius=6, fill=color)
        # Title
        draw.text((80, cy + 22), title, font=get_font(32, bold=True), fill=color)
        # Subtitle
        draw.text((80, cy + 76), subtitle, font=get_font(23, bold=False), fill=(51, 65, 85, 255))

        # Down arrow connecting to next layer
        if i < len(layers) - 1:
            ay = cy + card_h + 8
            draw.polygon([(w/2 - 14, ay), (w/2 + 14, ay), (w/2, ay + 32)], fill=(148, 163, 184, 255))

    out_path = os.path.join(ASSETS_DIR, "arch_diagram_kaushalyuva.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")
    return out_path

def generate_slide3_process_flow():
    """Generates the Process Flow Diagram for Slide 3."""
    w, h = 1800, 600
    img = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # 5 Pipeline Steps in a horizontal flow
    steps = [
        ("Step 1: Ingest", "NCS, e-Shram,\nPLFS & ITI feeds", (15, 23, 42)),
        ("Step 2: Normalize", "3-Tier Matching to\nNCO-2015 & LGD", (14, 165, 233)),
        ("Step 3: Forecast", "LightGBM + Theta\n3M-12M Projections", (99, 102, 241)),
        ("Step 4: Optimize", "PuLP Simplex LP\nGuarded Transfers", (16, 185, 129)),
        ("Step 5: Deliver", "Bilingual Dashboard\n1-Click Policy Briefs", (245, 158, 11))
    ]

    card_w = 300
    card_h = 480
    gap = 45
    start_x = 40
    start_y = 60

    for i, (title, desc, color) in enumerate(steps):
        cx = start_x + i * (card_w + gap)
        # Card
        draw.rounded_rectangle([cx, start_y, cx + card_w, start_y + card_h], radius=20, fill=(248, 250, 252, 255), outline=color, width=3)
        # Top color badge
        draw.rounded_rectangle([cx, start_y, cx + card_w, start_y + 110], radius=18, fill=color)
        draw.text((cx + 25, start_y + 35), title, font=get_font(30, bold=True), fill=(255, 255, 255, 255))
        # Description
        lines = desc.split("\n")
        for l_idx, l in enumerate(lines):
            draw.text((cx + 30, start_y + 160 + l_idx * 45), l, font=get_font(26, bold=False), fill=(30, 41, 59, 255))

        # Checkmark badge at bottom
        draw.rounded_rectangle([cx + 30, start_y + card_h - 90, cx + card_w - 30, start_y + card_h - 30], radius=12, fill=(240, 253, 244, 255), outline=(34, 197, 94, 255), width=2)
        draw.text((cx + 70, start_y + card_h - 75), "VERIFIED", font=get_font(22, bold=True), fill=(22, 101, 52, 255))

        # Arrow between cards
        if i < len(steps) - 1:
            ax = cx + card_w + 8
            ay = start_y + card_h / 2
            draw.polygon([(ax, ay - 14), (ax, ay + 14), (ax + 28, ay)], fill=(148, 163, 184, 255))

    out_path = os.path.join(ASSETS_DIR, "flowchart_process_kaushalyuva.png")
    img.save(out_path, "PNG")
    print(f"Saved: {out_path}")
    return out_path

if __name__ == "__main__":
    generate_slide4_wape_chart()
    generate_slide4_roadmap()
    generate_slide5_capex_chart()
    generate_slide2_arch_diagram()
    generate_slide3_process_flow()
    print("All perfect assets generated successfully!")
