import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import telegramApi from 'node-telegram-bot-api'

import {dirname} from 'path'
import {fileURLToPath} from 'url'

// My scripts
import * as dbFunctions from './db/db_functions.js'

import * as quizFuncs from './modules/quiz-functional.js'
import * as botFuncs from './modules/bot-functions.js'

dotenv.config({path: '../.env'})

const botToken = process.env.token
const bot = new telegramApi(botToken, {polling: true})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get the directory where we will save json files sent by the user
const uploadFilesDir = path.join(__dirname, 'uploaded_files') 

// Variable to which the questions will be written after parsing the file.json
let questions = {}

// Variables for quiz functionality (quiz in one message)
export const answerMsgIdState = {
    answerMessageId: null
}
let currentMessageText = ""

export const completedQuizzes = {}

// Flags
let canStart = false
let addedJsonFile = false

// Create a menu of commands for the bot
bot.setMyCommands([
    {command: '/info', description: '❕ Get information about you'},
    {command: '/change_role', description: '❕ Change your role'},
    {command: '/can_start_quiz', description: '❕ Provide an opportunity to take the test (teacher)'},
    {command: '/quiz', description: '❕ Start taking the test if given the opportunity to do so (student)'},
])

// User messages
bot.on('message', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    const messageId = message.message_id

    // If a user has written /start we get data about him/her
    // whether it is stored in the database or not
    if (message.text === '/start') {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Hi! 👋\nYou are already registered with this bot as ${user.role}`)
            } else {
                const startOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: '🧑‍🎓 Register as a student', callback_data: 'register_student'}],
                            [{text: '👨‍🏫 Log in as a teacher', callback_data: 'login_teacher'}],
                        ],
                    },
                }
        
                await bot.sendMessage(chatId, 'Hello! 👋\nYou can sign up for this bot as a student 🧑‍🎓 or log in as a teacher 👨‍🏫 to create quizzes! \n❕ Find out your status: /info', startOptions)
            }
        })
    }

    // If the user wants to retrieve data about him/herself
    if (message.text === '/info')  {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `👉 Your first and last names: ${user.firstName} ${user.lastName} \n👉 Your status: ${user.role}`)
            } else {
                await bot.sendMessage(chatId, '😓 You are not logged into this bot')
            }
        })
    }

    // If the user wants to take help with bot commands
    if (message.text === '/help')  {
        await bot.sendMessage(chatId, "Hi! 👋🤘\nDo you need some help? 🤔\nHere's a list of my commands that can help you:\n\n/start - starts your communication with me\n/help - will give you a list of commands that can help you\n/info - will give you information about yourself, your status, whether you are registered or not.\n/change_role - allows you to change your role, for example from student to teacher.\n/can_start_quiz - command that allows you to pass quiz. Available only to teacher 👨‍🏫\n/quiz - command to start a quiz. Available only to the student 🧑‍🎓\n\nAlso remember that you always have a menu of my commands that can help you 🤗")
    }

    // Command to change role
    if (message.text === '/change_role')  {
        botFuncs.checkUserRole(userId, bot, chatId)
    }

    // If the user wants to start taking the test
    if (message.text === '/quiz') {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user.role === 'student' && canStart && !completedQuizzes[chatId]) {
                await dbFunctions.clearProgress(userId)

                // Resetting the question index for a user
                quizFuncs.userQuestions[chatId] = 0
                await quizFuncs.sendQuestion(chatId, messageId, questions, bot)
            } else {
                await bot.sendMessage(chatId, '❗️ Passing the test is not allowed!\n❗️ Or, if you are a teacher, you cannot take the test')
            }
        })
    }

    // Command authorising to start the test (available only to the teacher)
    if (message.text === '/can_start_quiz') {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user.role === 'teacher') {
                if (addedJsonFile) {
                    canStart = true
                    completedQuizzes[chatId] = false
                    bot.sendMessage(chatId, '🔥👍 You have successfully created a quiz!\n🤔 Now your students can start quiz with command /quiz')
                } else {
                    bot.sendMessage(chatId, '❗️ You did not upload a .json file with questions ❗️')
                }
            } else {
                await bot.sendMessage(chatId, '❗️ Only the teacher has the right to start the quiz ❗️')
            }
        })
    }

    if (message.text !== '/start' &&
        message.text !== '/info' &&
        message.text !== '/help' &&
        message.text !== '/change_role' &&
        message.text !== '/quiz' &&
        message.text !== '/can_start_quiz'
        ) {
        await bot.sendMessage(chatId, "Hi! 👋🤘\nDo you need some help? 🤔\nHere's a list of my commands that can help you:\n\n/start - starts your communication with me\n/help - will give you a list of commands that can help you\n/info - will give you information about yourself, your status, whether you are registered or not.\n/change_role - allows you to change your role, for example from student to teacher.\n/can_start_quiz - command that allows you to pass quiz. Available only to teacher 👨‍🏫\n/quiz - command to start a quiz. Available only to the student 🧑‍🎓\n\nAlso remember that you always have a menu of my commands that can help you 🤗")
    }
})

// Processing callback functions
bot.on('callback_query', async function(query) {
    const chatId = query.message.chat.id
    const userId = query.from.id
    const messageId = query.message.message_id

    const username = query.from.username || ''
    const firstName = query.from.first_name || ''
    const lastName = query.from.last_name || ''

    const userIndex = quizFuncs.userQuestions[chatId] || 0
    const currentQuestion = questions[userIndex]

    // Sign up as a student
    if (query.data === 'register_student') {
        dbFunctions.addUser(userId, username, firstName, lastName, 'student')
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        await bot.sendMessage(chatId, '🧑‍🎓 You are registered in this bot as a student')
        return
    }

    // Sign in as a teacher
    if (query.data === 'login_teacher') {
        botFuncs.teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, false)
        return
    }

    // Role change from student to teacher
    if (query.data === 'switch_to_teacher') {
        botFuncs.teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, true)
        return
    } 
    
    if (query.data === 'switch_to_student') {
        // Role change from teacher to student
        delete quizFuncs.userQuestions[chatId]
        dbFunctions.updateUserRole(userId, 'student', () => {
            bot.sendMessage(chatId, "🧑‍🎓 Your role has been changed to student")
        })
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }
    
    if (query.data === 'cancel_change_role') {
        // Cancelling a role change
        await bot.sendMessage(chatId, "🤨 Role change cancelled")
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }

    // Check if there is no current issue, avoid executing the code
    if (!currentQuestion) {
        return // If there is no question, we don't do anything further
    }

    // Processing of responses to questions
    const answerIndex = parseInt(query.data)
    const isCorrect = answerIndex === currentQuestion.correct

    const numberQuestion = quizFuncs.userQuestions[userId]

    let questionResult = {}
    let userProgressJSON

    if (isCorrect) {
        const correctAnswerText = "✅ That's the right answer! ✅"
        
        questionResult[numberQuestion] = 1
        quizFuncs.userProgress.push(questionResult)

        // Determining whether a reply message has been sent or not
        // it's done by its message_id
        if (answerMsgIdState.answerMessageId) {
            // Check if the existing text matches the text that will be added
            // If they match, an error will occur
            if (currentMessageText !== correctAnswerText) {
                await bot.editMessageText(correctAnswerText, {
                    chat_id: chatId,
                    message_id: answerMsgIdState.answerMessageId
                })
                currentMessageText = correctAnswerText
            }
        } else {
            const sentMessage = await bot.sendMessage(chatId, correctAnswerText)
            answerMsgIdState.answerMessageId = sentMessage.message_id
            currentMessageText = correctAnswerText
        }
        
        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dbFunctions.updateProgress(userProgressJSON, userId)
    } else {
        const wrongAnswerText = `❌ Wrong answer! The correct answer: ${currentQuestion.options[currentQuestion.correct]} ❌`
        
        questionResult[numberQuestion] = 0
        quizFuncs.userProgress.push(questionResult)

        // Determining whether a reply message has been sent or not
        // it's done by its message_id
        if (answerMsgIdState.answerMessageId) {
            // Check if the existing text matches the text that will be added
            // If they match, an error will occur
            if (currentMessageText !== wrongAnswerText) {
                await bot.editMessageText(wrongAnswerText, {
                    chat_id: chatId,
                    message_id: answerMsgIdState.answerMessageId
                })
                currentMessageText = wrongAnswerText
            }
        } else {
            const sentMessage = await bot.sendMessage(chatId, wrongAnswerText)
            answerMsgIdState.answerMessageId = sentMessage.message_id
            currentMessageText = wrongAnswerText
        }
        
        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dbFunctions.updateProgress(userProgressJSON, userId)
    } 
    

    await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

    // Moving on to the next question
    quizFuncs.userQuestions[chatId] = userIndex + 1
    await quizFuncs.sendQuestion(chatId, messageId, questions, bot)
})

// Teacher uploading .json file with test questions
bot.on('document', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    
    const fileId = message.document.file_id
    const fileName = message.document.file_name

    // Checking that the file is .json and that it is a teacher account
    if (path.extname(fileName) === '.json') {
        dbFunctions.getUserById(userId).then(async function(user) {
            if (!user || user.role !== 'teacher') {
                return bot.sendMessage(chatId, '❗️ Only teachers are allowed to upload files! ❗️')
            }

            const localFilePath = path.join(__dirname, fileName)

            // Download the file that the user uploaded to us
            // then save this file in the /uploaded_files/
            await bot.downloadFile(fileId, uploadFilesDir)

            // Read the contents of the file at the specified path
            fs.readFile(localFilePath, 'utf8', function(error, data) {
                if (error) {
                    return bot.sendMessage(chatId, '❗️ Error during reading a file ❗️')
                }

                try {
                    // Try parsing the contents of the file
                    const json_file = JSON.parse(data)
                    questions = json_file.questions

                    bot.sendMessage(chatId, '🔥👍 The file with questions has been uploaded successfully! To start the quiz, please write /can_start_quiz')
                    addedJsonFile = true
                } catch {
                    bot.sendMessage(chatId, '❗️ Error parsing JSON file. Check the file format is correct ❗️')
                }
            })
        })
    } else {
        bot.sendMessage(chatId, '❗️ You can only upload a .json file for the quiz! ❗️')
    }
})
