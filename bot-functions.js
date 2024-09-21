// Мои скрипты
import * as dataBase from './data-base.js'

// Функция обрабатывающая вход как учитель, с проверкой пароля
export async function teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, changeToTeacherRole) {
    await bot.sendMessage(chatId, 'Введіть пароль від акаунту вчителя (тільки пароль, без зайвих символів)')

        const teacherPassword = process.env.teacherPassword
        // console.log(teacherPassword)
        bot.once('message', async (message) => {
            const userInputPassword = message.text

            // Проверка верности пароля введенного пользователем
            if (userInputPassword === teacherPassword) {
                if (changeToTeacherRole) {
                    // Логика смены на учителя
                    dataBase.updateUserRole(userId, 'teacher', () => {
                        bot.sendMessage(chatId, "Ваша роль змінена на вчителя")
                    })
                }
                
                updateRoleButtons(chatId, bot, messageId)
                dataBase.addUser(userId, username, firstName, lastName, 'teacher')
                await bot.sendMessage(chatId, 'Ви успішно увійшли як вчитель! \nТепер ви можете завантажити JSON файл с питаннями вашого тесту, та розпочати тест для ваших студентів командою /quiz!')
            } else {
                await bot.sendMessage(chatId, 'Невірний пароль! \nСпробуйте знову \nДля цього нажміть на кнопку входу знову')
            }
        })
}

//
export function updateRoleButtons(chatId, bot, messageId) {
    bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})

    // Отправляем новое сообщение с кнопкой "Поменять роль"
    bot.sendMessage(chatId, 'Хочете увійти як вчитель?\nАбо зареєструватись як студент?\n\nКлацніть лише на одну кнопку:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Змінити роль', callback_data: 'change_role' }]
            ]
        }
    })
}