// My scripts
import * as dbFunctions from '../db/db_functions.js'

// Function that handles login as a teacher, with password verification
export async function teacherLogin(chatId, bot, messageId, userId, username, firstName, lastName, changeToTeacherRole) {
    await bot.sendMessage(chatId, '❕ Enter your teacher account password (password only, no extra characters)')

        const teacherPassword = process.env.teacherPassword
        bot.once('message', async (message) => {
            const userInputPassword = message.text

            // Checking the validity of the password entered by the user
            if (userInputPassword === teacherPassword) {
                await bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: messageId})
                if (changeToTeacherRole) {
                    // Role change from student to teacher
                    dbFunctions.updateUserRole(userId, 'teacher', () => {
                        bot.sendMessage(chatId, "👨‍🏫 Your role has been changed to teacher")
                    })
                    return
                }
                
                dbFunctions.addUser(userId, username, firstName, lastName, 'teacher')
                await bot.sendMessage(chatId, '👨‍🏫 You have successfully logged in as a teacher! \n❕ Now you can upload a JSON file with your test questions, and give your students the opportunity to start the test with command /can_start_quiz!')
            } else {
                await bot.sendMessage(chatId, '❗️ Incorrect password! \nTry again \nTo do this, press the login button again ❗️')
            }
        })
}

// Check the current user role
export function checkUserRole(userId, bot, chatId) {
    dbFunctions.getUserById(userId).then(async (user) => {
        if (user) {
            if (user.role === 'student') {
                // If the current role is student, offer a change to teacher
                bot.sendMessage(chatId, "🧑‍🎓 You are logged in as a student. Would you like to log in as a teacher 👨‍🏫?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Yes", callback_data: "switch_to_teacher"}],
                            [{text: "No", callback_data: "cancel_change_role"}]
                        ]
                    }
                })
            } else if (user.role === 'teacher') {
                // If the current role is teacher, offer a change to student
                bot.sendMessage(chatId, "👨‍🏫 You are logged in as a teacher. Would you like to log in as a student 🧑‍🎓?", {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: "Yes", callback_data: "switch_to_student"}],
                            [{text: "No", callback_data: "cancel_change_role"}]
                        ]
                    }
                })
            }
        }
    })
}