import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./based.db')

// Создаем таблицу для пользователей
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY,
        username TEXT,
        firstName TEXT,
        lastName TEXT,
        role TEXT
    )
`)

// Функция в которой информация о пользователе добавляется в базу данных
export function addUser(userId, username, firstName, lastName, role) {
    db.run(
        'INSERT OR IGNORE INTO users (userId, username, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
        [userId, username, firstName, lastName, role]
    )
}

// Функция получения информации об пользователе когда он того хочет
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