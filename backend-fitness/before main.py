from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS  
from bson import ObjectId

import controllers.youtube_controller as youtube

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/youtubeSave"
mongo = PyMongo(app)


CORS(app)  

def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])
    return doc

@app.route("/test-db-connection")
def test_db_connection():
    try:
        count = mongo.db.youtubes.count_documents({})
        return jsonify({"status": "success", "document_count": count})

    except Exception as e:
        app.logger.error(f"Database connection failed: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500

@app.route("/")
def hello_world():
    try:
        youtubes = mongo.db.youtubes.find()
        youtubes_list = [serialize_doc(youtube) for youtube in youtubes]
        return jsonify(youtubes_list)

    except Exception as e:
        app.logger.error(f"An error occurred while fetching YouTube data: {e}")
        return "Internal server error", 500
  

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0", port=8002)
