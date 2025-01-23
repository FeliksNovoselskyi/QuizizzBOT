import {
    bot,
    allQuestions,
    answerMsgIdState,
    isTeacherLogin,
    currentMessageText,
    __dirname
} from "../config.js"

import {
    writeAnswerResult
} from "../utils.js"


export default async function handleCallbackQuery(query, quizFuncs, dbFunctions, botFuncs) {
    const chatId = query.message.chat.id
    const userId = query.from.id
    const messageId = query.message.message_id

    const username = query.from.username || ''
    const firstName = query.from.first_name || ''
    const lastName = query.from.last_name || ''

    const userIndex = quizFuncs.userQuestions[chatId] || 0
    const currentQuestion = allQuestions.questions[userIndex]


    if (query.data === 'register_student') {
        dbFunctions.addUser(userId, username, firstName, lastName, 'student')
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        await bot.sendMessage(chatId, 'You are registered in this bot as a student')
        return
    }

    if (query.data === 'login_teacher') {
        isTeacherLogin.isLogin = true
        botFuncs.teacherLogin(chatId, messageId, userId, username, firstName, lastName, false)
        return
    }

    if (query.data === 'switch_to_teacher') {
        isTeacherLogin.isLogin = true
        botFuncs.teacherLogin(chatId, messageId, userId, username, firstName, lastName, true)
        return
    } 
    
    if (query.data === 'switch_to_student') {
        delete quizFuncs.userQuestions[chatId]
        dbFunctions.updateUserRole(userId, 'student', () => {
            bot.sendMessage(chatId, "Your role has been changed to student")
        })
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }
    
    if (query.data === 'cancel_change_role') {
        await bot.sendMessage(chatId, "Role change cancelled")
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        return
    }

    if (!currentQuestion) {
        return
    }

    const answerIndex = parseInt(query.data)
    const isCorrect = answerIndex === currentQuestion.correct

    const numberQuestion = quizFuncs.userQuestions[userId]

    let questionResult = {}
    let userProgressJSON

    if (isCorrect) {
        const correctAnswerText = "✅ That's the right answer!"
        
        await writeAnswerResult(1, correctAnswerText, questionResult, quizFuncs, numberQuestion, chatId, userId, userProgressJSON, dbFunctions)
    } else {
        const wrongAnswerText = `❌ Wrong answer! The correct answer: ${currentQuestion.options[currentQuestion.correct]}`
        
        await writeAnswerResult(0, wrongAnswerText, questionResult, quizFuncs, numberQuestion, chatId, userId, userProgressJSON, dbFunctions)
    } 

    await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

    // Moving on to the next question
    quizFuncs.userQuestions[chatId] = userIndex + 1
    await quizFuncs.sendQuestion(chatId, messageId)
}
