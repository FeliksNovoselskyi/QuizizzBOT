import {
    bot,
    allQuestions,
    answerMsgIdState,
    isTeacherLogin,
    currentMessageText,
    __dirname
} from "../config.js"


// Processing callback functions
// bot.on('callback_query', async function(query) {
export default async function handleCallbackQuery(query, quizFuncs, dbFunctions, botFuncs) {
    const chatId = query.message.chat.id
    const userId = query.from.id
    const messageId = query.message.message_id

    const username = query.from.username || ''
    const firstName = query.from.first_name || ''
    const lastName = query.from.last_name || ''

    const userIndex = quizFuncs.userQuestions[chatId] || 0
    const currentQuestion = allQuestions.questions[userIndex]

    // Sign up as a student
    if (query.data === 'register_student') {
        dbFunctions.addUser(userId, username, firstName, lastName, 'student')
        await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
        await bot.sendMessage(chatId, '🧑‍🎓 You are registered in this bot as a student')
        return
    }

    // Sign in as a teacher
    if (query.data === 'login_teacher') {
        isTeacherLogin.isLogin = true
        botFuncs.teacherLogin(chatId, messageId, userId, username, firstName, lastName, false)
        return
    }

    // Role change from student to teacher
    if (query.data === 'switch_to_teacher') {
        isTeacherLogin.isLogin = true
        botFuncs.teacherLogin(chatId, messageId, userId, username, firstName, lastName, true)
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
            if (currentMessageText.messageText !== correctAnswerText) {
                await bot.editMessageText(correctAnswerText, {
                    chat_id: chatId,
                    message_id: answerMsgIdState.answerMessageId
                })
                currentMessageText.messageText = correctAnswerText
            }
        } else {
            const sentMessage = await bot.sendMessage(chatId, correctAnswerText)
            answerMsgIdState.answerMessageId = sentMessage.message_id
            currentMessageText.messageText = correctAnswerText
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
            if (currentMessageText.messageText !== wrongAnswerText) {
                await bot.editMessageText(wrongAnswerText, {
                    chat_id: chatId,
                    message_id: answerMsgIdState.answerMessageId
                })
                currentMessageText.messageText = wrongAnswerText
            }
        } else {
            const sentMessage = await bot.sendMessage(chatId, wrongAnswerText)
            answerMsgIdState.answerMessageId = sentMessage.message_id
            currentMessageText.messageText = wrongAnswerText
        }
        
        userProgressJSON = JSON.stringify(quizFuncs.userProgress)
        dbFunctions.updateProgress(userProgressJSON, userId)
    } 
    

    await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

    // Moving on to the next question
    quizFuncs.userQuestions[chatId] = userIndex + 1
    await quizFuncs.sendQuestion(chatId, messageId)
}
