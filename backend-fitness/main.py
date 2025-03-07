from flask import Flask
from flask_cors import CORS
from mongo_init import mongo  
import controllers.product as product_controller
import controllers.dbtest as db

import controllers.auth_controller as authentication
import controllers.workout_controller as workout
import controllers.calorie_controller as calorie
import controllers.food_controller as food
import controllers.custom_controller as custom_controller
import controllers.weight_controller as weight_controller




app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/fitness"

mongo.init_app(app)  

CORS(app)


# blueprints
app.register_blueprint(db.db_blueprint)
app.register_blueprint(product_controller.product_blueprint)
app.register_blueprint(authentication.authentication_blueprint)
app.register_blueprint(workout.workout_blueprint)
app.register_blueprint(food.food_blueprint)
app.register_blueprint(calorie.calorie_blueprint)
app.register_blueprint(custom_controller.prediction_blueprint)
app.register_blueprint(weight_controller.weight_history_blueprint)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8002)


