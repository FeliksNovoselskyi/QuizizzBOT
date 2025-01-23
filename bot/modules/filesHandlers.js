import fs from 'fs'
import path from 'path'

import {
    bot,
    allQuestions,
    jsonFileName,
    uploadFilesDir,
    addedFile,
    __dirname
} from "../config.js"


export default async function handleFileUpload(dbFunctions, message) {
    const chatId = message.chat.id
    const userId = message.from.id

    const fileId = message.document.file_id
    const fileName = message.document.file_name

    if (path.extname(fileName) === '.json') {
        dbFunctions.getUserById(userId).then(async function (user) {
            if (!user || user.role !== 'teacher') {
                return bot.sendMessage(chatId, '❗️ Only teachers are allowed to upload files!')
            }

            try {
                // Download the file that the user uploaded to us
                // then save this file in the /uploaded_files/
                const downloadedPath = await bot.downloadFile(fileId, uploadFilesDir)
                const renamedPath = path.join(uploadFilesDir, fileName)
                fs.renameSync(downloadedPath, renamedPath)
                
                // Search for the file by the new name (the new name is the same as the one with which the user uploaded it)
                // and parsing it for further use of data from it
                fs.readFile(renamedPath, 'utf8', (error, data) => {
                    if (error) {
                        return bot.sendMessage(chatId, '❗️ Error during reading a file')
                    }

                    try {
                        const json_file = JSON.parse(data)

                        allQuestions.questions = json_file.questions

                        jsonFileName[chatId] = fileName

                        bot.sendMessage(chatId, '👍 The file with questions has been uploaded successfully! To start the quiz, please write /can_start_quiz')
                        addedFile.addedJsonFile = true
                    } catch (parseError) {
                        console.log('Error parsing JSON:', parseError.message)
                        bot.sendMessage(chatId, '❗️ Error parsing JSON file. Check the file format is correct')
                    }
                })
            } catch (downloadError) {
                console.log('Error downloading file:', downloadError.message)
                bot.sendMessage(chatId, '❗️ Error downloading the file')
            }
        })
    } else {
        bot.sendMessage(chatId, '❗️ You can only upload a .json file for the quiz!')
    }
}