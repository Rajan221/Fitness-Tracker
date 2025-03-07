from flask import Blueprint, request, jsonify
import numpy as np
import joblib
from app.model import SimpleANN  
from app.custom_scaler import CustomStandardScaler  

prediction_blueprint = Blueprint('prediction', __name__)

model = SimpleANN.load_model("models/calories_model_scratch1.pkl")
scaler_X = CustomStandardScaler.load_scaler("models/scaler_X.pkl")
scaler_Y = CustomStandardScaler.load_scaler("models/scaler_Y.pkl")

FEATURE_ORDER = ["Gender", "Age", "Height", "Weight", "Duration", "Heart_Rate", "Body_Temp"]


#prediction using ann
@prediction_blueprint.route("/custom", methods=['POST'])
def predict():
    try:
        data = request.get_json()

        required_fields = ["Gender", "Age", "Height", "Weight", "Duration", "Heart_Rate", "Body_Temp"]
        for field in required_fields:
            if field not in data:
               
                return jsonify({"status": "error", "message": f"Missing field: {field}"}), 400

           
            if field != "Gender":
                try:    
                   
                    data[field] = float(data[field])
                    if data[field] < 0:
                        return jsonify({"status": "error", "message": f"{field} cannot be negative"}), 400
                except ValueError:
                    return jsonify({"status": "error", "message": f"Invalid data type for {field}"}), 400

       
        gender_value = 1 if data["Gender"].lower() == "male" else 0  
        
        X_input = np.array([
            gender_value, 
            data["Age"], 
            data["Height"], 
            data["Weight"], 
            data["Duration"], 
            data["Heart_Rate"], 
            data["Body_Temp"]
        ]).reshape(1, -1)

        if scaler_X is None:
            return jsonify({"status": "error", "message": "Scaler X not loaded"}), 500

        X_scaled = scaler_X.transform(X_input)

        if model is None:
            return jsonify({"status": "error", "message": "Model not loaded"}), 500

        y_pred_scaled = model.predict(X_scaled)

    
        if scaler_Y is None:
            return jsonify({"status": "error", "message": "Scaler Y not loaded"}), 500

        y_pred_original = scaler_Y.inverse_transform(y_pred_scaled.reshape(-1, 1))
    
        y_pred_value = max(0, float(y_pred_original[0][0])) 


        return jsonify({'calories_burned': float(y_pred_value)})
        

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


