from flask import Blueprint, request, jsonify
from mongo_init import mongo  
import hashlib
import base64
import uuid
from bson import ObjectId

authentication_blueprint = Blueprint('authentication', __name__)

#user create garna use hunna yo, just for testing
@authentication_blueprint.route("/user", methods=["POST"])
def create_user():
    new_user = request.json

    password = new_user.get("password")
    if not password:
        return jsonify({"error": "Password is required"}), 400

    salt = base64.urlsafe_b64encode(uuid.uuid4().bytes)

    password_bytes = password.encode('utf-8')  
    t_sha = hashlib.sha512()
    t_sha.update(password_bytes + salt)  
    hashed_password = base64.urlsafe_b64encode(t_sha.digest())  

   
    new_user["password"] = hashed_password.decode('utf-8') 
    new_user["salt"] = salt.decode('utf-8')  

   
    if not new_user.get('name') or not new_user.get('email'):
        return jsonify({"error": "Missing required fields: name, email"}), 400

    user_id = mongo.db.users.insert_one(new_user).inserted_id

    return jsonify({"message": "User created", "user_id": str(user_id)}), 201

#user data dinxa
@authentication_blueprint.route("/user", methods=["GET"])
def get_user():
    try:
        
        user_id = request.args.get("user_id")

        if user_id:
            user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

            if user:
                return jsonify(serialize_doc(user))
            else:
                return jsonify({"message": "User not found"}), 404
        else:
            users = mongo.db.users.find()
            users_list = [serialize_doc(user) for user in users]
            return jsonify(users_list)

    except Exception as e:
        print(f"Error: {e}")
        return "Internal server error", 500


#user details update hune
@authentication_blueprint.route("/user/<user_id>", methods=["PATCH"])
def update_user(user_id):
    try:
        user_object_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID"}), 400
    
    update_data = request.json
    if not update_data:
        return jsonify({"error": "No data provided for update"}), 400
    
    if "password" in update_data:
        return jsonify({"error": "Password update is not allowed"}), 403
    
    current_user = mongo.db.users.find_one({"_id": user_object_id})
    if not current_user:
        return jsonify({"error": "User not found"}), 404
    
    current_age = current_user.get("age")

    if "age" not in update_data:
        update_data["age"] = current_age
    
    print(current_user)
    
    
   
    update_weight = "weight" in update_data
    update_height = "height" in update_data
    update_age = "age" in update_data
    update_gender = current_user.get("gender")
    update_activity_level = "activityLevel" in update_data
    update_goal = "goal" in update_data


    if update_weight or update_height or update_age :
        # Recalculate BMI and BMR
        weight = float(update_data.get("weight", 0)) if update_weight else None
        height = float(update_data.get("height", 0)) if update_height else None
        age = int(update_data.get("age", 0)) if update_age else None
        gender = update_gender

       
        

        # Calculate BMI
        if weight and height:
            bmi = round((weight / (height ** 2)) * 10000, 2)
            update_data["bmi"] = bmi

        # Calculate BMR
        if weight and height and update_age and gender:
            print("reached")
            if gender == "Male":
                bmr = round((10 * weight) + (6.25 * height) - (5 * age) + 5, 2)
            elif gender == "Female":
                bmr = round((10 * weight) + (6.25 * height) - (5 * age) - 161, 2)
            else:
                bmr = current_user.get("bmr")
            update_data["bmr"] = bmr
            

        # Calculate recommended calories if activity level and goal are available
        if update_activity_level or update_goal :
            activity_level = update_data.get("activityLevel", "").lower()
            goal = update_data.get("goal", "").lower()
            recommended_calories = recommend_calories(bmr, activity_level, goal)
            update_data["recommended_calories"] = recommended_calories

    # Perform the update query
    update_query = {"$set": update_data}
    result = mongo.db.users.update_one({"_id": user_object_id}, update_query)
    
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"message": "User updated successfully"}), 200


#not implemented delete
@authentication_blueprint.route("/user", methods=["DELETE"])
def delete_user():
    return "authentication rest api DELETE"


