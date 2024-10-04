import express from 'express'
import dotenv from 'dotenv'

import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

dotenv.config({path: '../.env'})

const app = express()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', './templates')

app.use('/static/', express.static(join(__dirname, 'static')))
app.use('/css', express.static(join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(join(__dirname, 'node_modules/jquery/dist')))

app.use(express.urlencoded({extended: true}))

let context = {}

app.get('/', (req, res) => {

    context.error = null

    res.render('main', context)
})

app.post('/', (req, res) => {
    context = {}

    const {questionTextInput, answer1Input, answer2Input, answer3Input, answer4Input} = req.body

    if (!questionTextInput || !answer1Input || answer2Input || answer3Input || answer4Input) {
        context.error = 'Fill all inputs to create a question'
    }

    return res.render('main', context)
})

app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`)
})