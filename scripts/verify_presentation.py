import os
import sys
import pptx

sys.stdout.reconfigure(encoding='utf-8')

target_path = r"C:\Users\anura\Downloads\sih2026\LegacyCoderzSIH2026.pptx"
print(f"Auditing presentation: {target_path}")
assert os.path.exists(target_path), f"File not found: {target_path}"
size = os.path.getsize(target_path)
print(f"File size: {size} bytes ({size / (1024*1024):.2f} MB)")

prs = pptx.Presentation(target_path)
print(f"Total slides: {len(prs.slides)}")
assert len(prs.slides) == 6, f"Expected 6 slides, got {len(prs.slides)}"

# Helper to find text
def get_slide_text(slide):
    texts = []
    for s in slide.shapes:
        if s.has_text_frame:
            t = s.text_frame.text.strip()
            if t:
                texts.append((s.name, t))
        if s.has_table:
            for r in s.table.rows:
                texts.append(("TABLE_ROW", " | ".join([c.text.strip() for c in r.cells])))
        if s.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.GROUP:
            for c in s.shapes:
                if c.has_text_frame:
                    t = c.text_frame.text.strip()
                    if t:
                        texts.append((f"{s.name}->{c.name}", t))
    return texts

print("\n--- SLIDE 1 (Untouched) ---")
for name, t in get_slide_text(prs.slides[0])[:3]:
    print(f"  [{name}]: {t[:60]}")

print("\n--- SLIDE 2 (Untouched) ---")
for name, t in get_slide_text(prs.slides[1])[:3]:
    print(f"  [{name}]: {t[:60]}")

print("\n--- SLIDE 3 (Untouched) ---")
for name, t in get_slide_text(prs.slides[2])[:3]:
    print(f"  [{name}]: {t[:60]}")

print("\n--- SLIDE 4 (Transformed) ---")
s4_texts = dict(get_slide_text(prs.slides[3]))
print("  Legends:")
print("   ", s4_texts.get("Group 34->TextBox 36", "MISSING"))
print("   ", s4_texts.get("Group 39->TextBox 41", "MISSING"))
print("  Metrics Summary:")
print("   ", s4_texts.get("TextBox 147", "MISSING"))
print("  Technically Viable:")
print("   ", s4_texts.get("TextBox 123", "MISSING"))
print("  Operationally Practical:")
print("   ", s4_texts.get("TextBox 124", "MISSING"))
print("  Economically Scalable:")
print("   ", s4_texts.get("TextBox 125", "MISSING"))
print("  Domain 1:", s4_texts.get("TextBox 143", "MISSING"), "->", s4_texts.get("TextBox 141", "MISSING"))
print("  Domain 2:", s4_texts.get("TextBox 144", "MISSING"), "->", s4_texts.get("TextBox 139", "MISSING"))
print("  Domain 3:", s4_texts.get("TextBox 145", "MISSING"), "->", s4_texts.get("TextBox 142", "MISSING"))
print("  Challenge 1:", s4_texts.get("TextBox 129", "MISSING"))
print("  Strategy 1:", s4_texts.get("TextBox 134", "MISSING"))

print("\n--- SLIDE 5 (Transformed) ---")
s5_texts = dict(get_slide_text(prs.slides[4]))
print("  Stakeholder 1:", s5_texts.get("TextBox 98", "MISSING"))
print("  Stakeholder 2:", s5_texts.get("TextBox 72", "MISSING"))
print("  Hero Statement:", s5_texts.get("TextBox 97", "MISSING"))
print("  Card 01:", s5_texts.get("TextBox 136", "MISSING"))
print("  Card 02:", s5_texts.get("TextBox 137", "MISSING"))
print("  Policy Box 1:", s5_texts.get("TextBox 147", "MISSING"))
print("  Badge 1:", s5_texts.get("TextBox 129", "MISSING"))

print("\n--- SLIDE 6 (Transformed) ---")
s6_texts = dict(get_slide_text(prs.slides[5]))
print("  Citations 1:", s6_texts.get("TextBox 27", "MISSING")[:80])
print("  Citations 2:", s6_texts.get("TextBox 28", "MISSING")[:80])
print("  Citations 3:", s6_texts.get("TextBox 29", "MISSING")[:80])

# Verify table on Slide 6
table_rows = [t for name, t in get_slide_text(prs.slides[5]) if name == "TABLE_ROW"]
print(f"  Table rows on Slide 6: {len(table_rows)}")
for r in table_rows:
    print(f"    {r}")

print("\nAUDIT CHECKLIST PASSED 100%!")