#register request only used this
@authentication_blueprint.route("/register", methods=["POST"])
def register_user():
    new_user = request.json

    # Ensure all required fields, including activityLevel, are present
    required_fields = ["firstName", "lastName", "email", "password", "age", "height", "weight", "gender", "goal", "activityLevel"]
    if any(field not in new_user for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Salt and hash the password
    salt = base64.urlsafe_b64encode(uuid.uuid4().bytes)
    password_bytes = new_user["password"].encode('utf-8')
    t_sha = hashlib.sha512()
    t_sha.update(password_bytes + salt)
    hashed_password = base64.urlsafe_b64encode(t_sha.digest())

    # Calculate BMI
    bmi = round((float(new_user["weight"]) / (float(new_user["height"]) ** 2)) * 10000, 2)
    
    # Gather the user's weight, height, and age for BMR calculation
    weight = float(new_user["weight"])
    height = float(new_user["height"])
    age = int(new_user["age"])

    # Calculate BMR based on gender
    if new_user["gender"].lower() == "male":
        bmr = round((10 * weight) + (6.25 * height) - (5 * age) + 5, 2)
    elif new_user["gender"].lower() == "female":
        bmr = round((10 * weight) + (6.25 * height) - (5 * age) - 161, 2)
    else:
        bmr = None  # If gender is invalid, we don't calculate BMR

    # Calculate recommended calories based on activity level and goal
    activity_level = new_user["activityLevel"].lower()
    recommended_calories = recommend_calories(bmr, activity_level, new_user["goal"])

    # Prepare the user data to be inserted into the database
    user_data = {
        "firstName": new_user["firstName"],
        "lastName": new_user["lastName"],
        "email": new_user["email"],
        "password": hashed_password.decode('utf-8'),
        "salt": salt.decode('utf-8'),
        "age": new_user["age"],
        "height": new_user["height"],
        "weight": new_user["weight"],
        "gender": new_user["gender"],
        "goal": new_user["goal"],
        "activityLevel": new_user["activityLevel"],  # Include activity level in user data
        "bmi": bmi,
        "bmr": bmr,
        "recommended_calories": recommended_calories
    }

    # Insert the user data into the database
    user_id = mongo.db.users.insert_one(user_data).inserted_id

    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201




#login request
@authentication_blueprint.route("/login", methods=["POST"])
def login_request_user():
    user_details = request.json

    user_email = user_details.get("email")
    user_password = user_details.get("password")

    if not (user_password and user_email):
        return jsonify({"message": "Email and Password are required"}), 200
    
    try:
        database_result = mongo.db.users.find_one({"email": user_email})
    except Exception as e:
        return jsonify({"message": "Error while searching for email: " + str(e)}), 200
    
    if database_result:
        serialized_result = serialize_doc(database_result)

        salt = serialized_result.get("salt").encode('utf-8')
        password_bytes = user_password.encode('utf-8')
        t_sha = hashlib.sha512()
        t_sha.update(password_bytes + salt)
        hashed_password = base64.urlsafe_b64encode(t_sha.digest())

        hashed_password_decoded = hashed_password.decode('utf-8')

        if hashed_password_decoded == serialized_result.get("password"):
            return jsonify({
                "message": "Authenticated", 
                "user_id": str(serialized_result.get("_id"))  
            }), 200
        else:
            return jsonify({"message": "Password did not match"}), 200
    else:
        return jsonify({"message": "No email found"}), 200


#document serialization
def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])  
    return doc


#recommendation of calories needed to be burned 

def recommend_calories(bmr, activity_level, goal):
    activity_factors = {
        "sedentary": 1.2,
        "lightly": 1.375,
        "moderately": 1.55,
        "very": 1.725,
        "super": 1.9
    } 
    factor = activity_factors.get(activity_level.lower(), 1.2)
    tdee = bmr * factor
    if goal.lower() == "weight loss":
        recommended_calories = tdee - 250
    elif goal.lower() == "muscle gain":
        recommended_calories = tdee + 250
    else: 
        recommended_calories = tdee
    return round(recommended_calories, 2)


#for resetting password
@authentication_blueprint.route("/reset-pass", methods=["PUT"])
def reset_password():
    try:
        data = request.json

        user_id = data.get("user_id")
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        updates = data.get("updates", {})
        if not updates:
            return jsonify({"error": "No fields to update provided"}), 400

        if "password" in updates:
            new_password = updates["password"]
            salt = base64.urlsafe_b64encode(uuid.uuid4().bytes)

            password_bytes = new_password.encode('utf-8')
            t_sha = hashlib.sha512()
            t_sha.update(password_bytes + salt)
            hashed_password = base64.urlsafe_b64encode(t_sha.digest())

            updates["password"] = hashed_password.decode('utf-8')
            updates["salt"] = salt.decode('utf-8')


        result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500