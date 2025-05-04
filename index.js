require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { Pool } = require('pg');
const fetch = require('node-fetch');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(bodyParser.json());

// Telegram login validation
function validateTelegramAuth(initData) {
    const secret = crypto.createHash('sha256').update(process.env.BOT_TOKEN).digest();
    const checkString = Object.keys(initData)
        .filter(k => k !== 'hash')
        .sort()
        .map(k => ${k}=${initData[k]})
        .join('\n');
    const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
    return hmac === initData.hash;
}

// API: User login via Telegram Mini App
app.post('/api/login', async (req, res) => {
    const { id, first_name, username, hash } = req.body;
    const initData = { id, first_name, username, hash };

    if (!validateTelegramAuth(initData)) {
        return res.status(403).json({ error: 'Invalid Telegram auth' });
    }

    try {
        await pool.query(`INSERT INTO users (id, first_name, username)
                          VALUES ($1, $2, $3)
                          ON CONFLICT (id) DO NOTHING`, [id, first_name, username]);
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Function to send a Telegram message
const sendMessageToUser = async (chatId, message) => {
    const url = https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message }),
    });
};

// Webhook for Telegram updates
app.post('/webhook', async (req, res) => {
    const message = req.body.message;
    if (message && message.text === "/start") {
        const chatId = message.chat.id;
        await sendMessageToUser(chatId, "Welcome to IndiaTaskBot! Tap the menu button below to start earning.");
    }
    res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
