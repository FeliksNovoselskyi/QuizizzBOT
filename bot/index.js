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

dotenv.config({path: '../.env'})

const botToken = process.env.token
const bot = new telegramApi(botToken, {polling: true})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename) // Получаем главную директорию проекта, с помощью __filename
// Получаем директорию куда будем сохранять файлы.json отправленные пользователем
const uploadFilesDir = path.join(__dirname, 'uploaded_files') 

// Переменная в которую запишутся вопросы, после парса файла.json
let questions = {}

export const completedQuizzes = {}

// Флаги
let canStart = false
let addedJsonFile = false

// Создаём меню команд для бота
bot.setMyCommands([
    {command: '/info', description: 'Отримати інформацію про себе'},
    {command: '/change_role', description: 'Змінити свою роль'},
    {command: '/can_start_quiz', description: 'Надати можливість проходити тест (вчитель)'},
    {command: '/quiz', description: 'Розпочати проходження тесту, якщо надана можливість його розпочати (студент)'},
])

// Сообщения пользователя
bot.on('message', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id

    // Если пользователь написал /start получаем о нём данные и записываем в БД
    if (message.text === '/start') {
        dataBase.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Привіт! Ти вже зареєстрований у цьому боті як ${user.role}`)
            } else {
                const startOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Зареєструватись як студент', callback_data: 'register_student' }],
                            [{ text: 'Увійти як вчитель', callback_data: 'login_teacher' }],
                        ],
                    },
                }
        
                await bot.sendMessage(chatId, 'Привіт! Ти можеш зареєструватись у цьому боті як студент, або увійти як вчитель для створення тестів! \nДізнатись свій статус: /info', startOptions)
            }
        })
    }

    // Если пользователь хочет получить данные о себе
    if (message.text === '/info')  {
        dataBase.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Ваше ім'я та прізвище: ${user.firstName} ${user.lastName} \nВаш статус: ${user.role}`)
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
        dataBase.getUserById(userId).then(async (user) => {
            if (user.role === 'student' && canStart && !completedQuizzes[chatId]) {
                await dataBase.clearProgress(userId)
                quizFuncs.userQuestions[chatId] = 0 // Сброс индекса вопроса для пользователя
                await quizFuncs.sendQuestion(chatId, questions, bot)
            } else {
                await bot.sendMessage(chatId, 'Проходження тесту не дозволено!\nАбо, якщо ви вчитель, ви не можете проходити тест')
            }
        })
    }

    if (message.text === '/can_start_quiz') {
        dataBase.getUserById(userId).then(async (user) => {
            if (user.role === 'teacher') {
                if (addedJsonFile) {
                    canStart = true
                    completedQuizzes[chatId] = false
                    bot.sendMessage(chatId, 'Ви успішно створили тест!\nТепер ваші студенти можуть розпочинати тестування командою /quiz')
                } else {
                    bot.sendMessage(chatId, 'Ви не завантажили .json файл із питаннями')
                }
            } else {
                await bot.sendMessage(chatId, 'Розпочати тест має право тільки вчитель')
            }
        })
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

    // Регистрация как ученик
    if (query.data === 'register_student') {
        dataBase.addUser(userId, username, firstName, lastName, 'student')
        await bot.sendMessage(chatId, 'Ви зареєстровані в цьому боті як студент')
        return
    }

    // Вход как учитель
    if (query.data === 'login_teacher') {
        botFuncs.teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, false)
        return
    }

    // Смена роли с студента на учителя
    if (query.data === 'switch_to_teacher') {
        botFuncs.teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, true)
        return
    } 
    
    if (query.data === 'switch_to_student') {
        // Смена роли с учителя на студента
        delete quizFuncs.userQuestions[chatId]
        dataBase.updateUserRole(userId, 'student', () => {
            bot.sendMessage(chatId, "Ваша роль змінена на студента")
        })
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }
    
    if (query.data === 'cancel_change_role') {
        // Отмена смены роли
        await bot.sendMessage(chatId, "Зміна ролі відмінена")
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }

    // Проверяем, если нет текущего вопроса, избегаем выполнения кода
    if (!currentQuestion) {
        return // Если вопроса нет, ничего дальше не делаем
    }

    // Обработка ответов на вопросы
    const answerIndex = parseInt(query.data)
    const isCorrect = answerIndex === currentQuestion.correct

    const numberQuestion = quizFuncs.userQuestions[userId]

    let questionResult = {}

    let userProgressJSON

    if (isCorrect) {
        await bot.sendMessage(chatId, 'Вірна відповідь!')

        questionResult[numberQuestion] = 1
        quizFuncs.userProgress.push(questionResult)

        // console.log(quizFuncs.userProgress)
        // console.log(userProgressJSON)

        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dataBase.updateProgress(userProgressJSON, userId)
    } else {
        await bot.sendMessage(chatId, `Неправильна відповідь! Правильна відповідь: ${currentQuestion.options[currentQuestion.correct]}`)
        
        questionResult[numberQuestion] = 0
        quizFuncs.userProgress.push(questionResult)
        
        // console.log(quizFuncs.userProgress)
        // console.log(userProgressJSON)

        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dataBase.updateProgress(userProgressJSON, userId)
    }

    await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

    // Переход к следующему вопросу
    quizFuncs.userQuestions[chatId] = userIndex + 1
    await quizFuncs.sendQuestion(chatId, questions, bot)
})

// Загрузка учителем .json файла с вопросами теста
bot.on('document', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    
    const fileId = message.document.file_id
    const fileName = message.document.file_name

    // Проверка, что файл является.json и что это учительский аккаунт
    if (path.extname(fileName) === '.json') {
        dataBase.getUserById(userId).then(async function(user) {
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

                    bot.sendMessage(chatId, 'Файл з питаннями завантажений успішно! Щоб надати можливість розпочати тест напишіть /can_start_quiz')
                    // console.log(questions) // Выводим файл (ВРЕМЕННО)
                    addedJsonFile = true
                } catch {
                    bot.sendMessage(chatId, 'Помилка при парсингу JSON файлу. Перевірте правильність формату файлу')
                }
            })
        })
    } else {
        bot.sendMessage(chatId, 'Завантажити для тесту можна тільки .json файл!')
    }
})
