import {dirname} from 'path'
import {fileURLToPath} from 'url'

import path from 'path'
import telegramApi from 'node-telegram-bot-api'
import dotenv from 'dotenv'


dotenv.config({path: '../.env'})

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

const botToken = process.env.token
export const bot = new telegramApi(botToken, {polling: true})

export const uploadFilesDir = path.join(__dirname, 'uploaded_files')

// Variables for quiz functionality (quiz in one message)
export const answerMsgIdState = {
    answerMessageId: null
}
export const completedQuizzes = {}
export const jsonFileName = {}


export const canStart = {
    canStartQuiz: false
}
export const addedFile = {
    addedJsonFile: false
}
export const isTeacherLogin = {
    isLogin: false
}


export const allQuestions = {
    questions: {}
}


export const currentMessageText = {
    messageText: ""
}


export let helpMessage = `
Hi! 👋
Do you need some help? 🤔
Here's a list of my commands that can help you:

/start - starts your communication with me
/help - will give you a list of commands that can help you
/info - will give you information about yourself, your status, whether you are registered or not
/change_role - allows you to change your role, for example from student to teacher
/can_start_quiz - command that allows you to pass quiz. Available only to teacher 👨‍🏫
/quiz - command to start a quiz. Available only to the student 🧑‍🎓

Also remember that you always have a menu of my commands that can help you 🤗
`
