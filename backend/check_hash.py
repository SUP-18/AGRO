import sqlite3
conn = sqlite3.connect('agropredict.db')
cursor = conn.cursor()
cursor.execute("SELECT password_hash FROM users WHERE email='farmer@agropredict.com'")
row = cursor.fetchone()
print(f"Hash: {row}")
conn.close()
