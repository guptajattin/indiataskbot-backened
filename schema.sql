CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    first_name TEXT,
    username TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS earnings (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    amount NUMERIC,
    source TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    method TEXT,
    details TEXT,
    amount NUMERIC,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);