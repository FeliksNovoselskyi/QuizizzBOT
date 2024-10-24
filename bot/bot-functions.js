// My scripts
import * as dbFunctions from './db/db_functions.js'

// Function that handles login as a teacher, with password verification
export async function teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, changeToTeacherRole) {
    await bot.sendMessage(chatId, 'Введіть пароль від акаунту вчителя (тільки пароль, без зайвих символів)')

        const teacherPassword = process.env.teacherPassword
        bot.once('message', async (message) => {
            const userInputPassword = message.text

            // Checking the validity of the password entered by the user
            if (userInputPassword === teacherPassword) {
                await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
                if (changeToTeacherRole) {
                    // Role change from student to teacher
                    dbFunctions.updateUserRole(userId, 'teacher', () => {
                        bot.sendMessage(chatId, "Ваша роль змінена на вчителя")
                    })
                }
                
                await bot.sendMessage(chatId, 'Ви успішно увійшли як вчитель! \nТепер ви можете завантажити JSON файл с питаннями вашого тесту, та надати можливість розпочати тест для ваших студентів командою /can_start_quiz!')
            } else {
                await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
                await bot.sendMessage(chatId, 'Невірний пароль! \nСпробуйте знову \nДля цього нажміть на кнопку входу знову')
            }
        })
}

// Check the current user role
export function checkUserRole(userId, bot, chatId) {
    dbFunctions.getUserById(userId).then(async (user) => {
        if (user) {
            if (user.role === 'student') {
                // If the current role is student, offer a change to teacher
                bot.sendMessage(chatId, "Ви увійшли як студент. Хочете увійти як вчитель?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Так", callback_data: "switch_to_teacher"}],
                            [{text: "Ні", callback_data: "cancel_change_role"}]
                        ]
                    }
                })
            } else if (user.role === 'teacher') {
                // If the current role is teacher, offer a change to student
                bot.sendMessage(chatId, "Ви увійшли як вчитель. Хочете увійти як студент?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Так", callback_data: "switch_to_student"}],
                            [{text: "Ні", callback_data: "cancel_change_role"}]
                        ]
                    }
                })
            }
        }
    })
}