from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
# Load the classification pipeline
pipe = pipeline("text-classification", model="tabularisai/multilingual-sentiment-analysis")

app = Flask(__name__)

CORS(app)
@app.route('/classify', methods=['POST'])
def classify_text():
    data = request.get_json()
    text = data.get('text', '')
    result = pipe(text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)