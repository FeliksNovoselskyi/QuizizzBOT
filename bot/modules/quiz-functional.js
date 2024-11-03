import fs from 'fs'
import path from 'path'

// My scripts
import * as indexFile from '../index.js'
import {answerMsgIdState} from '../index.js'

// Indexes of current issues for each user
export const userQuestions = {}
export let userProgress = []

// Function for sending a question with inline buttons
export async function sendQuestion(chatId, messageId, questions, bot) {
    // console.log(questions)
    try {
        const userIndex = userQuestions[chatId] || 0
    
        if (userIndex < questions.length) {
            const currentQuestion = questions[userIndex]
    
            // Generate options for the inline keyboard under the message
            const options = currentQuestion.options.map((option, index) => {
                return [{text: option, callback_data: String(index)}]
            })

            if (userIndex === 0) {
                // Sending a message with an inline keyboard
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

            await bot.sendMessage(chatId, `✋🛑 The test is over! \n\n👉 Number of questions: ${allQuestions} \n\n👉 The number of correct answers: ${allCorrectAnswers} \n\nThank you for all your answers! 🤗`)
            
            // Resetting the status for the user
            delete userQuestions[chatId]
            userProgress = []
            indexFile.addedFile.addedJsonFile = false
            answerMsgIdState.answerMessageId = null
            indexFile.completedQuizzes[chatId] = true

            const copiedFileName = indexFile.jsonFileName[chatId]

            console.log(copiedFileName)
            console.log(indexFile.__dirname)

            const filePath = path.join(indexFile.__dirname, 'uploaded_files', copiedFileName)
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