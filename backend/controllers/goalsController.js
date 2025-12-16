import db from "../db/connection.js";

export const createGoal = async (req, res) => {
    const { userId, 
        distance = null, 
        duration = null, 
        pace = null, 
        stroke = null, 
        targetDate,
        activityType = null
    } = req.body;
    if (!userId  || !targetDate) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        // dateCreated will be set by the DB (NOW()) and dateCompleted left NULL.
        // Ensure number of placeholders matches the provided values (7 values -> 7 ?)
        await db.execute(
            "INSERT INTO goals (distance, duration, pace, dateCreated, dateCompleted, deadlineDate, stroke, Users_idUsers, activityType) VALUES (?, ?, ?, NOW(), NULL, ?, ?, ?, ?)",
            [distance, duration, pace, targetDate, stroke, userId, activityType]
        );
        res.status(201).json({ message: "Goal created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create goal" });
    }
};

export const getGoals = async (req, res) => {
    const { userId } = req.params;
    const { active } = req.query;
    try {
        let rows;
        if (active === 'true') {
            // return only active goals: not completed and not past their deadline (or no deadline)
            const [r] = await db.execute(
                "SELECT idGoals, distance, duration, pace, dateCreated, dateCompleted, deadlineDate, stroke, activityType FROM goals WHERE Users_idUsers = ? AND dateCompleted IS NULL AND (deadlineDate IS NULL OR deadlineDate >= CURDATE())",
                [userId]
            );
            rows = r;
        } else if (req.query.completed === 'true') {
            // return only completed goals
            const [r] = await db.execute(
                "SELECT idGoals, distance, duration, pace, dateCreated, dateCompleted, deadlineDate, stroke, activityType FROM goals WHERE Users_idUsers = ? AND dateCompleted IS NOT NULL",
                [userId]
            );
            rows = r;
        } else {
            const [r] = await db.execute(
                "SELECT idGoals, distance, duration, pace, dateCreated, dateCompleted, deadlineDate, stroke, activityType FROM goals WHERE Users_idUsers = ?",
                [userId]
            );
            rows = r;
        }
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
        stroke = null,
        activityType = null
    } = req.body;
    
    try {
        // console.log("Updating goal:", distance, duration, pace, stroke, goalId)
        await db.execute(
            "UPDATE goals SET distance = ?, duration = ?, pace = ?, dateCompleted = ?, deadlineDate = ?, stroke = ?, activityType = ? WHERE idGoals = ?",
            [distance, duration, pace, dateCompleted, deadlineDate, stroke, activityType, goalId]
        );
        res.json({ message: "Goal updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update goal" });
    }
};

export const checkIfGoalCompleted = async (userId, activityType, distance, duration, pace) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM goals WHERE Users_idUsers = ? AND activityType = ? AND dateCompleted IS NULL",
            [userId, activityType]
        );
        let completedGoalIds = [];
        for (const goal of rows) {
            if ((distance && goal.distance && distance >= goal.distance) ||
                (duration && goal.duration && duration <= goal.duration) ||
                (pace && goal.pace && pace <= goal.pace)) {
                completedGoalIds.push(goal.idGoals);
            }
        }
        return completedGoalIds;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to check for completed goals");
    }
};
