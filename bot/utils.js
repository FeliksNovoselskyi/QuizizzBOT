import {
    bot,
    answerMsgIdState,
    currentMessageText,
    __dirname
} from "./config.js"

export async function writeAnswerResult(answerResult, resultAnswerText, questionResult, quizFuncs, numberQuestion, chatId, userId, userProgressJSON, dbFunctions) {
    questionResult[numberQuestion] = answerResult
    quizFuncs.userProgress.push(questionResult)

    if (answerMsgIdState.answerMessageId) {
        // Check if there is a message with the result of the answer to the question
        if (currentMessageText.messageText !== resultAnswerText) {
            await bot.editMessageText(resultAnswerText, {
                chat_id: chatId,
                message_id: answerMsgIdState.answerMessageId
            })
            currentMessageText.messageText = resultAnswerText
        }
    } else {
        const sentMessage = await bot.sendMessage(chatId, resultAnswerText)
        answerMsgIdState.answerMessageId = sentMessage.message_id
        currentMessageText.messageText = resultAnswerText
    }
    
    userProgressJSON = JSON.stringify(quizFuncs.userProgress)
    dbFunctions.updateProgress(userProgressJSON, userId)
}