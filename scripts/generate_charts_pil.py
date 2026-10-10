import os
from PIL import Image, ImageDraw, ImageFont

out_dir = os.path.dirname(os.path.abspath(__file__))

def draw_chart(
    filename,
    title,
    y_max,
    y_ticks,
    categories,
    series1_vals,
    series2_vals,
    width=800,
    height=600,
    unit="%"
):
    img = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Fonts
    font_title = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 28)
    font_label = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
    font_val = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 22)
    font_axis = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 18)

    # Margins
    left_m = 90
    right_m = 40
    top_m = 70
    bottom_m = 80

    chart_w = width - left_m - right_m
    chart_h = height - top_m - bottom_m

    # Title
    draw.text((left_m, 20), title, fill=(20, 30, 45, 255), font=font_title)

    # Colors
    c_blue = (52, 152, 219, 255)      # Seasonal Naive / Baseline
    c_teal = (127, 209, 205, 255)    # KaushalYuva
    c_grid = (220, 226, 235, 255)
    c_axis = (100, 116, 139, 255)

    # Draw Y grid and labels
    for tick in y_ticks:
        y_frac = tick / y_max
        y_pos = top_m + chart_h * (1.0 - y_frac)
        # Grid line
        draw.line([(left_m, y_pos), (width - right_m, y_pos)], fill=c_grid, width=1)
        # Tick text
        tick_str = f"{tick:.1f}" if isinstance(tick, float) else f"{tick}"
        bbox = font_axis.getbbox(tick_str)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((left_m - tw - 12, y_pos - th / 2 - 2), tick_str, fill=c_axis, font=font_axis)

    # Bottom axis line
    draw.line([(left_m, top_m + chart_h), (width - right_m, top_m + chart_h)], fill=c_axis, width=2)

    # Draw bars
    num_cats = len(categories)
    group_w = chart_w / num_cats
    bar_w = 42
    bar_gap = 6

    for i, cat in enumerate(categories):
        group_center = left_m + i * group_w + group_w / 2
        b1_x0 = group_center - bar_w - bar_gap / 2
        b1_x1 = b1_x0 + bar_w
        b2_x0 = group_center + bar_gap / 2
        b2_x1 = b2_x0 + bar_w

        # Bar 1 (Baseline)
        v1 = series1_vals[i]
        b1_h = chart_h * (v1 / y_max)
        b1_y0 = top_m + chart_h - b1_h
        b1_y1 = top_m + chart_h
        draw.rectangle([b1_x0, b1_y0, b1_x1, b1_y1], fill=c_blue)

        # Bar 1 Value Text
        v1_str = f"{v1:.1f}"
        bbox1 = font_val.getbbox(v1_str)
        w1 = bbox1[2] - bbox1[0]
        draw.text((b1_x0 + (bar_w - w1) / 2, b1_y0 - 28), v1_str, fill=(30, 41, 59, 255), font=font_val)

        # Bar 2 (KaushalYuva)
        v2 = series2_vals[i]
        b2_h = chart_h * (v2 / y_max)
        b2_y0 = top_m + chart_h - b2_h
        b2_y1 = top_m + chart_h
        draw.rectangle([b2_x0, b2_y0, b2_x1, b2_y1], fill=c_teal)

        # Bar 2 Value Text
        v2_str = f"{v2:.1f}"
        bbox2 = font_val.getbbox(v2_str)
        w2 = bbox2[2] - bbox2[0]
        draw.text((b2_x0 + (bar_w - w2) / 2, b2_y0 - 28), v2_str, fill=(15, 118, 110, 255), font=font_val)

        # Category label
        bbox_cat = font_label.getbbox(cat)
        w_cat = bbox_cat[2] - bbox_cat[0]
        draw.text((group_center - w_cat / 2, top_m + chart_h + 12), cat, fill=(30, 41, 59, 255), font=font_label)

    img.save(filename, "PNG")
    print(f"Saved: {filename}")

if __name__ == "__main__":
    p1 = os.path.join(out_dir, "chart_wape.png")
    draw_chart(
        p1,
        title="Error in % (lower is better)",
        y_max=10.0,
        y_ticks=[0, 2.5, 5.0, 7.5, 10.0],
        categories=["3M WAPE", "6M WAPE", "12M WAPE"],
        series1_vals=[6.9, 7.6, 8.2],
        series2_vals=[3.7, 3.6, 3.4],
        width=812,
        height=636
    )

    p2 = os.path.join(out_dir, "chart_accuracy.png")
    draw_chart(
        p2,
        title="Accuracy % (higher is better)",
        y_max=100.0,
        y_ticks=[0, 20.0, 40.0, 60.0, 80.0, 100.0],
        categories=["80% PI", "95% PI", "Alignment %"],
        series1_vals=[65.4, 82.1, 42.0],
        series2_vals=[79.8, 95.1, 86.4],
        width=864,
        height=676
    )
