import fs from 'fs'
import path from 'path'

// My scripts
import {
    allQuestions,
    __dirname
} from "../config.js"

// Teacher uploading .json file with quiz questions
export default async function handleFileUpload(bot, dbFunctions, uploadFilesDir, jsonFileName, addedFile, message) {
    const chatId = message.chat.id
    const userId = message.from.id
    
    const fileId = message.document.file_id
    const fileName = message.document.file_name

    // Checking that the file is .json and that it is a teacher account
    if (path.extname(fileName) === '.json') {
        dbFunctions.getUserById(userId).then(async function(user) {
            if (!user || user.role !== 'teacher') {
                return bot.sendMessage(chatId, '❗️ Only teachers are allowed to upload files! ❗️')
            }

            const localFilePath = path.join(__dirname, fileName)

            // Download the file that the user uploaded to us
            // then save this file in the /uploaded_files/
            await bot.downloadFile(fileId, uploadFilesDir)

            // Read the directory with copies of the files uploaded by the teacher
            // to get the name of the newly downloaded file
            // and at the end of the quiz, delete this .json file
            fs.readdir(uploadFilesDir, (error, files) => {
                if (error) {
                    return bot.sendMessage(chatId, '❗️ Error reading the directory ❗️')
                }

                const copiedFileName = files.find(file => file.startsWith('file_'))

                // Read the contents of the file at the specified path
                fs.readFile(localFilePath, 'utf8', function(error, data) {
                    if (error) {
                        return bot.sendMessage(chatId, '❗️ Error during reading a file ❗️')
                    }

                    try {
                        // Try parsing the contents of the file
                        const json_file = JSON.parse(data)
                        
                        allQuestions.questions = json_file.questions

                        jsonFileName[chatId] = copiedFileName
                        
                        bot.sendMessage(chatId, '🔥👍 The file with questions has been uploaded successfully! To start the quiz, please write /can_start_quiz')
                        addedFile.addedJsonFile = true

                    } catch {
                        bot.sendMessage(chatId, '❗️ Error parsing JSON file. Check the file format is correct ❗️')
                    }
                })
            })
        })
    } else {
        bot.sendMessage(chatId, '❗️ You can only upload a .json file for the quiz! ❗️')
    }
}