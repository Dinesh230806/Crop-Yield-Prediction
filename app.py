from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Add this
import pickle
import pandas as pd
#pip install -r requirements.txt

# Load the trained model
with open('xgb_crop_yield_pipeline.pkl', 'rb') as f:
    model = pickle.load(f)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # ✅ Allow all origins (you can also restrict it to specific domains)

@app.route('/')
def home():
    return "🌾 Crop Yield Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        input_data = pd.DataFrame([{
            'State_Name': data['State_Name'],
            'Crop': data['Crop'],
            'Season': data['Season'],
            'Crop_Year': data['Crop_Year']
        }])
        
        prediction = model.predict(input_data)[0]
        prediction = float(prediction)

        return jsonify({
            'predicted_yield': round(prediction, 2),
            'unit': 'tons/hectare'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
