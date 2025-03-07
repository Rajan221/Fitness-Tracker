from flask import Blueprint, request, jsonify
import pandas as pd
import joblib
import os
import numpy as np

MODEL_DIR = "models"
calorie_model_path = os.path.join(MODEL_DIR, "calorie_prediction_model.pkl")


for file_path in [calorie_model_path]:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")


calorie_model = joblib.load(calorie_model_path)



calorie_blueprint = Blueprint('calorie', __name__)

#linear regression model to predit calories
@calorie_blueprint.route("/predict", methods=['POST'])
def predict():
    """Route to predict calories burned based on user input."""
    try:
        data = request.get_json()

        # Convert input to DataFrame
        input_data = pd.DataFrame([data])
        input_data['Gender'] = input_data['Gender'].map({'Male': 0, 'Female': 1})

        # Make prediction
        prediction = calorie_model.predict(input_data)

        return jsonify({'calories_burned': float(prediction[0])})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


