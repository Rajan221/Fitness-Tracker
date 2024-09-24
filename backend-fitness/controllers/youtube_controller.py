from flask import Blueprint, jsonify
from mongo_init import mongo  

youtube_blueprint = Blueprint('youtube', __name__)


def serialize_doc(doc):
    doc['_id'] = str(doc['_id'])  
    return doc

@youtube_blueprint.route("/")  
def hello_world():
    try:
        youtubes = mongo.db.youtubes.find()
        youtubes_list = [serialize_doc(youtube) for youtube in youtubes]  
        return jsonify(youtubes_list)  
    except Exception as e:
       
        return "Internal server error", 500


