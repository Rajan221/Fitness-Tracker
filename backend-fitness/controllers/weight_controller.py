from flask import Blueprint, request, jsonify
from mongo_init import mongo
from bson import ObjectId
from datetime import datetime

weight_history_blueprint = Blueprint('weight', __name__)

# Add weight history route
@weight_history_blueprint.route("/weight-history", methods=["POST"])
def add_weight_history():
    data = request.json
    
    # Validate input
    user_id = data.get("user_id")
    weight = data.get("weight")
    date = data.get("date")  
    
    if not user_id or not weight or not date:
        return jsonify({"error": "Missing required fields: user_id, weight, date"}), 400

    try:
        # Check if the user exists
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Convert date string to datetime object to ensure it's valid
        try:
            weight_date = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format, should be YYYY-MM-DD"}), 400

        # Create weight history entry
        weight_entry = {
            "user_id": ObjectId(user_id),
            "weight": weight,
            "date": weight_date
        }

        # Insert weight history into the database
        result = mongo.db.weight_history.insert_one(weight_entry)
        
        return jsonify({"message": "Weight history added successfully", "entry_id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# Get weight history for a user
@weight_history_blueprint.route("/weight-history", methods=["GET"])
def get_weight_history():
    try:
        user_id = request.args.get("user_id")
        
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        # Get weight history from database
        weight_history = mongo.db.weight_history.find({"user_id": ObjectId(user_id)})
        weight_history_list = [serialize_doc(entry) for entry in weight_history]

        if not weight_history_list:
            return jsonify([])  # Return an empty list if no weight history is found

        return jsonify(weight_history_list)

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


# Document serialization to convert _id to string
def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
    doc['user_id'] = str(doc['user_id'])  # Convert ObjectId to string for user_id if needed
    return doc
