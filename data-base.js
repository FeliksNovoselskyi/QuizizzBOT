import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./based.db')

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY,
        username TEXT,
        firstName TEXT,
        lastName TEXT
    )
`)

export function addUser(userId, username, firstName, lastName) {
    db.run(
        'INSERT OR IGNORE INTO users (userId, username, firstName, lastName) VALUES (?, ?, ?, ?)',
        [userId, username, firstName, lastName]
    )
}

export function getUserById(userId, callback) {
    db.get('SELECT * FROM users WHERE userId = ?', [userId], (error, row) => {
        if (error) {
            console.error(error.message)
            callback(null)
        } else {
            callback(row)
        }
    })
}