import * as indexFile from './index.js'

// Indexes of current issues for each user
export const userQuestions = {}
export let userProgress = []

// Function for sending a question with inline buttons
export async function sendQuestion(chatId, questions, bot) {
    try {
        const userIndex = userQuestions[chatId] || 0
    
        if (userIndex < questions.length) {
            const currentQuestion = questions[userIndex]
    
            // Generate options for the inline keyboard under the message
            const options = currentQuestion.options.map((option, index) => {
                return [{text: option, callback_data: String(index)}]
            })
    
            // Sending a message with an inline keyboard
            await bot.sendMessage(chatId, currentQuestion.question, {
                reply_markup: {
                    inline_keyboard: options
                }
            })
        } else {
            let allQuestions = userProgress.length
            let allCorrectAnswers = 0

            userProgress.forEach((question) => {
                let objectValues = Object.values(question)

                allCorrectAnswers = allCorrectAnswers + parseInt(objectValues)
            })

            await bot.sendMessage(chatId, `Тест завершено! \n\nКількість питань: ${allQuestions} \n\nКількість правильних відповідей: ${allCorrectAnswers} \n\nДякуюємо за ваші відповіді!`)
            
            // Resetting the status for the user
            delete userQuestions[chatId]
            userProgress = []
            indexFile.completedQuizzes[chatId] = true
        }
    } catch (error) {
        console.log(error)
    }
}