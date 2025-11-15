# devsmart/routes/api/user/v1/completion.py
import os
import requests
from flask import jsonify, request

from . import user_bp  # the blueprint from __init__.py

# You can override this in env: TINYLLAMA_URL
TINYLLAMA_URL = os.getenv(
    "TINYLLAMA_URL",
    "https://tinyllama-11b-chat-v10-czeski-film.apps.cluster-bzgz5.bzgz5.sandbox5179.opentlc.com/v1/chat/completions",
)


@user_bp.route("/v1/completion", methods=["POST"])
def post_completion():
    data = request.get_json(silent=True) or {}

    user_message = data.get("message")
    if not user_message:
        return jsonify({"error": "Missing 'message' in JSON body"}), 400

    # Build the same prompt you used in curl
    prompt = (
        "this is users message, it is wrapped in |, so look "
        f"|{user_message}|, please choose one of the categories matching the message "
        "and only reply with one word which is the chosen category - patching, nature, pastry. "
        "just send one word and nothing else."
    )

    payload = {
        "model": "tinyllama-11b-chat-v10",
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
    }

    try:
        resp = requests.post(TINYLLAMA_URL, json=payload, timeout=20)
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "tinyllama_unreachable",
                    "details": str(e),
                }
            ),
            502,
        )

    # If TinyLlama itself failed, pass its status and body back
    if not resp.ok:
        try:
            body = resp.json()
        except Exception:
            body = {"raw": resp.text}
        return jsonify({"error": "tinyllama_error", "status": resp.status_code, "body": body}), resp.status_code

    # Success – just proxy the LLM response
    try:
        body = resp.json()
    except Exception:
        return jsonify({"error": "invalid_json_from_tinyllama", "raw": resp.text}), 502

    return jsonify(body), 200
