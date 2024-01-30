from flask import current_app as app
from flask import request, jsonify

# from .openai_client import openai_model

@app.route('/extract_hashtags', methods=['POST'])
def extract_hashtags():
    data = request.get_json()
    description = data["description"]
    if len(description) < 10:
        hashtags=["#newpost", "#social", "#media"]
    else:
        hashtags=["#newpost", "#social", "#media"]
#         hashtags = openai_model.extract_hashtags(description)
    return jsonify(hashtags=hashtags)