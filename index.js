import dotenv from 'dotenv'
import telegramApi from 'node-telegram-bot-api'
import * as dataBase from './data-base.js'

dotenv.config()

const botToken = process.env.token
const bot = new telegramApi(botToken, {polling: true})

// Сообщения пользователя
bot.on('message', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    const username = message.from.username || ''
    const firstName = message.from.first_name || ''
    const lastName = message.from.last_name || ''

    // Если пользователь написал /start получаем о нём данные и записываем в БД
    if (message.text === '/start') {
        dataBase.addUser(userId, username, firstName, lastName)
        await bot.sendMessage(chatId, 'Привіт! Ти зареєстрований у цьому боті як студент!')
    }

    // Если пользователь хочет получить данные о себе
    if (message.text === '/info')  {
        dataBase.getUserById(userId, async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Ваше ім'я та фамілія: ${user.firstName} ${user.lastName}`)
            } else {
                await bot.sendMessage(chatId, 'Ви не зареєстровані в цьому боті')
            }
        })
    }
})

