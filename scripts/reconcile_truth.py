import sqlite3
import pandas as pd
import json

conn = sqlite3.connect('data/kaushal_pulse.db')
df_sih = pd.read_sql_query('SELECT * FROM sih_monthly_intelligence', conn)

print('--- SIH MONTHLY INTELLIGENCE (GROUND TRUTH) ---')
states = sorted(df_sih['state'].unique().tolist())
districts = sorted(df_sih['district'].unique().tolist())
print(f'States ({len(states)}): {states}')
print(f'Districts ({len(districts)}): {districts}')
print(f'Trades ({df_sih["nco_code"].nunique()}):')
trades = df_sih[['nco_code', 'occupation', 'sector']].drop_duplicates().sort_values('nco_code')
for _, row in trades.iterrows():
    print(f'  {row["nco_code"]}: {row["occupation"]} [{row["sector"]}]')

print('\nDistricts by state:')
for st in states:
    dists = sorted(df_sih[df_sih['state'] == st]['district'].unique().tolist())
    print(f'  {st} ({len(dists)}): {dists}')

# Now check data/districts.json and data/occupations.json if they exist
try:
    with open('data/districts.json', 'r', encoding='utf-8') as f:
        dj = json.load(f)
        print(f'\ndata/districts.json count: {len(dj)}')
        print('Districts in data/districts.json:', sorted([d.get('name') or d.get('district') for d in dj]))
except Exception as e:
    print('districts.json error:', e)

try:
    with open('data/occupations.json', 'r', encoding='utf-8') as f:
        oj = json.load(f)
        print(f'\ndata/occupations.json count: {len(oj)}')
        print('Occupations in data/occupations.json:', sorted([o.get('title') or o.get('occupation') for o in oj]))
except Exception as e:
    print('occupations.json error:', e)

conn.close()
