import {Sequelize, DataTypes} from 'sequelize'
import dotenv from 'dotenv'

import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

dotenv.config({path: '../.env'})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sequelize = new Sequelize(process.env.BOT_DB_NAME, process.env.BOT_DB_ADMIN_NAME, process.env.BOT_DB_PASSWORD, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: join(__dirname, `${process.env.BOT_DB_NAME}.db`)
})

export const Users = sequelize.define('Users', {
    userId: {type: DataTypes.INTEGER},
    username: {type: DataTypes.TEXT},
    firstName: {type: DataTypes.TEXT},
    lastName: {type: DataTypes.TEXT},
    role: {type: DataTypes.TEXT},
    progress: {type: DataTypes.TEXT}
})

sequelize.sync()
    .then(() => {
        console.log('База даних створена успішно')
    })
    .catch((error) => {
        console.log('Помилка під час створення бази даних:', error)
    })

// Функция в которой информация о пользователе добавляется в базу данных
export async function addUser(userId, username, firstName, lastName, role) {
    try {
        Users.create({
            userId: userId,
            username: username,
            firstName: firstName,
            lastName: lastName,
            role: role,
        })
    } catch (error) {
        console.error('Помилка при додаванні користувача:', error.message);
    }
}

// // Функция получения информации об пользователе когда он того хочет
export async function getUserById(userId) {
    try {
        const user = await Users.findOne({ where: {userId}})
        return user
    } catch (error) {
        console.error('Помилка при отриманні користувача:', error.message);
        return null
    }
}

// Функция обновляющая роль пользователя в базе данных
// в зависимости от той какая у него сейчас
export async function updateUserRole(userId, newRole, callback) {
    try {
        const [updated] = await Users.update({role: newRole}, {where: {userId}})
        
        if (updated) {
            callback()
        } else {
            console.error("Помилка: користувача з таким id не знайдено")
        }
    } catch (error) {
        console.error("Помилка при оновленні ролі:", error.message)
    }
}

// Функция обновляющая прогресс пользователя
export async function updateProgress(newList, userId) {
    try {
        await Users.update({progress: newList}, {where: {userId}})
    } catch (error) {
        console.error("Помилка при оновленні прогресу користувача:", error.message)
    }
}