import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv()

class DB:
    def __init__(self):
        try:
            self.conn = mysql.connector.connect(
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                database=os.getenv("DB_NAME"),
            )
            print("Connected to database")
        except Error as e:
            print("DB connection error:", e)

    def query(self, sql, params=None):
        """Safe SELECT query"""
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(sql, params)
        return cursor.fetchall()

    def execute(self, sql, params=None):
        """Safe INSERT/UPDATE/DELETE"""
        cursor = self.conn.cursor()
        cursor.execute(sql, params)
        self.conn.commit()
        return cursor.lastrowid

    def __del__(self):
        try:
            if self.conn.is_connected():
                self.conn.close()
        except:
            pass

if __name__ == "__main__":
    db = DB()
    result = db.query("SELECT database();")
    print("Current database:", result)