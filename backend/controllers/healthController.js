import db from "../db/connection.js";

export const getCurrentHealthIdByUserId = async (userId) => {
    try {
        const [rows] = await db.execute(
            "SELECT idCurrentHealth FROM currenthealth WHERE Users_idUsers = ?",
            [userId]
        );
        if (rows.length > 0) {
            return rows[0].idCurrentHealth;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to retrieve current health ID");
    }
};

export const setCurrentHealth = async (req, res) => {
    const { weight, height, BMI, age, userId } = req.body;
    try {
        await db.execute(
            "INSERT INTO currenthealth (weight, height, BMI, age, Users_idUsers) VALUES (?, ?, ?, ?, ?)",
            [weight, height, BMI, age, userId]
        );
        res.status(201).json({ message: "Current health data set successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to set current health data" });
    }
};

export const updateHealthData = async (req, res) => {
    const { weight = null, 
        height = null, 
        age = null, 
        userId
    } = req.body;
    try {
        await db.execute(
            "UPDATE currenthealth SET weight = ?, height = ?, age = ? WHERE Users_idUsers = ?",
            [weight, height, age, userId]
        );
        res.json({ message: "Health data updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update health data" });
    }
};

export const getHealthByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT weight, height, age, weightGoal, calorieGoal, waterGoal FROM currenthealth WHERE Users_idUsers = ?",
            [userId]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve health data" });
    }
};

export const setHealthGoals = async (req, res) => {
    const { weightGoal, calorieGoal, waterGoal, userId } = req.body;
    try {
        await db.execute(
            "UPDATE currenthealth SET weightGoal = ?, calorieGoal = ?, waterGoal = ? WHERE Users_idUsers = ?",
            [weightGoal, calorieGoal, waterGoal, userId]
        );
        res.status(201).json({ message: "Health goals set successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to set health goals" });
    }
};

export const getHealthGoalsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT weightGoal, calorieGoal, waterGoal FROM currenthealth WHERE Users_idUsers = ?",
            [userId]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve health goals" });
    }
};

export const updateCalorieIntake = async (req, res) => {
    const { amount,time,meal, userId } = req.body;
    const currentHealthId = await getCurrentHealthIdByUserId(userId);
    try {
        await db.execute(
            "INSERT INTO calories (date, amount, time, meal, CurrentHealth_idCurrentHealth) VALUES (NOW(), ?, ?, ?, ?)",
            [amount, time, meal,currentHealthId]
        );
        res.status(201).json({ message: "Calorie intake updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update calorie intake" });
    }
};

export const getCalorieIntakeByUserId = async (req, res) => {
    const { userId } = req.params;
    const currentHealthId = await getCurrentHealthIdByUserId(userId);
    try {
        const [rows] = await db.execute(
            "SELECT idCalories, date, amount, time, meal FROM calories WHERE CurrentHealth_idCurrentHealth = ?",
            [currentHealthId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve calorie intake data" });
    }
};

export const updateHydrationData = async (req, res) => {
    const { amount, time, userId } = req.body;
    const currentHealthId = await getCurrentHealthIdByUserId(userId);
    try {
        await db.execute(
            "INSERT INTO water (date, amount, time, CurrentHealth_idCurrentHealth) VALUES (NOW(), ?, ?, ?)",
            [amount, time, currentHealthId]
        );
        res.status(201).json({ message: "Hydration data updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update hydration data" });
    }
};

export const getHydrationDataByUserId = async (req, res) => {
    const { userId } = req.params;
    const currentHealthId = await getCurrentHealthIdByUserId(userId);
    try {
        const [rows] = await db.execute(
            "SELECT idWater, date, amount, time FROM water WHERE CurrentHealth_idCurrentHealth = ?",
            [currentHealthId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve hydration data" });
    }
};

export const updateWeightData = async (req, res) => {
    const { weight, userId } = req.body;
    const currentHealthId = await getCurrentHealthIdByUserId(userId);
    try {
        await db.execute(
            "INSERT INTO weight (weight, date, CurrentHealth_idCurrentHealth) VALUES (?, NOW() , ?)",
            [weight, currentHealthId]
        );
        res.status(201).json({ message: "Weight data updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update weight data" });
    }
};

export const getWeightDataByUserId = async (req, res) => {
    const { userId } = req.params;
    const currentHealthId = await getCurrentHealthIdByUserId(userId);
    try {
        const [rows] = await db.execute(
            "SELECT idWeight, weight, date FROM weight WHERE CurrentHealth_idCurrentHealth = ?",
            [currentHealthId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve weight data" });
    }
};