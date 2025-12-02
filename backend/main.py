import mysql.connector

class DB:
    def __init__(self):
        self.conn = self.create_connection(
        # Establishes a connection to the MySQL database.
        
            host='127.0.0.1',
            user='root',
            password='Jet#42!@40,?00mysql',
            database='FitnessApp'
        )

        self.db_cursor = self.conn.cursor()

    def executeQuery(self, sql, values=None):
        # Executes a given SQL query with optional values.
        self.db_cursor.execute(sql, values or ())
        return self.db_cursor

        
    def create_connection(self, host, user, password, database):
        # Creates and returns a connection to the MySQL database.
        return mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
    
    def close_connection(self):
        # Closes the database connection.
        if self.conn.is_connected():
            self.db_cursor.close()
            self.conn.close()
        print("Database connection closed.")

if __name__ == "__main__":
    db = DB()
    # Example usage
    result = db.executeQuery("SELECT DATABASE();")
    print("Connected to database:", result.fetchone())

