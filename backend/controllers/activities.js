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