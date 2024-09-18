// Индексы текущих вопросов для каждого пользователя
export const userQuestions = {}

// Функция для отправки вопроса с инлайн-кнопками
export async function sendQuestion(chatId, questions, bot) {
    const userIndex = userQuestions[chatId] || 0
    // const questions = questions.question

    if (userIndex < questions.length) {
        const currentQuestion = questions[userIndex]

        const options = currentQuestion.options.map((option, index) => {
            return [{text: option, callback_data: String(index)}]
        })

        await bot.sendMessage(chatId, currentQuestion.question, {
            reply_markup: {
                inline_keyboard: options
            }
        })
    } else {
        await bot.sendMessage(chatId, 'Тест завершено! Дякуюємо за ваші відповіді!')
        delete userQuestions[chatId] // Сброс состояния для пользователя
    }
}