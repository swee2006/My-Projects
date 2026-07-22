import sqlite3
from datetime import datetime
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'database', 'fiber.db')

conn = sqlite3.connect(DATABASE)
c = conn.cursor()

# Reset tables
c.execute('DELETE FROM payment')
c.execute('DELETE FROM customer')

customers = [
    ('B101', 'Ravi Kumar', '9842208262', 250, 'active', 'ravi@okaxis'),
    ('B102', 'Priya Singh', '9876543210', 299, 'active', 'priya@okicici'),
    ('B103', 'Amit Patel', '9123456789', 250, 'active', 'amit@okaxis'),
    ('B104', 'Neha Sharma', '9988776655', 199, 'active', 'neha@sbi'),
    ('B105', 'Rahul Verma', '9555443322', 250, 'active', 'rahul@okaxis'),
    ('B106', 'Anjali Gupta', '9111222333', 299, 'active', 'anjali@okicici'),
    ('B107', 'Vikas Yadav', '9444555666', 250, 'inactive', 'vikas@okaxis'),
    ('B108', 'Pooja Singh', '9777888999', 199, 'active', 'pooja@sbi'),
]

for box_id, name, phone, subscription, status, upi_id in customers:
    c.execute('''
        INSERT INTO customer (
            box_id, name, phone, phone_number, subscription,
            status, paid_status, connection_id, plan_amount, upi_id
        )
        VALUES (?, ?, ?, ?, ?, ?, 'unpaid', ?, ?, ?)
    ''', (
        box_id, name, phone, phone, subscription,
        status, box_id, subscription, upi_id
    ))

today = datetime.now()
current_month = today.strftime('%Y-%m')

payments = [
    ('TXN001', '9842208262', 250, f'{current_month}-01'),
    ('TXN002', '9876543210', 299, f'{current_month}-02'),
    ('TXN003', '9123456789', 250, f'{current_month}-03'),
    ('TXN004', '9988776655', 199, f'{current_month}-05'),
    ('TXN005', '9555443322', 250, f'{current_month}-06'),
]

total = 0
for txn_id, phone, amount, date in payments:
    c.execute('SELECT customer_id, upi_id FROM customer WHERE phone = ? LIMIT 1', (phone,))
    row = c.fetchone()
    customer_id = row[0] if row else None
    upi_id = row[1] if row else None
    c.execute('''
        INSERT INTO payment (
            customer_id, phone, amount, payment_date, month, upi_id, transaction_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        customer_id, phone, amount, date, current_month, upi_id, txn_id, 'Paid'
    ))
    if customer_id:
        c.execute('UPDATE customer SET paid_status = ?, upi_id = ? WHERE customer_id = ?', ('paid', upi_id, customer_id))
    total += amount

conn.commit()
conn.close()

print("✓ Sample data added successfully!")
print("Total Customers: 8")
print("Paid: 5")
print("Unpaid: 3")
print(f"Total Collection: ₹{total}")
