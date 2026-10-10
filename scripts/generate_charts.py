import os
import matplotlib.pyplot as plt
import numpy as np

# Output directory
out_dir = os.path.dirname(os.path.abspath(__file__))

# --------------------------------------------------------------------
# Chart 1: Forecast Error WAPE % (Lower is better)
# --------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(4.8, 3.6), dpi=200)
fig.patch.set_facecolor('white')
ax.set_facecolor('white')

categories = ['3M Horizon', '6M Horizon', '12M Horizon']
x = np.arange(len(categories))
width = 0.35

baseline_wape = [6.9, 7.6, 8.2]
kaushalyuva_wape = [3.7, 3.6, 3.4]

rects1 = ax.bar(x - width/2, baseline_wape, width, label='Baseline (Naive)', color='#4A90E2', edgecolor='#2A68B2', linewidth=1.2, zorder=3)
rects2 = ax.bar(x + width/2, kaushalyuva_wape, width, label='KaushalYuva Blend', color='#50E3C2', edgecolor='#1DBB99', linewidth=1.2, zorder=3)

ax.set_ylabel('WAPE % (Lower is better)', fontsize=11, fontweight='bold', color='#1A202C')
ax.set_title('Forecast Error WAPE % (lower is better)', fontsize=12, fontweight='bold', pad=12, color='#0F172A')
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=10, fontweight='bold', color='#1A202C')
ax.set_ylim(0, 10.0)
ax.grid(axis='y', linestyle='--', alpha=0.3, zorder=0)

# Add values above bars
for rect in rects1:
    h = rect.get_height()
    ax.annotate(f'{h:.1f}%',
                xy=(rect.get_x() + rect.get_width() / 2, h),
                xytext=(0, 3), textcoords="offset points",
                ha='center', va='bottom', fontsize=9, fontweight='bold', color='#1A202C')

for rect in rects2:
    h = rect.get_height()
    ax.annotate(f'{h:.1f}%',
                xy=(rect.get_x() + rect.get_width() / 2, h),
                xytext=(0, 3), textcoords="offset points",
                ha='center', va='bottom', fontsize=9, fontweight='bold', color='#00695C')

# Spines styling
for spine in ax.spines.values():
    spine.set_color('#CBD5E1')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
chart1_path = os.path.join(out_dir, 'chart_wape.png')
plt.savefig(chart1_path, dpi=200, bbox_inches='tight')
plt.close()
print(f'Saved Chart 1: {chart1_path}')

# --------------------------------------------------------------------
# Chart 2: Interval Coverage & Accuracy % (Higher is better)
# --------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(4.8, 3.6), dpi=200)
fig.patch.set_facecolor('white')
ax.set_facecolor('white')

categories2 = ['80% PI Coverage', '95% PI Coverage', 'Trend Alignment %']
x2 = np.arange(len(categories2))

baseline_acc = [65.4, 82.1, 42.0]
kaushalyuva_acc = [79.8, 95.1, 86.4]

rects1 = ax.bar(x2 - width/2, baseline_acc, width, label='Baseline', color='#4A90E2', edgecolor='#2A68B2', linewidth=1.2, zorder=3)
rects2 = ax.bar(x2 + width/2, kaushalyuva_acc, width, label='KaushalYuva', color='#50E3C2', edgecolor='#1DBB99', linewidth=1.2, zorder=3)

ax.set_ylabel('Accuracy % (Higher is better)', fontsize=11, fontweight='bold', color='#1A202C')
ax.set_title('Accuracy & Calibration % (higher is better)', fontsize=12, fontweight='bold', pad=12, color='#0F172A')
ax.set_xticks(x2)
ax.set_xticklabels(['80% PI', '95% PI', 'Alignment %'], fontsize=10, fontweight='bold', color='#1A202C')
ax.set_ylim(0, 110.0)
ax.grid(axis='y', linestyle='--', alpha=0.3, zorder=0)

for rect in rects1:
    h = rect.get_height()
    ax.annotate(f'{h:.1f}%',
                xy=(rect.get_x() + rect.get_width() / 2, h),
                xytext=(0, 3), textcoords="offset points",
                ha='center', va='bottom', fontsize=9, fontweight='bold', color='#1A202C')

for rect in rects2:
    h = rect.get_height()
    ax.annotate(f'{h:.1f}%',
                xy=(rect.get_x() + rect.get_width() / 2, h),
                xytext=(0, 3), textcoords="offset points",
                ha='center', va='bottom', fontsize=9, fontweight='bold', color='#00695C')

for spine in ax.spines.values():
    spine.set_color('#CBD5E1')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
chart2_path = os.path.join(out_dir, 'chart_accuracy.png')
plt.savefig(chart2_path, dpi=200, bbox_inches='tight')
plt.close()
print(f'Saved Chart 2: {chart2_path}')
