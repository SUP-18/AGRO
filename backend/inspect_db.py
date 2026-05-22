import os
import sqlite3

db_path = r'c:\Users\Hp\Desktop\AGRO\backend\agropredict.db'
print(f"Database path: {db_path}")
if not os.path.exists(db_path):
    print("Database file does not exist!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get table list
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f"Tables in database: {tables}")

# If disease_reports exists, show its column names
for table in tables:
    table_name = table[0]
    cursor.execute(f"PRAGMA table_info({table_name});")
    columns = cursor.fetchall()
    print(f"\nTable: {table_name}")
    for col in columns:
        print(f"  Column: {col[1]} ({col[2]})")

# Print recent records from disease_reports and yield_predictions
try:
    cursor.execute("SELECT * FROM disease_reports ORDER BY id DESC LIMIT 5;")
    rows = cursor.fetchall()
    print(f"\nRecent rows in disease_reports: {len(rows)}")
    for r in rows:
        print(f"  {r}")
except Exception as e:
    print(f"\nError reading disease_reports: {e}")

try:
    cursor.execute("SELECT * FROM yield_predictions ORDER BY id DESC LIMIT 5;")
    rows = cursor.fetchall()
    print(f"\nRecent rows in yield_predictions: {len(rows)}")
    for r in rows:
        print(f"  {r}")
except Exception as e:
    print(f"\nError reading yield_predictions: {e}")

conn.close()
