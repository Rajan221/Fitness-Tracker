from flask import Blueprint, request, jsonify
from mongo_init import mongo
from bson import ObjectId

food_blueprint = Blueprint('food', __name__)

#food add garni
@food_blueprint.route("/food", methods=["POST"])
def create_food():
    try:
    
        new_food = request.json

       
        required_fields = ["name", "amount", "calories"]
        for field in required_fields:
            if field not in new_food:
                return jsonify({"error": f"'{field}' is required"}), 400

    
        food_id = mongo.db.foods.insert_one(new_food).inserted_id

        return jsonify({"message": "Food added successfully", "food_id": str(food_id)}), 201
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


#foods ko data line
@food_blueprint.route("/food", methods=["GET"])
def get_foods():
    try:
       
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "'user_id' is required"}), 400

       
        foods = mongo.db.foods.find({"user_id": user_id}) 
        food_list = [serialize_doc(food) for food in foods]

        return jsonify(food_list), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


#delete food
@food_blueprint.route("/food/<food_id>", methods=["DELETE"])
def delete_food(food_id):
    try:
      
        result = mongo.db.foods.delete_one({"_id": ObjectId(food_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Food item not found"}), 404

        return jsonify({"message": "Food item deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

#update food
@food_blueprint.route("/food/<food_id>", methods=["PUT"])
def update_food(food_id):
    try:
       
        updated_data = request.json

        
        result = mongo.db.foods.update_one({"_id": ObjectId(food_id)}, {"$set": updated_data})

        if result.matched_count == 0:
            return jsonify({"error": "Food item not found"}), 404

        return jsonify({"message": "Food item updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

#lekna baki xa
@food_blueprint.route("/food/calories/history", methods=["GET"])
def get_calorie_history():
    try:
        user_id = request.args.get("user_id")  

        if not user_id:
            return jsonify({"error": "'user_id' is required"}), 400

    
        calorie_history = mongo.db.foods.aggregate([
            {"$match": {"user_id": user_id}},  
            {"$group": {
                "_id": "$date", 
                "total_calories": {"$sum": {"$toInt": "$calories"}}
            }},
            {"$sort": {"_id": -1}} 
        ])

        calorie_history_list = [{"date": result["_id"], "total_calories": result["total_calories"]} for result in calorie_history]

        return jsonify(calorie_history_list), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc
