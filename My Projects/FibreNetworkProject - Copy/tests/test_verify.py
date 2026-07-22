import sqlite3
import unittest
from datetime import datetime

from app import app, get_db_connection


class VerifyPaymentTest(unittest.TestCase):
    def setUp(self):
        # Insert a test customer and an unverified payment
        self.conn = get_db_connection()
        cur = self.conn.cursor()
        cur.execute("INSERT INTO customer (box_id, name, phone, phone_number, subscription, status, paid_status, connection_id, plan_amount, upi_id) VALUES (?, ?, ?, ?, ?, ?, 'unpaid', ?, ?, ?)",
                    ('TESTB1', 'Test User', '9998887777', '9998887777', 250, 'active', 'TESTB1', 250, 'test@upi'))
        self.conn.commit()
        self.customer_id = cur.lastrowid

        today = datetime.now().strftime('%Y-%m-%d')
        month = datetime.now().strftime('%Y-%m')
        cur.execute("INSERT INTO payment (customer_id, phone, amount, payment_date, month, upi_id, transaction_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    (None, '9998887777', 250, today, month, 'test@upi', 'TESTTXN123', 'Needs Verification'))
        self.conn.commit()
        self.payment_id = cur.lastrowid

    def tearDown(self):
        cur = self.conn.cursor()
        cur.execute('DELETE FROM payment WHERE transaction_id = ?', ('TESTTXN123',))
        cur.execute('DELETE FROM customer WHERE box_id = ?', ('TESTB1',))
        self.conn.commit()
        self.conn.close()

    def test_verify_marks_paid_and_associates_customer(self):
        client = app.test_client()
        # POST to verify endpoint
        resp = client.post(f'/verify-payment/{self.payment_id}', follow_redirects=True)
        self.assertIn(resp.status_code, (200, 302))

        # Check payment status changed to Paid
        conn = get_db_connection()
        row = conn.execute('SELECT status, customer_id FROM payment WHERE payment_id = ?', (self.payment_id,)).fetchone()
        conn.close()
        self.assertIsNotNone(row)
        self.assertEqual(row['status'], 'Paid')
        # If customer associated by phone, customer_id should be set
        self.assertIsNotNone(row['customer_id'])


if __name__ == '__main__':
    unittest.main()
