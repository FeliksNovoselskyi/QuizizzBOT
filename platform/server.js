import express from 'express'
import dotenv from 'dotenv'

import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

// My scripts
import * as dataBase from './data-base.js'

dotenv.config({path: '../.env'})

const app = express()

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

app.get('/', async (req, res) => {
    context.error = null

    const allQuestions = await dataBase.Questions.findAll()
    const questionData = allQuestions.map(question => question.dataValues)
    context.questionData = questionData

    res.render('main', context)
})

app.post('/', async (req, res) => {
    context = {}

    const {questionTextInput, answer1Input, answer2Input, answer3Input, answer4Input, action} = req.body

    if (action === "createQuest") {
        if (!questionTextInput || !answer1Input || !answer2Input || !answer3Input || !answer4Input) {
            // Unfilled inputs during creation of question
            // response to ajax
            return res.status(400).json({error: 'Fill all inputs to create a question'})
        } else {
            const newQuestion = await dataBase.Questions.create({
                questionText: questionTextInput,
                answer1: answer1Input,
                answer2: answer2Input,
                answer3: answer3Input,
                answer4: answer4Input
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
        const questionId = req.body.questionId

        if (!questionId) {
            return res.status(400).json({error: 'Question ID is missing'})
        }

        try {
            await dataBase.Questions.destroy({
                where: {id: questionId}
            })

            return res.status(200).json({deleteQuestion: true})
        } catch (error) {
            console.error(error)

            return res.status(400).json({error: 'Failed to delete question'})
        }
    }
})

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`)
})