import db from "../db/connection.js";

export const createUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing username or password" });

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "User created!", userId: result.insertId });
  });
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user: rows[0] });
  });
};
