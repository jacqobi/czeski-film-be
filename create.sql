CREATE TABLE IF NOT EXISTS chats (
    id TEXT DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_name TEXT,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
