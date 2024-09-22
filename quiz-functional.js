import * as indexFile from './index.js'

// Индексы текущих вопросов для каждого пользователя
export const userQuestions = {}

// Функция для отправки вопроса с инлайн-кнопками
export async function sendQuestion(chatId, questions, bot) {
    try {
        const userIndex = userQuestions[chatId] || 0
    
        if (userIndex < questions.length) {
            const currentQuestion = questions[userIndex]
    
            // Генерируем опции для инлайн-клавиатуры под сообщением
            const options = currentQuestion.options.map((option, index) => {
                return [{text: option, callback_data: String(index)}]
            })
    
            // Отправка сообщения с инлайн-клавиатурой
            await bot.sendMessage(chatId, currentQuestion.question, {
                reply_markup: {
                    inline_keyboard: options
                }
            })
        } else {
            await bot.sendMessage(chatId, 'Тест завершено! Дякуюємо за ваші відповіді!')
            delete userQuestions[chatId] // Сброс состояния для пользователя
            indexFile.completedQuizzes[chatId] = true
        }
    } catch (error) {
        console.error(error)
    }
}