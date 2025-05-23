import psycopg2

DB_CONFIG = {
    "host": "localhost",
    "dbname": "addyai_db",
    "user": "addyai",
    "password": "Lala2010",
    "port": 5432
}

def create_tables():
    commands = {
        "Campaigns": """
            CREATE TABLE IF NOT EXISTS Campaigns (
                Date DATE,
                Campaign_Id TEXT,
                Campaign_Name TEXT,
                Campaign_Type TEXT,
                Campaign_Status TEXT,
                Clicks INTEGER,
                Impressions INTEGER,
                CTR TEXT,
                Avg_CPC NUMERIC,
                Cost NUMERIC,
                Phone_Calls INTEGER,
                Phone_Impressions INTEGER,
                Conversion_Rate TEXT,
                Conversions INTEGER,
                Cost_Per_Conversion NUMERIC
            );
        """,
        "AdGroups": """
            CREATE TABLE IF NOT EXISTS AdGroups (
                Date DATE,
                Campaign_Id TEXT,
                AdGroup_Id TEXT,
                AdGroup_Name TEXT,
                Campaign_Name TEXT,
                AdGroup_Status TEXT,
                Campaign_Type TEXT,
                Clicks INTEGER,
                Impressions INTEGER,
                CTR TEXT,
                Avg_CPC NUMERIC,
                Cost NUMERIC,
                Phone_Calls INTEGER,
                Phone_Impressions INTEGER,
                Conversion_Rate TEXT,
                Conversions INTEGER,
                Cost_Per_Conversion NUMERIC
            );
        """,
        "Ads": """
            CREATE TABLE IF NOT EXISTS Ads (
                Date DATE,
                AdGroup_Id TEXT,
                Ad_Id TEXT,
                Campaign_Id TEXT,
                Campaign_Name TEXT,
                AdGroup_Name TEXT,
                Campaign_Type TEXT,
                Ad_Status TEXT,
                Ad_Type TEXT,
                Final_Url TEXT,
                Headline_1 TEXT,
                Headline_2 TEXT,
                Headline_3 TEXT,
                Headline_4 TEXT,
                Headline_5 TEXT,
                Headline_6 TEXT,
                Headline_7 TEXT,
                Headline_8 TEXT,
                Headline_9 TEXT,
                Headline_10 TEXT,
                Headline_11 TEXT,
                Headline_12 TEXT,
                Headline_13 TEXT,
                Headline_14 TEXT,
                Headline_15 TEXT,
                Description TEXT,
                Description_1 TEXT,
                Description_2 TEXT,
                Description_3 TEXT,
                Description_4 TEXT,
                Path_1 TEXT,
                Path_2 TEXT,
                Mobile_Final_Url TEXT,
                Tracking_Template TEXT,
                Final_Url_Suffix TEXT,
                Custom_Parameter TEXT,
                Ad_Final_Url TEXT,
                Clicks INTEGER,
                Impressions INTEGER,
                CTR TEXT,
                Avg_CPC NUMERIC,
                Cost NUMERIC,
                Conversions INTEGER,
                Cost_Per_Conversion NUMERIC,
                Conversion_Rate TEXT
            );
        """,
        "Keywords": """
            CREATE TABLE IF NOT EXISTS Keywords (
                Date DATE,
                Campaign_Id TEXT,
                AdGroup_Id TEXT,
                Keyword_Id TEXT,
                Campaign_Name TEXT,
                AdGroup_Name TEXT,
                Keyword TEXT,
                Match_Type TEXT,
                Status TEXT,
                Max_CPC NUMERIC,
                Clicks INTEGER,
                Impressions INTEGER,
                CTR TEXT,
                Avg_CPC NUMERIC,
                Cost NUMERIC,
                Phone_Calls INTEGER,
                Phone_Impressions INTEGER,
                Conversion_Rate TEXT,
                Conversions INTEGER,
                Cost_Per_Conversion NUMERIC
            );
        """
    }

    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        for table_name, ddl in commands.items():
            print(f"Creating table {table_name}...")
            cur.execute(ddl)

        conn.commit()
        cur.close()
        conn.close()
        print("All tables created successfully.")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()
