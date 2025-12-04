import db from "../db/connection.js";

export const createUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing username, email or password" });

  const sql = "INSERT INTO users (username, email, password, dateCreated) VALUES (?, ?, ?, ?)";
  const date = new Date().toISOString().slice(0, 19).replace("T", " ");

  db.query(sql, [username, email, password, date], (err, result) => {
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
