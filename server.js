const express = require("express");
const WebSocket = require("ws");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const wss = new WebSocket.Server({ port: 3001 });

const db = new sqlite3.Database("./chat_app.db");

app.use(express.json()); // For parsing JSON data

// User login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ success: true, username });
    });
});

let connectedUsers = {};

// WebSocket connection
wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        const { username, text } = message;

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ username, text }));
            }
        });
    });
});

app.listen(6969, () => console.log("Server started on http://localhost:6969"));