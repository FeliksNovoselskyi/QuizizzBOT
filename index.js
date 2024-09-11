import dotenv from 'dotenv'
import telegramApi from 'node-telegram-bot-api'
import * as dataBase from './data-base.js'


dotenv.config()

const botToken = process.env.token
const bot = new telegramApi(botToken, {polling: true})

bot.on('message', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    const username = message.from.username || ''
    const firstName = message.from.first_name || ''
    const lastName = message.from.last_name || ''

    if (message.text === '/start') {
        dataBase.addUser(userId, username, firstName, lastName)
        await bot.sendMessage(chatId, 'Привіт! Ти зареєстрований у цьому боті як студент!')
    }

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

