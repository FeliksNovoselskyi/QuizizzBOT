import express from 'express'
import dotenv from 'dotenv'

import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

// My scripts
import * as models from './db/models.js'

dotenv.config({path: '../.env'})

const app = express()

// PORT and HOST (from .env file or basic values)
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', './templates')

// Setup static routes
app.use('/static/', express.static(join(__dirname, 'static')))
app.use('/css', express.static(join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(join(__dirname, 'node_modules/jquery/dist')))

app.use(express.urlencoded({extended: true}))
app.use(express.json()) // for json parsing after ajax requests

let context = {}

// Render of the main page
app.get('/', async (req, res) => {
    context.error = null

    const allQuestions = await models.Questions.findAll()
    const questionData = allQuestions.map(question => question.dataValues)
    context.questionData = questionData

    res.render('main', context)
})

// Post requests on main page
app.post('/', async (req, res) => {
    context = {}

    const {questionTextInput, answer1Input, answer2Input, answer3Input, answer4Input, correctAnswerIndex, action} = req.body

    // console.log(correctAnswerIndex)

    if (action === "createQuest") {
        if (!questionTextInput || !answer1Input || !answer2Input || !answer3Input || !answer4Input) {
            // Unfilled inputs during creation of question
            // response to ajax
            return res.status(400).json({error: 'Fill all inputs to create a question'})
        } else if (correctAnswerIndex == null) {
            return res.status(400).json({ error: 'Choose only one correct answer within the valid range (1-4)' })
        } else {
            console.log(correctAnswerIndex)
            const newQuestion = await models.Questions.create({
                questionText: questionTextInput,
                answer1: answer1Input,
                answer2: answer2Input,
                answer3: answer3Input,
                answer4: answer4Input,
                correctAnswer: correctAnswerIndex
            })

            // Successfully created question
            // response to ajax
            return res.status(200).json({
                id: newQuestion.id,
                questionText: questionTextInput,
                answer1: answer1Input,
                answer2: answer2Input,
                answer3: answer3Input,
                answer4: answer4Input,
                message: 'Question added successfully!'
            })
        }
    }

    if (action === "deleteQuest") {
        // get questionId from the submitted form (from hidden input)
        const questionId = req.body.questionId

        // if the questionId was missed at the time of receipt
        if (!questionId) {
            return res.status(400).json({error: 'Question ID is missing'})
        }

        // Trying to delete question from db
        try {
            await models.Questions.destroy({
                where: {id: questionId}
            })

            // Successfully deleted question
            return res.status(200).json({deleteQuestion: true})
        } catch (error) {
            console.error(error)

            // Probably errors during question deleting
            return res.status(400).json({error: 'Failed to delete question'})
        }
    }
})

// Url output for the site (for convenience during development)
app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`)
})