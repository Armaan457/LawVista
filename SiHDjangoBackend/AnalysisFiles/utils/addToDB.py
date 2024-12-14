import sqlite3

# Step 1: Connect to SQLite database
conn = sqlite3.connect('../../db.sqlite3')
cursor = conn.cursor()

# Step 2: Query all records from the 'cases' table
cursor.execute('SELECT * FROM cases')
rows = cursor.fetchall()

# Step 3: Print all records
for row in rows:
    print(row)

# Close the connection
conn.close()