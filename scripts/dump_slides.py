import pptx

prs = pptx.Presentation('C:/Users/anura/Downloads/legacycoderzzzzzzzz.pptx')

with open('scratch_slide_dump.txt', 'w', encoding='utf-8') as f:
    def dump_shape(shape, path):
        if shape.has_text_frame:
            txt = shape.text_frame.text.strip()
            if txt:
                f.write(f'{path} [{shape.name} id={shape.shape_id} L={shape.left} T={shape.top} W={shape.width} H={shape.height}]:\n')
                for p_idx, p in enumerate(shape.text_frame.paragraphs):
                    p_txt = p.text.strip()
                    if p_txt:
                        runs_info = ' | '.join([f'"{r.text}"(sz={r.font.size}, b={r.font.bold})' for r in p.runs])
                        f.write(f'    P{p_idx}: {p_txt}\n')
                        f.write(f'      runs: {runs_info}\n')
        if shape.has_table:
            table = shape.table
            f.write(f'{path} [TABLE {shape.name} id={shape.shape_id} rows={len(table.rows)} cols={len(table.columns)}]\n')
            for r_idx, row in enumerate(table.rows):
                row_vals = [cell.text.replace('\n', ' ') for cell in row.cells]
                f.write(f'    R{r_idx}: {" | ".join(row_vals)}\n')
        if shape.shape_type == pptx.enum.shapes.MSO_SHAPE_TYPE.GROUP:
            for idx, child in enumerate(shape.shapes):
                dump_shape(child, f'{path}/{shape.name}[{idx}]')

    for s_idx in [3, 4, 5]:
        slide = prs.slides[s_idx]
        f.write(f'============================== SLIDE {s_idx+1} ==============================\n')
        for idx, shape in enumerate(slide.shapes):
            dump_shape(shape, f'S{s_idx+1}[{idx}]')

print('Dumped successfully')
