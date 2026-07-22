import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_DIR = os.path.join(BASE_DIR, 'database')
DATABASE = os.path.join(DATABASE_DIR, 'fiber.db')

os.makedirs(DATABASE_DIR, exist_ok=True)

# Recreate database schema for UPI-based payment matching
conn = sqlite3.connect(DATABASE)
c = conn.cursor()

c.execute('''DROP TABLE IF EXISTS unmatched_transactions''')
c.execute('''DROP TABLE IF EXISTS payment''')
c.execute('''DROP TABLE IF EXISTS customer''')

c.execute('''
CREATE TABLE customer (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    box_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    subscription REAL NOT NULL,
    status TEXT NOT NULL,
    paid_status TEXT NOT NULL DEFAULT 'unpaid',
    connection_id TEXT,
    plan_amount REAL,
    upi_id TEXT
)
''')

c.execute('''
CREATE TABLE payment (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    phone TEXT,
    amount REAL NOT NULL,
    payment_date TEXT NOT NULL,
    month TEXT NOT NULL,
    upi_id TEXT,
    transaction_id TEXT UNIQUE,
    status TEXT NOT NULL,
    FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
)
''')

c.execute('''
CREATE TABLE unmatched_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_description TEXT,
    amount REAL,
    payment_date TEXT,
    reason TEXT,
    logged_at TEXT DEFAULT CURRENT_TIMESTAMP
)
''')

conn.commit()
conn.close()

print("Database schema created with customers, payments, and unmatched logs.")
