import pandas as pd
from pymongo import MongoClient
import os

def import_data_from_folder(folder_path):
    try:
        # Connect to MongoDB
        client = MongoClient("localhost", 27017)  # Update with your MongoDB connection details
        db = client["test6"]  # Replace 'testloh' with your MongoDB database name

        # Iterate through each file in the folder
        for file_name in os.listdir(folder_path):
            if file_name.endswith(".xlsx"):
                file_path = os.path.join(folder_path, file_name)

                # Load the Excel file into a DataFrame, skipping the first row
                df = pd.read_excel(file_path, skiprows=1)

                # Extract the file name (excluding extension) to use as the collection name
                collection_name = os.path.splitext(file_name)[0]

                # Iterate through rows and insert into MongoDB
                for index, row in df.iterrows():
                    data = row.to_dict()
                    db[collection_name].insert_one(data)

                print(f'Data imported into MongoDB collection: {collection_name}')

    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    folder_path = input("Enter the path to the folder: ")
    import_data_from_folder(folder_path)