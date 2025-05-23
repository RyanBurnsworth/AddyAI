import psycopg2
import csv
import os

# === CONFIGURATION ===
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "dbname": "your_database",
    "user": "your_username",
    "password": "your_password"
}

CSV_FILE_PATH = "path/to/your_file.csv"
TARGET_TABLE = "your_table_name"


def import_csv_to_postgres(csv_file, table_name, db_config):
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()

        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)  # Get column names from header row
            columns = ', '.join(headers)
            placeholders = ', '.join(['%s'] * len(headers))
            insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

            # Insert rows
            for row in reader:
                cur.execute(insert_query, row)

        conn.commit()
        print(f"CSV file '{csv_file}' imported successfully into '{table_name}'.")

    except Exception as e:
        print("Error:", e)
        if conn:
            conn.rollback()
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


# === USAGE ===
if __name__ == "__main__":
    import_csv_to_postgres(CSV_FILE_PATH, TARGET_TABLE, DB_CONFIG)
