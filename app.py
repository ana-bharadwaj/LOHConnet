from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

MONGO_URI = "mongodb://localhost:27017/"
DATABASE_NAME = "LOH"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

@app.route('/search', methods=['POST'])
def search():
    user_input = request.json['user_input']
    collection_names = db.list_collection_names()

    result_data = []

    for collection_name in collection_names:
        collection = db[collection_name]

        # Iterate through all documents in the collection
        cursor = collection.find({})
        for document in cursor:
            # Search for the user input in the "LoH Info.Region" field
            region_value = document.get('LoH Info', {}).get('Region', '')
            if user_input.lower() in region_value.lower():
                document_data = {
                    'collection_name': collection_name,
                    'document': document,
                }
                result_data.append(document_data)

    # Use the custom JSON encoder
    response_data = JSONEncoder().encode(result_data)
    return jsonify(json.loads(response_data))

if __name__ == '__main__':
    app.run(debug=True)