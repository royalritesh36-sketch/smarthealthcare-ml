from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os


app = Flask(__name__)


# ==========================================================
# LOAD MODEL
# ==========================================================

MODEL_PATH = "models/heart_model.pkl"

model = joblib.load(MODEL_PATH)


# ==========================================================
# MODEL FEATURES
# ==========================================================

FEATURES = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "SmartHealthcare ML API is running.",
        "model": "Heart Disease Risk Model",
        "features": len(FEATURES)
    })


# ==========================================================
# PREDICTION
# ==========================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message": "Request body is empty."
            }), 400


        # --------------------------------------------------
        # Validate fields
        # --------------------------------------------------

        missing_fields = [
            feature
            for feature in FEATURES
            if feature not in data
        ]

        if missing_fields:

            return jsonify({
                "success": False,
                "message": "Missing required fields.",
                "missingFields": missing_fields
            }), 400


        # --------------------------------------------------
        # Convert input to numeric values
        # --------------------------------------------------

        values = []

        for feature in FEATURES:

            try:
                values.append(
                    float(data[feature])
                )

            except (ValueError, TypeError):

                return jsonify({
                    "success": False,
                    "message":
                        f"Invalid value for {feature}."
                }), 400


        # --------------------------------------------------
        # Create DataFrame
        # --------------------------------------------------

        input_data = pd.DataFrame(
            [values],
            columns=FEATURES
        )


        # --------------------------------------------------
        # Prediction
        # --------------------------------------------------

        prediction = int(
            model.predict(input_data)[0]
        )


        # --------------------------------------------------
        # Probability
        # --------------------------------------------------

        probabilities = model.predict_proba(
            input_data
        )[0]

        disease_probability = float(
            probabilities[1]
        )


        # --------------------------------------------------
        # Risk percentage
        # --------------------------------------------------

        risk_percentage = round(
            disease_probability * 100,
            2
        )


        # --------------------------------------------------
        # Risk level
        # --------------------------------------------------

        if risk_percentage < 30:

            risk_level = "Low Risk"

        elif risk_percentage < 70:

            risk_level = "Moderate Risk"

        else:

            risk_level = "High Risk"


        # --------------------------------------------------
        # Message
        # --------------------------------------------------

        if risk_level == "Low Risk":

            message = (
                "The model estimates a lower "
                "potential risk based on the "
                "provided information."
            )

        elif risk_level == "Moderate Risk":

            message = (
                "The model estimates a moderate "
                "potential risk. Consider discussing "
                "the result with a healthcare professional."
            )

        else:

            message = (
                "The model estimates a higher "
                "potential risk. Professional medical "
                "evaluation is recommended."
            )


        # --------------------------------------------------
        # Response
        # --------------------------------------------------

        return jsonify({

            "success": True,

            "prediction": prediction,

            "riskPercentage": risk_percentage,

            "riskLevel": risk_level,

            "message": message,

            "disclaimer": (
                "This AI result is for educational "
                "and early-screening purposes only. "
                "It is not a medical diagnosis."
            )

        })


    except Exception as e:

        return jsonify({

            "success": False,

            "message": "Prediction failed.",

            "error": str(e)

        }), 500


# ==========================================================
# RUN SERVER
# ==========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )