from flask import Blueprint, request, jsonify
from mongo_init import mongo  
import hashlib
import base64
import uuid

authentication_blueprint = Blueprint('authentication', __name__)

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

    # Insert the user into MongoDB
    if not new_user.get('name') or not new_user.get('email'):
        return jsonify({"error": "Missing required fields: name, email"}), 400

    user_id = mongo.db.users.insert_one(new_user).inserted_id

    return jsonify({"message": "User created", "user_id": str(user_id)}), 201

@authentication_blueprint.route("/user", methods=["GET"])
def get_user():
    
    try:
        youtubes = mongo.db.users.find()
        youtubes_list = [serialize_doc(youtube) for youtube in youtubes]  
        return jsonify(youtubes_list)  
    except Exception as e:
       
        return "Internal server error", 500

@authentication_blueprint.route("/user", methods=["PUT"])
def update_user():
    return "authentication rest api PUT"

@authentication_blueprint.route("/user", methods=["DELETE"])
def delete_user():
    return "authentication rest api DELETE"


def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])  
    return doc