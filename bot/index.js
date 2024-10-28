import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import telegramApi from 'node-telegram-bot-api'

import {dirname} from 'path'
import {fileURLToPath} from 'url'

// My scripts
import * as dbFunctions from './db/db_functions.js'

import * as quizFuncs from './quiz-functional.js'
import * as botFuncs from './bot-functions.js'

dotenv.config({path: '../.env'})

const botToken = process.env.token
const bot = new telegramApi(botToken, {polling: true})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get the directory where we will save json files sent by the user
const uploadFilesDir = path.join(__dirname, 'uploaded_files') 

// Variable to which the questions will be written after parsing the file.json
let questions = {}

export const completedQuizzes = {}

// Flags
let canStart = false
let addedJsonFile = false

// Create a menu of commands for the bot
bot.setMyCommands([
    {command: '/info', description: 'Get information about you'},
    {command: '/change_role', description: 'Change your role'},
    {command: '/can_start_quiz', description: 'Provide an opportunity to take the test (teacher)'},
    {command: '/quiz', description: 'Start taking the test if given the opportunity to do so (student)'},
])

// User messages
bot.on('message', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id

    // If a user has written /start we get data about him/her
    // whether it is stored in the database or not
    if (message.text === '/start') {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Hi! You are already registered with this bot as ${user.role}`)
            } else {
                const startOptions = {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Register as a student', callback_data: 'register_student'}],
                            [{text: 'Log in as a teacher', callback_data: 'login_teacher'}],
                        ],
                    },
                }
        
                await bot.sendMessage(chatId, 'Hello! You can sign up for this bot as a student or log in as a teacher to create quizzes! \nFind out your status: /info', startOptions)
            }
        })
    }

    // If the user wants to retrieve data about him/herself
    if (message.text === '/info')  {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Your first and last names: ${user.firstName} ${user.lastName} \nYour status: ${user.role}`)
            } else {
                await bot.sendMessage(chatId, 'You are not logged into this bot')
            }
        })
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
                await quizFuncs.sendQuestion(chatId, questions, bot)
            } else {
                await bot.sendMessage(chatId, 'Passing the test is not allowed!\nOr, if you are a teacher, you cannot take the test')
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
                    bot.sendMessage(chatId, 'You have successfully created a test!\nNow your students can start testing as a team /quiz')
                } else {
                    bot.sendMessage(chatId, 'You did not upload a .json file with questions')
                }
            } else {
                await bot.sendMessage(chatId, 'Only the teacher has the right to start the test')
            }
        })
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
        await bot.sendMessage(chatId, 'You are registered in this bot as a student')
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
            bot.sendMessage(chatId, "Your role has been changed to student")
        })
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }
    
    if (query.data === 'cancel_change_role') {
        // Cancelling a role change
        await bot.sendMessage(chatId, "Role change cancelled")
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
        await bot.sendMessage(chatId, "That's the right answer!")

        questionResult[numberQuestion] = 1
        quizFuncs.userProgress.push(questionResult)

        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dbFunctions.updateProgress(userProgressJSON, userId)
    } else {
        await bot.sendMessage(chatId, `Wrong answer! The correct answer: ${currentQuestion.options[currentQuestion.correct]}`)
        
        questionResult[numberQuestion] = 0
        quizFuncs.userProgress.push(questionResult)

        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dbFunctions.updateProgress(userProgressJSON, userId)
    }

    await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

    // Moving on to the next question
    quizFuncs.userQuestions[chatId] = userIndex + 1
    await quizFuncs.sendQuestion(chatId, questions, bot)
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
                return bot.sendMessage(chatId, 'Only teachers are allowed to upload files!')
            }

            const localFilePath = path.join(__dirname, fileName)

            // Download the file that the user uploaded to us
            // then save this file in the /uploaded_files/
            await bot.downloadFile(fileId, uploadFilesDir)

            // Read the contents of the file at the specified path
            fs.readFile(localFilePath, 'utf8', function(error, data) {
                if (error) {
                    return bot.sendMessage(chatId, 'Error during reading a file')
                }

                try {
                    // Try parsing the contents of the file
                    const json_file = JSON.parse(data)
                    questions = json_file.questions

                    bot.sendMessage(chatId, 'The file with questions has been uploaded successfully! To start the test, please write /can_start_quiz')
                    addedJsonFile = true
                } catch {
                    bot.sendMessage(chatId, 'Error parsing JSON file. Check the file format is correct')
                }
            })
        })
    } else {
        bot.sendMessage(chatId, 'You can only upload a .json file for the test!')
    }
})
