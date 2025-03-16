from flask import Flask, jsonify, request
import json

app = Flask(__name__)
DATA_FILE = "reaction_data.json"

def load_data():
    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {"times": []}

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

@app.route("/save", methods=["POST"])
def save_reaction_time():
    data = load_data()
    new_time = request.json.get("time")

    if new_time:
        data["times"].append(new_time)
        save_data(data)
    
    return jsonify({"message": "Saved successfully!"})

@app.route("/history", methods=["GET"])
def get_history():
    data = load_data()
    times = data["times"]
    average = round(sum(times) / len(times), 2) if times else 0
    
    return jsonify({"times": times, "average": average})

if __name__ == "__main__":
    app.run(debug=True)

