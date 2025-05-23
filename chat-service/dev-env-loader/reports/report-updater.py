import os
import glob
import time
import pandas as pd
import psycopg2
from datetime import datetime, timedelta

# === CONFIGURATION ===
BASE_DIR = "."
FOLDERS = ["Campaigns", "AdGroups", "Ads", "Keywords"]
START_DATE = datetime(2025, 3, 1)

# Database connection
DB_CONFIG = {
    "host": "localhost",
    "dbname": "addyai_db",
    "user": "addyai",
    "password": "Lala2010",
    "port": 5432
}

# Drop and rename configurations per folder
drop_rename_config = {
    "Campaigns": {
        "drop": ["Currency code"],
        "rename": {
            "Campaign ID": "Campaign_Id",
            "Campaign": "Campaign_Name",
            "Campaign type": "Campaign_Type",
            "Campaign state": "Campaign_Status",
            "Clicks": "Clicks",
            "Impr.": "Impressions",
            "CTR": "CTR",
            "Avg. CPC": "Avg_CPC",
            "Cost": "Cost",
            "Phone calls": "Phone_Calls",
            "Phone impr.": "Phone_Impressions",
            "Conv. rate": "Conversion_Rate",
            "Conversions": "Conversions",
            "Cost / conv.": "Cost_Per_Conversion"
        }
    },
    "AdGroups": {
        "drop": ["Currency code"],
        "rename": {
            "Campaign ID": "Campaign_Id",
            "Ad group ID": "AdGroup_Id",
            "Ad group": "AdGroup_Name",
            "Campaign": "Campaign_Name",
            "Ad group state": "AdGroup_Status",
            "Campaign type": "Campaign_Type",
            "Clicks": "Clicks",
            "Impr.": "Impressions",
            "CTR": "CTR",
            "Avg. CPC": "Avg_CPC",
            "Cost": "Cost",
            "Phone calls": "Phone_Calls",
            "Phone impr.": "Phone_Impressions",
            "Conv. rate": "Conversion_Rate",
            "Conversions": "Conversions",
            "Cost / conv.": "Cost_Per_Conversion"
        }
    },
    "Ads": {
        "drop": [
            "Headline 1 position", "Headline 2 position", "Headline 3 position",
            "Headline 4 position", "Headline 5 position", "Headline 6 position",
            "Headline 7 position", "Headline 8 position", "Headline 9 position",
            "Headline 10 position", "Headline 11 position", "Headline 12 position",
            "Headline 13 position", "Headline 14 position", "Headline 15 position",
            "Description 1 position", "Description 2 position", "Description 3 position",
            "Description 4 position", "Call reporting", "Call conversion",
            "Business name", "Country", "Phone number", "Verification URL",
            "Auto-applied ad suggestion", "Currency code"
        ],
        "rename": {
            "Campaign ID": "Campaign_Id",
            "Ad group ID": "AdGroup_Id",
            "Ad ID": "Ad_Id",
            "Campaign": "Campaign_Name",
            "Ad group": "AdGroup_Name",
            "Campaign type": "Campaign_Type",
            "Ad state": "Ad_Status",
            "Ad type": "Ad_Type",
            "Final URL": "Final_Url",
            "Headline 1": "Headline_1",
            "Headline 2": "Headline_2",
            "Headline 3": "Headline_3",
            "Headline 4": "Headline_4",
            "Headline 5": "Headline_5",
            "Headline 6": "Headline_6",
            "Headline 7": "Headline_7",
            "Headline 8": "Headline_8",
            "Headline 9": "Headline_9",
            "Headline 10": "Headline_10",
            "Headline 11": "Headline_11",
            "Headline 12": "Headline_12",
            "Headline 13": "Headline_13",
            "Headline 14": "Headline_14",
            "Headline 15": "Headline_15",
            "Description": "Description",
            "Description 1": "Description_1",
            "Description 2": "Description_2",
            "Description 3": "Description_3",
            "Description 4": "Description_4",
            "Path 1": "Path_1",
            "Path 2": "Path_2",
            "Mobile final URL": "Mobile_Final_Url",
            "Tracking template": "Tracking_Template",
            "Final URL suffix": "Final_Url_Suffix",
            "Custom parameter": "Custom_Parameter",
            "Ad final URL": "Ad_Final_Url",
            "Clicks": "Clicks",
            "Impr.": "Impressions",
            "CTR": "CTR",
            "Avg. CPC": "Avg_CPC",
            "Cost": "Cost",
            "Conversions": "Conversions",
            "Cost / conv.": "Cost_Per_Conversion",
            "Conv. rate": "Conversion_Rate"
        }
    },
    "Keywords": {
        "drop": ["Currency code"],
        "rename": {
            "Campaign ID": "Campaign_Id",
            "Ad group ID": "AdGroup_Id",
            "Keyword ID": "Keyword_Id",
            "Campaign": "Campaign_Name",
            "Ad group": "AdGroup_Name",
            "Search keyword": "Keyword",
            "Search keyword match type": "Match_Type",
            "Search keyword status": "Status",
            "Keyword max CPC": "Max_CPC",
            "Clicks": "Clicks",
            "Impr.": "Impressions",
            "CTR": "CTR",
            "Avg. CPC": "Avg_CPC",
            "Cost": "Cost",
            "Phone calls": "Phone_Calls",
            "Phone impr.": "Phone_Impressions",
            "Conv. rate": "Conversion_Rate",
            "Conversions": "Conversions",
            "Cost / conv.": "Cost_Per_Conversion"
        }
    }
}

def clean_csv_to_dataframe(filepath, drop_cols, rename_cols, report_date):
    df = pd.read_csv(filepath, skiprows=2, on_bad_lines='skip')
    df = df.drop(columns=drop_cols, errors='ignore')
    df = df.rename(columns=rename_cols)
    df.insert(0, "Date", report_date.date())
    return df

def insert_dataframe_to_postgres(df, table_name, conn):
    cols = ",".join(df.columns)
    placeholders = ",".join(["%s"] * len(df.columns))
    values = [tuple(x) for x in df.to_numpy()]
    with conn.cursor() as cur:
        cur.executemany(
            f"INSERT INTO {table_name} ({cols}) VALUES ({placeholders})",
            values
        )
    conn.commit()
    time.sleep(1)

def process_all_folders():
    conn = psycopg2.connect(**DB_CONFIG)

    for folder in FOLDERS:
        folder_path = os.path.join(BASE_DIR, folder)

        print("FOLDER PATH: " + folder_path)
        
        csv_files = sorted(
            glob.glob(os.path.join(folder_path, "*.csv")),
            key=os.path.getmtime
        )        

        drop_cols = drop_rename_config[folder]["drop"]
        rename_cols = drop_rename_config[folder]["rename"]

        for i, file_path in enumerate(csv_files):
            report_date = START_DATE + timedelta(days=i)
            try:
                df = clean_csv_to_dataframe(file_path, drop_cols, rename_cols, report_date)
                insert_dataframe_to_postgres(df, folder, conn)
                print(f"Imported {file_path} for date {report_date.date()}")
            except Exception as e:
                print(f"Failed to process {file_path}: {e}")

    conn.close()

if __name__ == "__main__":
    process_all_folders()