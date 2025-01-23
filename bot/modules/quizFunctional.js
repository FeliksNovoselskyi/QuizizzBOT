import fs from 'fs'
import path from 'path'

import {
    bot,
    answerMsgIdState, 
    completedQuizzes, 
    jsonFileName, 
    addedFile,
    allQuestions, 
    __dirname
} from "../config.js"


// Indexes of current issues for each user
export const userQuestions = {}
export let userProgress = []


export async function sendQuestion(chatId, messageId) {
    try {
        const userIndex = userQuestions[chatId] || 0
    
        if (userIndex < allQuestions.questions.length) {
            const currentQuestion = allQuestions.questions[userIndex]
    
            // Generate options for the inline keyboard under the message
            const options = currentQuestion.options.map((option, index) => {
                return [{text: option, callback_data: String(index)}]
            })

            if (userIndex === 0) {
                await bot.sendMessage(chatId, currentQuestion.question, {
                    reply_markup: {
                        inline_keyboard: options
                    }
                })
            } else {
                await bot.editMessageText(currentQuestion.question, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: options
                    }
                })
            }

        } else {
            let allQuestions = userProgress.length
            let allCorrectAnswers = 0

            userProgress.forEach((question) => {
                let objectValues = Object.values(question)

                allCorrectAnswers = allCorrectAnswers + parseInt(objectValues)
            })

            await bot.sendMessage(chatId, `✋ The test is over! \n\nNumber of questions: ${allQuestions} \n\nThe number of correct answers: ${allCorrectAnswers} \n\nThank you for all your answers! 🤗`)
            
            delete userQuestions[chatId]
            userProgress = []
            answerMsgIdState.answerMessageId = null

            completedQuizzes[chatId] = true
            addedFile.addedJsonFile = false
            
            const copiedFileName = jsonFileName[chatId]

            // Deleting a copy of the .json file with questions from the teacher
            const filePath = path.join(__dirname, 'uploaded_files', copiedFileName)

            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error(error)
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}