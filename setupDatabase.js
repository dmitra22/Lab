const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = new sqlite3.Database("./chat_app.db");

// Initialize users table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // Seed with a default user (username: "user1", password: "password")
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync("password", saltRounds);
    db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ["user1", passwordHash]);
});

console.log("Database initialized.");
db.close();