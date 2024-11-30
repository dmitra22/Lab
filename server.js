const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the static frontend
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// WebSocket connection handling
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        // Broadcast to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

server.listen(6969, () => {
    console.log("Server started on http://localhost:6969");
});
