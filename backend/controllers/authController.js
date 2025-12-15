import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        // Compare passwords (support multiple possible DB column names)
        const hashedPassword = user.password ?? user.Password ?? user.PasswordHash ?? user.Passwordhash;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.idUsers ?? user.ID ?? user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: "1h" });

        const userForClient = {
            idUsers: user.idUsers ?? user.ID ?? user.id,
            username: user.username ?? user.Username ?? user.userName ?? user.name,
            email: user.email ?? user.Email
        };

        return res.json({
            message: "Login successful",
            token,
            user: userForClient
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Login failed" });
    }
};


