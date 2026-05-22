import sqlite3
conn = sqlite3.connect('instance/agropredict.db')
cursor = conn.cursor()
cursor.execute("SELECT id, username, email, password_hash FROM users")
rows = cursor.fetchall()
for row in rows:
    print(row)
conn.close()
