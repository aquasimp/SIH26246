import sys, sqlite3
import pandas as pd
sys.stdout.reconfigure(encoding='utf-8')
from ml.alert_engine import generate_early_warnings

conn = sqlite3.connect('data/kaushal_pulse.db')
df = pd.read_sql('SELECT * FROM sih_monthly_intelligence', conn)
conn.close()

alerts = generate_early_warnings(df)
print(f"Total alerts: {len(alerts)}")
for i, a in enumerate(alerts[:10]):
    print(f"[{i+1}] {a['severity'].upper()} | {a['type']} | {a['title']} | wasted: {a.get('wasted_seats')}")
    print(f"    Trigger: {a['trigger']}")
    print(f"    Rec: {a['recommended_action']}")
    if "context" in a:
        print(f"    Context: {a['context']}")
