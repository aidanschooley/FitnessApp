import db from "../db/connection.js";

export const insertUser = async (name, email, password) => {
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return result;
}

export const findUserByEmailAndPassword = async (email, password) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password]
    );
    return rows[0];
}