import {
    bot, 
    completedQuizzes, 
    canStart, 
    addedFile, 
    isTeacherLogin, 
    helpMessage,
    allQuestions,
    __dirname
} from "./config.js"
import handleCallbackQuery from './modules/callbackHandlers.js'
import handleFileUpload from './modules/filesHandlers.js'

import * as dbFunctions from './db/dbFunctions.js'

import * as quizFuncs from './modules/quizFunctional.js'
import * as botFuncs from './modules/botFunctions.js'


bot.setMyCommands([
    {command: '/start', description: 'Start communicating with the bot'},
    {command: '/help', description: 'Get help from the bot'},
    {command: '/info', description: 'Get information about you'},
    {command: '/change_role', description: 'Change your role'},
    {command: '/can_start_quiz', description: 'Provide an opportunity to take the quiz (teacher)'},
    {command: '/quiz', description: 'Start taking the quiz if given the opportunity to do so (student)'},
])

bot.on('message', async function(message) {
    const chatId = message.chat.id
    const userId = message.from.id
    const messageId = message.message_id

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
        
                await bot.sendMessage(chatId, 'Hello! 👋\nYou can sign up for this bot as a student or log in as a teacher to create quizzes! \n❕ Find out your status: /info', startOptions)
            }
        })
    }

    if (message.text === '/info')  {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user) {
                await bot.sendMessage(chatId, `Your first and last names: ${user.firstName} ${user.lastName} \nYour status: ${user.role}`)
            } else {
                await bot.sendMessage(chatId, '❗️ You are not logged into this bot')
            }
        })
    }

    if (message.text === '/help')  {
        await bot.sendMessage(chatId, helpMessage)
    }

    if (message.text === '/change_role')  {
        dbFunctions.getUserById(userId).then(async (user) => {

            if (user) {
                botFuncs.checkUserRole(userId, chatId)
            } else {
                await bot.sendMessage(chatId, '❗️ You are not logged into this bot!')
            }
        })
    }

    if (message.text === '/quiz') {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user.role === 'student' && canStart.canStartQuiz && !completedQuizzes[chatId]) {
                await dbFunctions.clearProgress(userId)

                // Resetting the question index for a user
                quizFuncs.userQuestions[chatId] = 0
                await quizFuncs.sendQuestion(chatId, messageId)
            } else {
                await bot.sendMessage(chatId, '❗️ Passing the quiz is not allowed!\nOr, if you are a teacher, you cannot take the quiz')
            }
        })
    }

    if (message.text === '/can_start_quiz') {
        dbFunctions.getUserById(userId).then(async (user) => {
            if (user.role === 'teacher') {
                if (addedFile.addedJsonFile) {
                    canStart.canStartQuiz = true
                    completedQuizzes[chatId] = false
                    bot.sendMessage(chatId, '👍 You have successfully created a quiz!\nNow your students can start quiz with command /quiz')
                } else {
                    bot.sendMessage(chatId, '❗️ You did not upload a .json file with questions')
                }
            } else {
                await bot.sendMessage(chatId, '❗️ Only the teacher has the right to start the quiz')
            }
        })
    }

    if (
    !message.document &&
    !isTeacherLogin.isLogin &&
    message.text !== '/start' &&
    message.text !== '/info' &&
    message.text !== '/help' &&
    message.text !== '/change_role' &&
    message.text !== '/quiz' &&
    message.text !== '/can_start_quiz'
        ) {
        await bot.sendMessage(chatId, helpMessage)
    }
})

bot.on('callback_query', async function(query) {
    await handleCallbackQuery(
        query, 
        quizFuncs, 
        dbFunctions, 
        botFuncs
    )
})

bot.on('document', async function(message) {
    await handleFileUpload(
        dbFunctions,
        message
    )
})
