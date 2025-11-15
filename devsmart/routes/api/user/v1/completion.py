# devsmart/routes/api/user/v1/completion.py
import os
import requests
from flask import jsonify, request

from . import user_bp  # the blueprint from __init__.py

# Override via env if needed
TINYLLAMA_URL = os.getenv(
    "TINYLLAMA_URL",
    "https://tinyllama-11b-chat-v10-czeski-film.apps.cluster-bzgz5.bzgz5.sandbox5179.opentlc.com/v1/chat/completions",
)


@user_bp.route("/v1/completion", methods=["POST"])
def post_completion():
    data = request.get_json(silent=True) or {}

    # User must send: { "prompt": "..." }
    user_prompt = data.get("prompt")
    if not user_prompt:
        return jsonify({"error": "Missing 'prompt' in JSON body"}), 400

    payload = {
        "model": "tinyllama-11b-chat-v10",
        "messages": [
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
    }

    try:
        resp = requests.post(TINYLLAMA_URL, json=payload, timeout=20)
    except Exception as e:
        return jsonify({"error": "tinyllama_unreachable", "details": str(e)}), 502

    if not resp.ok:
        try:
            body = resp.json()
        except Exception:
            body = {"raw": resp.text}
        return jsonify({"error": "tinyllama_error", "status": resp.status_code, "body": body}), resp.status_code

    try:
        body = resp.json()
    except Exception:
        return jsonify({"error": "invalid_json_from_tinyllama", "raw": resp.text}), 502
    received = body['choices'][0].message

    return jsonify(received), 200
