app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(rows);
    });
});