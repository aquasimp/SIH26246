import sqlite3
import pandas as pd

conn = sqlite3.connect('data/kaushal_pulse.db')
cursor = conn.cursor()
tables = [r[0] for r in cursor.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()]
print("Tables in DB:", tables)

for t in tables:
    count = cursor.execute(f"SELECT count(*) FROM {t}").fetchone()[0]
    print(f"Table {t}: {count} rows")

if 'sih_monthly_intelligence' in tables:
    df = pd.read_sql_query("SELECT * FROM sih_monthly_intelligence", conn)
    print("\nsih_monthly_intelligence columns:", df.columns.tolist())
    print("Districts in sih_monthly_intelligence:", sorted(df['district'].dropna().unique().tolist()))
    if 'state' in df.columns:
        print("States in sih_monthly_intelligence:", sorted(df['state'].dropna().unique().tolist()))
    if 'occupation_title' in df.columns:
        print("Occupations (count={}):".format(len(df['occupation_title'].unique())), sorted(df['occupation_title'].dropna().unique().tolist()))
    if 'nco_code' in df.columns:
        print("NCO codes (count={}):".format(len(df['nco_code'].unique())), sorted(df['nco_code'].dropna().unique().tolist()))
    if 'month_year' in df.columns:
        print("Month/Year min/max:", df['month_year'].min(), "to", df['month_year'].max())

if 'monthly_district_trade_intelligence' in tables:
    df_m = pd.read_sql_query("SELECT * FROM monthly_district_trade_intelligence", conn)
    print("\nmonthly_district_trade_intelligence columns:", df_m.columns.tolist())
    print("Districts in monthly_district_trade_intelligence:", sorted(df_m['district'].dropna().unique().tolist()))
    if 'state' in df_m.columns:
        print("States in monthly_district_trade_intelligence:", sorted(df_m['state'].dropna().unique().tolist()))
    if 'occupation_title' in df_m.columns:
        print("Occupations in monthly_district_trade_intelligence:", sorted(df_m['occupation_title'].dropna().unique().tolist()))
    if 'month_year' in df_m.columns:
        print("Month/Year min/max:", df_m['month_year'].min(), "to", df_m['month_year'].max())

conn.close()
