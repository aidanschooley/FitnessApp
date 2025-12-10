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

export const getGoals = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT idGoals, distance, duration, pace, dateCreated, dateCompleted, deadlineDate, stroke FROM goals WHERE Users_idUsers = ?",
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve goals" });
    }
};

export const deleteGoal = async (req, res) => {
    const { goalId } = req.params;
    try {
        await db.execute(
            "DELETE FROM goals WHERE idGoals = ?",
            [goalId]
        );
        res.json({ message: "Goal deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete goal" });
    }  
};

export const updateGoal = async (req, res) => {
    const { goalId } = req.params;
    const { distance = null,
        duration = null,
        pace = null,
        dateCompleted = null, 
        deadlineDate = null, 
        stroke = null
    } = req.body;
    
    try {
        console.log("Updating goal:", distance, duration, pace, stroke, goalId),
        await db.execute(
            "UPDATE goals SET distance = ?, duration = ?, pace = ?,  dateCompleted = ?, deadlineDate = ?, stroke = ? WHERE idGoals = ?",
            [distance, duration, pace,dateCompleted, deadlineDate, stroke, goalId]
        );
        res.json({ message: "Goal updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update goal" });
    }
};

// ,
//  
