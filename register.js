const bcrypt = require("bcrypt");

module.exports = function (app, db) {
    // User registration route
    app.post("/register", (req, res) => {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user already exists
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (user) return res.status(409).json({ error: "Username already exists" });

            // Hash password and save user
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: "Failed to register user" });
                res.json({ success: true, message: "User registered successfully" });
            });
        });
    });
};