# devsmart/routes/api/user/v1/chat.py
import os
import uuid
from datetime import datetime

import psycopg2
import psycopg2.extras
from flask import jsonify, request

from . import user_bp  # blueprint from __init__.py

# ---------- DB CONFIG ----------

DB_HOST = os.getenv("PGHOST") or os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = int(os.getenv("PGPORT", "5432"))
DB_NAME = os.getenv("PGDATABASE", "postgres")
DB_USER = os.getenv("PGUSER", "postgres")
DB_PASSWORD = os.getenv("PGPASSWORD", "postgres")


def get_conn():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        cursor_factory=psycopg2.extras.RealDictCursor,
    )


def init_db():
    """Create chats + messages tables if they do not exist."""
    ddl_chats = """
    CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """

    ddl_messages = """
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user','assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """

    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(ddl_chats)
                cur.execute(ddl_messages)
    finally:
        conn.close()


# Run DDL at import time
init_db()


def row_to_chat(row: dict) -> dict:
    """Convert DB row to DBChat shape expected by FE."""
    return {
        "id": row["id"],
        "userId": row["user_id"],
        "createdAt": (
            row["created_at"].isoformat()
            if isinstance(row["created_at"], datetime)
            else row["created_at"]
        ),
    }


def row_to_message(row: dict) -> dict:
    """Convert DB row to DBMessage shape expected by FE."""
    return {
        "id": row["id"],
        "chatId": row["chat_id"],
        "role": row["role"],
        "content": row["content"],
        "createdAt": (
            row["created_at"].isoformat()
            if isinstance(row["created_at"], datetime)
            else row["created_at"]
        ),
    }


# ---------- ENDPOINTS ----------

# POST /api/user/v1/createChat
# body: { "userId": "some-user" }
@user_bp.route("/v1/createChat", methods=["POST"])
def create_chat():
    data = request.get_json(silent=True) or {}
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    chat_id = str(uuid.uuid4())

    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO chats (id, user_id)
                    VALUES (%s, %s)
                    RETURNING id, user_id, created_at
                    """,
                    (chat_id, user_id),
                )
                row = cur.fetchone()
    finally:
        conn.close()

    chat = row_to_chat(row)
    return jsonify({"success": "chat_created", "chat": chat}), 201


# POST /api/user/v1/saveMessage
# body: { "chatId": string, "content": string, "role": "user"|"assistant" }
@user_bp.route("/v1/saveMessage", methods=["POST"])
def save_message():
    data = request.get_json(silent=True) or {}
    chat_id = data.get("chatId")
    content = data.get("content")
    role = data.get("role")

    if not chat_id or not content or role not in ("user", "assistant"):
        return (
            jsonify(
                {
                    "error": "chatId, content and role ('user'|'assistant') are required",
                }
            ),
            400,
        )

    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO messages (chat_id, role, content)
                    VALUES (%s, %s, %s)
                    RETURNING id, chat_id, role, content, created_at
                    """,
                    (chat_id, role, content),
                )
                row = cur.fetchone()
    finally:
        conn.close()

    msg = row_to_message(row)
    return jsonify({"success": "message_saved", "message": msg}), 201


# GET /api/user/v1/getChatsByUserId/<userId>
@user_bp.route("/v1/getChatsByUserId/<user_id>", methods=["GET"])
def get_chats_by_user_id(user_id):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, user_id, created_at
                    FROM chats
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    """,
                    (user_id,),
                )
                rows = cur.fetchall()
    finally:
        conn.close()

    chats = [row_to_chat(r) for r in rows]
    return jsonify({"chats": chats}), 200


# GET /api/user/v1/getChatMessagesByChatId/<chatId>
@user_bp.route("/v1/getChatMessagesByChatId/<chat_id>", methods=["GET"])
def get_chat_messages_by_chat_id(chat_id):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, chat_id, role, content, created_at
                    FROM messages
                    WHERE chat_id = %s
                    ORDER BY created_at ASC
                    """,
                    (chat_id,),
                )
                rows = cur.fetchall()
    finally:
        conn.close()

    messages = [row_to_message(r) for r in rows]
    return jsonify({"messages": messages}), 200


# DELETE /api/user/v1/deleteChatByChatId/<chatId>
@user_bp.route("/v1/deleteChatByChatId/<chat_id>", methods=["DELETE"])
def delete_chat_by_chat_id(chat_id):
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                # delete messages (if FK not ON DELETE CASCADE it’s still safe)
                cur.execute("DELETE FROM messages WHERE chat_id = %s", (chat_id,))
                cur.execute("DELETE FROM chats WHERE id = %s", (chat_id,))
                deleted = cur.rowcount
    finally:
        conn.close()

    if deleted == 0:
        return jsonify({"error": "chat not found"}), 404

    return jsonify({"success": "chat_deleted"}), 200
