import db from "../db/connection.js";

export const getRecords = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT idRecords, recordType, recordValue, dateAchieved FROM records WHERE Users_idUsers = ?",
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve records" });
    }
};

export const checkIfNewRecord = async (userId, activityType, distance, duration, pace) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM records WHERE Users_idUsers = ? AND activityType = ?",
            [userId, activityType]
        );
        let isNewRecord = false;

        if (rows.length === 0) {
            isNewRecord = true;
        } else {
            const existingRecord = rows[0];
            if ((distance && distance > existingRecord.recordValue) ||
                (duration && duration < existingRecord.recordValue) ||
                (pace && pace < existingRecord.recordValue)) {
                isNewRecord = true;
            }
        }

        return isNewRecord;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to check for new record");
    }
};


export const makeRecord = async (req, res) => {
    const { distance, duration, pace, stroke, Users_idUsers, activityType } = req.body;
    if (!Users_idUsers || !activityType === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        await db.execute(
            "INSERT INTO records (distance, duration, pace, date, stroke, Users_idUsers, activityType) VALUES (?, ?, ?, NOW(), ?, ?, ?)",
            [distance, duration, pace, stroke, Users_idUsers, activityType]
        );
        res.status(201).json({ message: "Record created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create record" });
    }
};