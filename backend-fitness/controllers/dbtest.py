from flask import Blueprint, jsonify
from mongo_init import mongo 


db_blueprint = Blueprint('db', __name__)

@db_blueprint.route("/dbtest")
def test_db_connection():
    try:
        count = mongo.db.youtubes.count_documents({})
        return jsonify({"status": "success", "document_count": count})
    except Exception as e:
        return jsonify({"status": "failure", "error": str(e)}), 500
