import db from "../db/connection.js";

export const uploadActivity = async (req, res) => {
    const {
    userid,
    distance,
    duration,
    ispublic = true,
    notes = null,
    pace = null,
    elevationGained = null,
    cadence = null,
    intensity = null,
    picture = null,
    rpm = null,
    stroke = null,
    activityType
    } = req.body;

    if (!userid || !distance || !duration || !activityType) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        await db.execute(
            `INSERT INTO activity
            (distance, duration, ispublic, notes, pace, elevationGained, cadence,intensity, picture, rpm, stroke, Users_idUsers, activityType, dateCreated)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                distance,   
                duration,
                ispublic,
                notes,
                pace,
                elevationGained,
                cadence,
                intensity,
                picture,
                rpm,
                stroke,
                userid,        
                activityType   
            ]
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to upload activity" });
    }
    res.status(200).json({ message: "Activity uploaded successfully" });
}

export const getActivitySummary = async (req, res) => {
    const { userid } = req.query;
    if (!userid) {
        return res.status(400).json({ error: "Missing user ID" });
    }
    try {
        const [rows] = await db.execute(
            `SELECT activityType, distance, duration, intensity, dateCreated
            FROM activity
            WHERE Users_idUsers = ?
            ORDER BY dateCreated DESC
            LIMIT 10`,
            [userid]
        );
        res.status(200).json({ activities: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve activity summary" });
    }
    res.status(200).json({ message: "Activity summary retrieved successfully" });
}

export const getActivityById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT * FROM activity WHERE idActivity = ?",
            [id]
        );
        const activity = rows[0];
        if (!activity) {
            return res.status(404).json({ error: "Activity not found" });
        }
        res.json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve activity" });
    }
};

export const updateActivity = async (req, res) => {
    const { id } = req.params;
    const { distance, duration, notes, ispublic} = req.body;
    try {
        await db.execute(
            "UPDATE activity SET distance = ?, duration = ?, notes = ?, ispublic = ? WHERE idActivity = ?",
            [distance, duration, notes, ispublic, id]
        );
        res.json({ message: "Activity updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update activity" });
    }
};

export const deleteActivity = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute(
            "DELETE FROM activity WHERE idActivity = ?",
            [id]
        );
        res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete activity" });
    }
};

export const filterActivitiesByTypeDate = async (req, res) => {
    const { userid, activityType, date } = req.query;

    if (!userid) {
        return res.status(400).json({ error: "Missing user ID" });
    }

    let query = `SELECT * FROM activity WHERE Users_idUsers = ?`;
    const params = [userid];

    if (activityType) {
        query += ` AND activityType = ?`;
        params.push(activityType);
    }
    if (date) {
        query += ` AND dateCreated >= ?`;
        params.push(date);
    }

    try {
        const [rows] = await db.execute(query, params);
        // Only one response
        res.status(200).json({ activities: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to filter activities" });
    }
};


export default {
    uploadActivity,
    getActivitySummary,
    getActivityById,
    updateActivity,
    deleteActivity,
    filterActivitiesByTypeDate
};