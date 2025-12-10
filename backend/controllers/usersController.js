import db from "../db/connection.js";

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT idUsers, username, email, dateCreated FROM users WHERE idUsers = ?",
            [id]
        );
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve user" });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        await db.execute(
            "UPDATE users SET username = ?, email = ? WHERE idUsers = ?",
            [username, email, id]
        );
        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute(
            "DELETE FROM users WHERE idUsers = ?",
            [id]
        );
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

export default { getUser, updateUser, deleteUser };