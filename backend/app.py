from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Initialize data file if it doesn't exist
DATA_FILE = 'resumes.json'
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump({"resumes": [], "next_id": 1}, f)

def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            # Ensure the data structure is correct
            if "next_id" not in data:
                data["next_id"] = 1
            if "resumes" not in data:
                data["resumes"] = []
            return data
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        return {"resumes": [], "next_id": 1}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Resume Builder API is running"
    })

@app.route('/api/resumes', methods=['GET'])
def get_resumes():
    data = load_data()
    return jsonify(data["resumes"])

@app.route('/api/resumes', methods=['POST'])
def create_resume():
    try:
        data = load_data()
        new_resume = request.json
        
        # Ensure next_id exists
        if "next_id" not in data:
            data["next_id"] = 1
            
        # Assign ID to new resume
        new_resume["id"] = data["next_id"]
        
        # Update data
        data["resumes"] = [new_resume]  # Only keep the new resume
        data["next_id"] += 1
        
        # Save changes
        save_data(data)
        
        return jsonify(new_resume), 201
    except Exception as e:
        print(f"Error creating resume: {str(e)}")
        return jsonify({"error": "Failed to create resume"}), 500

@app.route('/api/resumes/<int:resume_id>', methods=['GET'])
def get_resume(resume_id):
    data = load_data()
    try:
        resume = next((r for r in data["resumes"] if r["id"] == resume_id), None)
        if resume:
            return jsonify(resume)
        return jsonify({"error": "Resume not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resumes/<int:resume_id>', methods=['PUT'])
def update_resume(resume_id):
    updated_resume = request.json
    data = load_data()
    try:
        for i, resume in enumerate(data["resumes"]):
            if resume["id"] == resume_id:
                data["resumes"][i] = {**resume, **updated_resume}
                save_data(data)
                return jsonify(data["resumes"][i])
        return jsonify({"error": "Resume not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/resumes/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    data = load_data()
    try:
        data["resumes"] = [r for r in data["resumes"] if r["id"] != resume_id]
        save_data(data)
        return '', 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("API endpoints available at:")
    print("http://localhost:5000/api/health")
    print("http://localhost:5000/api/resumes")
    app.run(debug=True, host='0.0.0.0', port=5000) 