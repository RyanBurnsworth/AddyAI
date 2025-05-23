import os
import glob

BASE_DIR = "."
FOLDERS = ["Campaigns", "AdGroups", "Ads", "Keywords"]

def rename_csv_files_in_folder(folder_path):
    csv_files = sorted(glob.glob(os.path.join(folder_path, "*.csv")))

    if not csv_files:
        print(f"No CSV files found in {folder_path}")
        return

    base_name = os.path.splitext(os.path.basename(csv_files[0]))[0]
    base_name = base_name.split('(')[0].strip()  # Remove (1), (2), etc.
    
    for i, file_path in enumerate(csv_files, start=1):
        ext = os.path.splitext(file_path)[1]
        new_name = f"{base_name}-{i}{ext}"
        new_path = os.path.join(folder_path, new_name)
        
        try:
            os.rename(file_path, new_path)
            print(f"Renamed: {file_path} -> {new_path}")
        except Exception as e:
            print(f"Failed to rename {file_path}: {e}")

def process_all_folders():
    for folder in FOLDERS:
        folder_path = os.path.join(BASE_DIR, folder)
        print(f"Processing folder: {folder_path}")
        rename_csv_files_in_folder(folder_path)

if __name__ == "__main__":
    process_all_folders()
