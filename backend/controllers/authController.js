import db from "../db/connection.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.execute(
            "INSERT INTO users (username, email, password, dateCreated) VALUES (?, ?, ?, NOW())",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Registration failed" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        // Find user by email
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // const token = jwt.sign({ id: user.ID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.json({
            message: "Login successful",
            user: {
                id: user.ID,
                username: user.Username,
                email: user.Email
            }
        });    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Login failed" });
    }
};


