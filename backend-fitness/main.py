from flask import Flask
from flask_cors import CORS
from mongo_init import mongo  
import controllers.product as product_controller
import controllers.dbtest as db
import controllers.youtube_controller as youtube
import controllers.auth_controller as authentication

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/fitness"

mongo.init_app(app)  

CORS(app)

app.register_blueprint(db.db_blueprint)
app.register_blueprint(product_controller.product_blueprint)
app.register_blueprint(youtube.youtube_blueprint)
app.register_blueprint(authentication.authentication_blueprint)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8002)
