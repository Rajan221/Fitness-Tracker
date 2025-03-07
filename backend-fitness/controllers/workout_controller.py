from flask import Blueprint, request, jsonify
from mongo_init import mongo
from bson import ObjectId

workout_blueprint = Blueprint('workout', __name__)

#add new workout
@workout_blueprint.route("/workout", methods=["POST"])
def create_workout():
    try:     
        new_workout = request.json   
        
  
        required_fields = ["name", "duration", "heartrate", "temperature"]
        for field in required_fields:
            if field not in new_workout:
                return jsonify({"error": f"'{field}' is required"}), 400

        workout_id = mongo.db.workouts.insert_one(new_workout).inserted_id

        return jsonify({"message": "Workout added successfully", "workout_id": str(workout_id)}), 201
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


#get all workout list
@workout_blueprint.route("/workout", methods=["GET"])
def get_workouts():
    try:
       
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "'user_id' is required"}), 400

      
        workouts = mongo.db.workouts.find({"user_id": user_id})  
        workout_list = [serialize_doc(workout) for workout in workouts]

        return jsonify(workout_list), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

#delete in workout
@workout_blueprint.route("/workout/<workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    try:
        # Delete a workout by its ID
        result = mongo.db.workouts.delete_one({"_id": ObjectId(workout_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Workout not found"}), 404

        return jsonify({"message": "Workout deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


#update function in workout
@workout_blueprint.route("/workout/<workout_id>", methods=["PUT"])
def update_workout(workout_id):
    try:
      
        updated_data = request.json

       
        result = mongo.db.workouts.update_one({"_id": ObjectId(workout_id)}, {"$set": updated_data})

        if result.matched_count == 0:
            return jsonify({"error": "Workout not found"}), 404

        return jsonify({"message": "Workout updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


#workout history handler
@workout_blueprint.route("/workout/calories/history", methods=["GET"])
def get_workout_calorie_history():
    try:
        user_id = request.args.get("user_id") 
        if not user_id:
            return jsonify({"error": "'user_id' is required"}), 400
 
        workout_calorie_history = mongo.db.workouts.aggregate([
            {"$match": {"user_id": user_id}}, 
            {"$group": {
                "_id": "$date", 
                "total_calories": {"$sum": {"$toInt": "$calories"}}  
            }},
            {"$sort": {"_id": -1}}  
        ])

        workout_calorie_history_list = [{"date": result["_id"], "total_calories": result["total_calories"]} for result in workout_calorie_history]
        return jsonify(workout_calorie_history_list), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
    

#document serialize garni
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc
