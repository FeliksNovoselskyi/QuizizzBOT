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

    // Если пользователь написал /start получаем о нём данные и записываем в БД
    if (message.text === '/start') {
        const startOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Зареєструватись як студент', callback_data: 'register_student'}],
                    [{text: 'Увійти як вчитель', callback_data: 'login_teacher'}],
                ],
            },
        }

        await bot.sendMessage(chatId, 'Привіт! Ти зареєстроватись у цьому боті як студент, або увійти як вчитель для створення тестів! \nДізнатись свій статус: /info', startOptions)
    }

    // Если пользователь хочет получить данные о себе
    if (message.text === '/info')  {
        dataBase.getUserById(userId, async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Ваше ім'я та фамілія: ${user.firstName} ${user.lastName} \nВаш статус: ${user.role} \n`)
            } else {
                await bot.sendMessage(chatId, 'Ви не зареєстровані в цьому боті')
            }
        })
    }
})

// Обработка callback функций
bot.on('callback_query', async function(query) {
    const chatId = query.message.chat.id
    const userId = query.from.id
    const username = query.from.username || ''
    const firstName = query.from.first_name || ''
    const lastName = query.from.last_name || ''

    // Регистрация как ученик
    if (query.data === 'register_student') {
        dataBase.addUser(userId, username, firstName, lastName, 'student')
        await bot.sendMessage(chatId, 'Ви зареєстровані в цьому боті як студент')
    }

    // Вход как учитель
    if (query.data === 'login_teacher') {
        await bot.sendMessage(chatId, 'Введіть пароль від акаунту вчителя')

        const teacherPassword = process.env.teacherPassword
        // console.log(teacherPassword)
        bot.once('message', async (message) => {
            const userInputPassword = message.text

            // Проверка верности пароля введенного пользователем
            if (userInputPassword === teacherPassword) {
                dataBase.addUser(userId, username, firstName, lastName, 'teacher')
                await bot.sendMessage(chatId, 'Ви успішно увійшли як вчитель! \nТепер ви можете завантажити JSON файл с питаннями вашого тесту, та розпочати тест для ваших студентів!')
            } else {
                await bot.sendMessage(chatId, 'Невірний пароль! \nСпробуйте знову \nДля цього нажміть на кнопку входу знову')
            }
        })
    }

})
