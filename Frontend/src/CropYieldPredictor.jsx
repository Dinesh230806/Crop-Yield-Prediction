import React, { useState } from "react";
import axios from "axios";
import categories from "./assets/unique_categorical_values.json";

const API_URL = "http://localhost:5000";

const CropYieldPredictor = () => {
  const [form, setForm] = useState({
    State_Name: "",
    Crop: "",
    Season: "",
    Crop_Year: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    console.log(form);

    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_URL}/predict`, form);
      setResult(res.data.predicted_yield);
    } catch (err) {
      alert("Prediction failed. Check inputs or API.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          🌾 Crop Yield Predictor
        </h2>

        <form className="space-y-4">
          {["State_Name", "Crop", "Season", "Crop_Year"].map((key) => (
            <div key={key}>
              <label className="block text-gray-700 mb-1 font-medium">
                {key.replace("_", " ")}:
              </label>
              <select
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select {key}</option>
                {key === "Crop_Year"
                  ? Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))
                  : categories[key]?.map((value) => (
                      <option key={value} value={value}>
                        {String(value).trim()}
                      </option>
                    ))}
              </select>
            </div>
          ))}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>

        {result !== null && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
            🌾 Predicted Yield:{" "}
            <strong className="text-green-900">{result} tons/hectare</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropYieldPredictor;
