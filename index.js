import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import telegramApi from 'node-telegram-bot-api'

import {dirname} from 'path'
import {fileURLToPath} from 'url'

// Мои скрипты
import * as dataBase from './data-base.js'
import * as quizFuncs from './quiz-functional.js'
import * as botFuncs from './bot-functions.js'

dotenv.config()

const botToken = process.env.token
const bot = new telegramApi(botToken, {polling: true})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) // Получаем главную директорию проекта, с помощью __filename
// Получаем директорию куда будем сохранять файлы.json отправленные пользователем
const uploadFilesDir = path.join(__dirname, 'uploaded_files') 

// Переменная в которую запишутся вопросы, после парса файла.json
let questions = {}

// Флаги
let canStart = false

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

        await bot.sendMessage(chatId, 'Привіт! Ти можеш зареєструватись у цьому боті як студент, або увійти як вчитель для створення тестів! \nДізнатись свій статус: /info', startOptions)
    }

    // Если пользователь хочет получить данные о себе
    if (message.text === '/info')  {
        dataBase.getUserById(userId, async function(user) {
            if (user) {
                await bot.sendMessage(chatId, `Ваше ім'я та фамілія: ${user.firstName} ${user.lastName} \nВаш статус: ${user.role}`)
            } else {
                await bot.sendMessage(chatId, 'Ви не зареєстровані в цьому боті')
            }
        })
    }

    // Команда для смены роли (если не будет вдруг сообщения с кнопкой для этого)
    if (message.text === '/change_role')  {
        botFuncs.checkUserRole(userId, bot, chatId)
    }

    // Если пользователь хочет начать тест
    if (message.text === '/quiz') {
        if (!canStart) {
            await bot.sendMessage(chatId, 'Тестування ще не розпочато!')
        } else {
            quizFuncs.userQuestions[chatId] = 0 // Сброс индекса вопроса для пользователя
            await quizFuncs.sendQuestion(chatId, questions, bot)
        }
    }
})

// Обработка callback функций
bot.on('callback_query', async function(query) {
    const chatId = query.message.chat.id
    const userId = query.from.id
    const messageId = query.message.message_id

    const username = query.from.username || ''
    const firstName = query.from.first_name || ''
    const lastName = query.from.last_name || ''

    const userIndex = quizFuncs.userQuestions[chatId] || 0
    const currentQuestion = questions[userIndex]

    // Если пришёл колбек от ответа на вопрос
    if (currentQuestion) {
        const answerIndex = parseInt(query.data)
        const isCorrect = answerIndex === currentQuestion.correct

        if (isCorrect) {
            await bot.sendMessage(chatId, 'Вірна відповідь!')
        } else {
            await bot.sendMessage(chatId, `Неправильна відповідь! Правильна відповідь: ${currentQuestion.options[currentQuestion.correct]}`)
        }

        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

        // Переход к следующему вопросу
        // console.log(quizFuncs.userQuestions)
        quizFuncs.userQuestions[chatId] = userIndex + 1
        await quizFuncs.sendQuestion(chatId, questions, bot)
    }

    // Регистрация как ученик
    if (query.data === 'register_student') {
        botFuncs.updateRoleButtons(chatId, bot, messageId)
        dataBase.addUser(userId, username, firstName, lastName, 'student')
        await bot.sendMessage(chatId, 'Ви зареєстровані в цьому боті як студент')
    }

    // Вход как учитель
    if (query.data === 'login_teacher') {
        botFuncs.teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, false)
    }

    // Смена роли
    if (query.data === 'change_role') {
        botFuncs.checkUserRole(userId, bot, chatId)
    }

    // Смена роли с студента на учителя
    if (query.data === 'switch_to_teacher') {
        botFuncs.teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, true)

    } else if (query.data === 'switch_to_student') {
        // Смена роли с учителя на студента
        dataBase.updateUserRole(userId, 'student', () => {
            bot.sendMessage(chatId, "Ваша роль змінена на студента")
            botFuncs.updateRoleButtons(chatId, bot, messageId) // Очищаем старые кнопки и добавляем новую
        })

    } else if (query.data === 'cancel_change_role') {
        // Отмена смены роли
        bot.sendMessage(chatId, "Зміна ролі відмінена")
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
    }
})

// Загрузка учителем .json файла с вопросами теста
bot.on('document', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    
    const fileId = message.document.file_id
    const fileName = message.document.file_name

    // Проверка, что файл является.json и что это учительский аккаунт
    if (path.extname(fileName) === '.json') {
        dataBase.getUserById(userId, async function(user) {
            if (!user || user.role !== 'teacher') {
                return bot.sendMessage(chatId, 'Завантажувати файли має право тільки вчитель!')
            }

            const localFilePath = path.join(__dirname, fileName)

            // Скачиваем файл который закинул нам пользователь
            // далее сохраняем этот файл в папке uploaded_files
            await bot.downloadFile(fileId, uploadFilesDir)

            // Читаем содержимое файла по указанному пути
            fs.readFile(localFilePath, 'utf8', function(error, data) {
                if (error) {
                    return bot.sendMessage(chatId, 'Помилка при прочитанні файлу')
                }

                try {
                    // Пробуем парсить содержимое файла
                    const json_file = JSON.parse(data)
                    questions = json_file.questions

                    bot.sendMessage(chatId, 'Файл з питаннями завантажений успішно! Щоб почати тест напішить /quiz')
                    // console.log(questions) // Выводим файл (ВРЕМЕННО)
                    canStart = true
                } catch {
                    bot.sendMessage(chatId, 'Помилка при парсингу JSON файлу. Перевірте правильність формату файлу')
                }
            })
        })
    } else {
        bot.sendMessage(chatId, 'Завантажити для тесту можна тільки .json файл!')
    }
})
