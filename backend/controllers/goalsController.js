import db from "../db/connection.js";

export const createGoal = async (req, res) => {
    const { userId, 
        distance = null, 
        duration = null, 
        pace = null, 
        stroke = null, 
        targetDate 
    } = req.body;
    if (!userId  || !targetDate) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        await db.execute(
            "INSERT INTO goals (distance, duration, pace, dateCreated, dateCompleted, deadlineDate, stroke, Users_idUsers) VALUES (?, ?, ?, NOW(), NULL, ?, ?, ?)",
            [distance, duration, pace, targetDate, stroke, userId]
        );
        res.status(201).json({ message: "Goal created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create goal" });
    }
};