# Quizizz Telegram Bot
---
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![node-telegram-bot-api](https://img.shields.io/badge/Node--Telegram--Bot--API-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-87C918?style=for-the-badge&logo=ejs&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript ES6](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap%205-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![Sortable.js](https://img.shields.io/badge/Sortable.js-7E7E7E?style=for-the-badge&logo=javascript&logoColor=white)
![AJAX](https://img.shields.io/badge/AJAX-00A7E1?style=for-the-badge&logo=ajax&logoColor=white)
![Fetch API](https://img.shields.io/badge/Fetch%20API-Enabled-007acc?style=for-the-badge&logo=javascript)
![Async](https://img.shields.io/badge/Async-Enabled-007acc?style=for-the-badge&logo=javascript)
![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)

## About
A ***two-part*** project

**Platform** - provides the ability to build a quiz on the site and get an output `.json` file with quiz info that the bot needs to start the quiz

**Bot** - provides access levels for *teacher* and *student*, *teacher* is able to upload `.json` files and start the quiz. At the time the *student* is able to take it

---
## Installation
*Of course install [NodeJS](https://nodejs.org/en) previously


1. Clone the repository
```
git clone https://github.com/FeliksNovoselskyi/QuizizzBOT.git
```
2. Choose main directory of the project
3. Install packages
```
npm install
```
4. Create your own `.env` file in main directory

5. Write the information required for the **bot** and **platform** here as in the `.env-sample` file in main directory

6. Then choose what project do you wanna to start
### BOT
7. Choose `/bot`
```
cd bot
```

8. Create the `/uploaded_files` directory
(copies of the quiz files you upload as a teacher will be saved there)
```
mkdir uploaded_files
```

9. Run the project (run `index.js`)
```
node index.js
```

### PLATFORM
7. Choose `/platform`
```
cd platform
```

8. Run the project (run `server.js`)
```
node server.js
```

### Importantly
There is an `questions.json` file in the project directory

You can use it to create a quiz when the **bot** asks you to upload a `.json` file with the questions for the quiz

---
## Technologies Used
>[Back to top](#quizizz-telegram-bot)

| **Technology**  | **Description** |
| ------------- | -------------      |
| [NodeJS](https://nodejs.org/uk)       | The main framework on which the bot and the platform are built  |
| [Express](https://expressjs.com/)  | Web framework used to build the platform  |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  | The primary programming language  |
| [Sequelize ORM](https://sequelize.org/)  | ORM (Object-Relational Mapping) used for interacting with the database  |
| [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api)  | API used to develop a Telegram bot  |
| [EJS](https://ejs.co/)      | A simple templates language used for developing website templates |
| [jQuery](https://jquery.com/)                                                  | A JavaScript library that simplifies development and interaction within the project.                              |
| [Sortable](https://jqueryui.com/sortable/)                                     | A jQuery plugin that allows smooth and quick drag-and-drop functionality for reordering items.                    |
| [AJAX](https://api.jquery.com/category/ajax/)                                  | A technology for fast and convenient data handling without page refreshes.                                        |
| [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)        | Used for asynchronous operations on the site without constant page refreshes.                                     |
| [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)/[CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS) | Languages used for website layout, structure, and styling.                   |
| [Bootstrap 5](https://getbootstrap.com/)                                       | A frontend framework used to create various elements on the pages.                                                |
| [Figma](https://help.figma.com/hc/en-us)                                       | An online service used for designing the site's layout.                                                           |
| [SQLite3](https://www.sqlite.org/docs.html)                                    | A database used for site development.                                                                             |

---
## Project structure
>[Back to top](#quizizz-telegram-bot)
```mermaid
graph TD;
    A[**QuizizzBOT**] --> B[**bot** 
    Telegram bot acting as a quiz organizer, ensuring their uploading and launching] --> b1[*modules*];
    B --> b2[*db*];
    B --> b3[***questions.json***];
    B --> b4[***index.js***];

    A --> D[**platform**
    A web application to create a quiz to be sent to a bot] --> d1[*templates*];
    D --> d2[*static*];
    D --> d3[*db*];
    D --> d4[***server.js***];
```

---
## Figma and FigJam
>[Back to top](#quizizz-telegram-bot)
* [Figma](https://www.figma.com/design/jMjdkaAEDIh5ONLtelxzi7/QuizizzBOT-Platform?node-id=0-1&t=Y2RKr0VkKNAYPncM-1)
* [FigJam](https://www.figma.com/board/AZD4TR2pNnDRlWKSJgVxKp/QuizizzBOT-Structure?node-id=0-1&t=FxYQlPNAcjUQaIe8-1)


---
## Documentation
>[Back to top](#quizizz-telegram-bot)

Full-fledged documentation for the project, contains introductory information for further acquaintance and work on the project for other developers

---
### For platform
First of all, we familiarize ourselves with the structure of the database, platform models

In the platform's file system, there is a `/db` directory (as well as in the bot's file system)

A database will be created in the `/db` directory, with the name you specify in the `.env` file (fill it according to the example in `.env-sample`)

In the database, you will be able to track:
- Adding test questions
- Deleting questions
- Changing their order

And so, let's move on to the files

#### DB functionality
Let's get started
##### File `dbSetup.js`:
```javascript
import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'

import {fileURLToPath} from 'url'
import {dirname, join} from 'path'


dotenv.config({path: '../.env'})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create an instance of the Sequelize class, which will be an ORM, to work with the db
export const sequelize = new Sequelize(process.env.PLATFORM_DB_NAME, process.env.PLATFORM_DB_ADMIN_NAME, process.env.PLATFORM_DB_PASSWORD, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: join(__dirname, `${process.env.PLATFORM_DB_NAME}.db`)
})

// Sync DB
sequelize.sync()
    .then(() => {
        console.log('Database created successfully')
    })
    .catch((error) => {
        console.log('Error during creating database:', error)
    })
```

This file prepares the database for further use and synchronizes it

Sequelize ORM is used

The data required to create the database is uploaded from the `.env` file, such as:
- Database Name
- Database administrator name
- Database password

Traditionally, as in all project files, there are comments, sometimes short and clear, sometimes clearly described in detail
All for the sake of convenience of further use and development, as well as simple and qualitative familiarization with the project code

Let's move on

##### File `models.js`:
```javascript
import {DataTypes} from 'sequelize'

// My scripts
import * as dataBase from './dbSetup.js'

// Questions model
export const Questions = dataBase.sequelize.define('Questions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    questionText: {type: DataTypes.STRING},
    answer1: {type: DataTypes.STRING},
    answer2: {type: DataTypes.STRING},
    answer3: {type: DataTypes.STRING},
    answer4: {type: DataTypes.STRING},
    correctAnswer: {type: DataTypes.INTEGER},
    order: {type: DataTypes.INTEGER, defaultValue: 0}
})
```

A file containing absolutely all the models for the platform database

Let's move on to the rest of the platform structure:
- `server.js`
- `/templates`
- `/static`

---
#### Server part
##### File `server.js`:
```javascript
import express from 'express'
import dotenv from 'dotenv'
import csrf from "csurf"
import cookieParser from 'cookie-parser'

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

// CSRF protection
app.use(cookieParser())

const csrfProtection = csrf({cookie: true})
app.use(csrfProtection)

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
})

let context = {}

// Render of the main page
app.get('/', async (req, res) => {
    context.error = null

    // Preparing questions in their order (in ascending order)
    const allQuestions = await models.Questions.findAll({
        order: [['order', 'ASC']]
    })
    const questionData = allQuestions.map(question => question.dataValues)
    context.questionData = questionData

    res.render('main', context)
})

// Post requests on main page
app.post('/', csrfProtection, async (req, res) => {
    context = {}

    const {
        questionTextInput, 
        answer1Input, 
        answer2Input, 
        answer3Input, 
        answer4Input, 
        correctAnswerIndex, 
        action, 
        cell_order
    } = req.body

    if (action === "createQuest") {
        if (!questionTextInput || !answer1Input || !answer2Input || !answer3Input || !answer4Input) {
            // Unfilled inputs during creation of question
            // response to ajax
            return res.status(400).json({error: 'Fill all inputs to create a question'})
        } else if (correctAnswerIndex == null) {
            return res.status(400).json({ error: 'Choose only one correct answer within the valid range (1-4)' })
        } else {
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
                correctAnswer: correctAnswerIndex,
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

    // If the item order (in this case, QUESTIONS) has been updated
    if (action === "cellOrderUpgrade") {
        for (const item_order of cell_order) {
            await models.Questions.update(
                {order: item_order.order},
                {
                    where: {id: item_order.id}
                }
            )
        }
    }

    // If a teacher wants a .json file of questions
    if (action === "downloadFile") {
        try {
            // Receiving questions in the order they appear in the db
            const questions = await models.Questions.findAll({
                order: [['order', 'ASC']]
            })

            // Creates an object with an array of questions, converting data from the database into a format suitable for JSON
            const questionsData = {
                questions: questions.map((q) => ({
                    question: q.questionText,
                    options: [q.answer1, q.answer2, q.answer3, q.answer4],
                    correct: q.correctAnswer
                }))
            }

            // Sets the content type as JSON so that the browser knows it is JSON data
            const jsonContent = JSON.stringify(questionsData, null, 2)

            // Sets the header to prompt the browser to download a file named “questions.json”
            // Sets the content type as JSON so that the browser knows it is JSON data
            res.setHeader('Content-Disposition', 'attachment; filename="questions.json"')
            res.setHeader('Content-Type', 'application/json')

            // Sends JSON data to the client (for downloading)
            res.send(jsonContent)
        } catch (error) {
            console.log("Error when creating JSON file", error)
            res.status(500).json({error: "Failed to create JSON file"})
        }
    }
})

// Url output for the site (for convenience during development)
app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`)
})
```

Platform core file, server side using server-side JavaScript
Express is used, basic protection against CSRF-attacks is connected

This file accepts requests from the frontend part and responds to them, which makes the platform fast and easy to use

Here such events as:
- Question creation
- Question deletions
- Error handling
- Changing the order of questions
- Uploading a .json file with questions for the quiz

There are extensive comments that will make it easier and faster to understand the code of the `server.js` file

---
#### Folders (`/templates`)
The `/templates` directory contains these project templates:
- `main.ejs`

As you can see, a simple templates language [EJS](https://ejs.co/) is used for templates.

`main.ejs` - file in which the main project template is stored, with the necessary blocks for it

#### `/static`
The `/static` directory contains directories such as:
- `/css`
- `/js`

`/css` - directory with style files
`/js` - directory with `.js` files that provide comfortable use of the client part for the user

Let's break down `/js` in more detail:
- `/fetch_api` - (directory) option to use [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) instead of [AJAX](https://api.jquery.com/category/ajax/) and [jQuery](https://jquery.com/)
- `createQuest.js` - creating a question
- `deleteQuest.js` - deleting a question
- `fileDownloading.js` - unload `.json` file
- `preloadScreen.js` - loading screen
- `sortableElements.js` - sorting questions on the page

##### File `createQuest.js`:
```javascript
$(document).ready(function() {
    $('.correct-answer-checkbox').change(function() {
        // If the current checkbox is selected, deselect all other checkboxes
        if ($(this).prop('checked')) {
            $('.correct-answer-checkbox').not(this).prop('checked', false)
        }
    })

    // Create question ajax request
    $(".question-form").submit(function(event) {
        event.preventDefault()

        const questionTextInput = $('#questionTextInput').val()
        const answer1Input = $('#answer1Input').val()
        const answer2Input = $('#answer2Input').val()
        const answer3Input = $('#answer3Input').val()
        const answer4Input = $('#answer4Input').val()

        const checkboxAnswers = [
            $('#correctAnswer1Input'),
            $('#correctAnswer2Input'),
            $('#correctAnswer3Input'),
            $('#correctAnswer4Input')
        ]

        function chooseCorrectAnswer() {
            const correctAnswers = checkboxAnswers.filter(checkbox => checkbox.prop('checked'))

            if (correctAnswers.length === 1) {
                const correctAnswerIndex = checkboxAnswers.indexOf(correctAnswers[0])
                return correctAnswerIndex
            }
            return null
        }

        const correctAnswerIndex = chooseCorrectAnswer()
        const csrfToken = $('meta[name="csrf-token"]').attr('content')

        $.ajax({
            url: '/',
            type: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            contentType: 'application/json',
            data: JSON.stringify({
                questionTextInput,
                answer1Input,
                answer2Input,
                answer3Input,
                answer4Input,
                correctAnswerIndex,
                action: 'createQuest'
            }),
            success: function(response) {
                function getCorrectAnswer(index) {
                    if (response.correctAnswer === index) {
                        return 'corr-answer'
                    } else {
                        return 'incorr-answer'
                    }
                }

                const newQuestionHtml = `
                    <div class="question" data-question-id="${response.id}">
                        <div class="question-header">
                            <h3 class="question-text">${response.questionText}</h3>
                            <form action="/" method="post" class="delete-quest-form">
                                <input type="hidden" name="questionId" value="${response.id}">
                                <button type="submit" class="delete-quest-button" name="action" value="deleteQuest" data-question-id="${response.id}">Delete question</button>
                            </form>
                        </div>
                        <div class="answers">
                            

                            <p class="answers-text ${getCorrectAnswer(0)}">${response.answer1}</p>
                            <p class="answers-text ${getCorrectAnswer(1)}">${response.answer2}</p>
                            <p class="answers-text ${getCorrectAnswer(2)}">${response.answer3}</p>
                            <p class="answers-text ${getCorrectAnswer(3)}">${response.answer4}</p>
                        </div>
                    </div>
                `
                // Add new question on page
                $('#created-questions').append(newQuestionHtml)

                // Clear error message and reset form inputs
                $('.error-message').text("")
                $('.question-form')[0].reset()
            },

            error: function(response) {
                if (response.status === 400) {
                    $('.error-message').text(response.responseJSON.error)
                }
            }
        })
    })
})
```

In this file, an asynchronous request is sent to the server when adding a question, in order to speed up the site, and also to avoid regular reloading of the site at each action
The above mentioned technologies are used here:
- [AJAX](https://api.jquery.com/category/ajax/)
- [jQuery](https://jquery.com/)

##### File `deleteQuest.js`:
```javascript
$(document).ready(function() {
    // Delegation of events
    // to be able to handle events of dynamically added elements
    $(document).on('submit', '.delete-quest-form', function(event) {
        event.preventDefault()

        // Get form using jQuery for correctly questions deleting
        let $form = $(this)
        let questionId = $form.find("input[name=questionId]").val()

        const csrfToken = $('meta[name="csrf-token"]').attr('content')

        $.ajax({
            url: '/',
            type: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            contentType: 'application/json',
            data: JSON.stringify({
                questionId,
                action: 'deleteQuest'
            }),
            success: function(response) {
                if (response.deleteQuestion) {
                    // Deleting .question div where the delete button
                    $form.closest('.question').remove()
                }
            },
            error: function(response) {
                console.log(response.responseJSON.error)
            }
        })
    })
})
```

Similarly, allows you to delete questions asynchronously and without reloading the page, both on the page and in the database, which is logical
The technologies used are similar
Also connected protection from CSRF-attacks as in other static files from the `/static` folder

##### File `fileDownloading.js`:
```javascript
$(document).ready(function() {
    // Process a button click to load a .json file with test questions
    // in order to upload this file to chat with the bot in the future
    $(document).on('submit', '#download-form', function(event) {
        event.preventDefault()

        const csrfToken = $('meta[name="csrf-token"]').attr('content')

        $.ajax({
            url: '/',
            type: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            contentType: 'application/json',
            data: JSON.stringify({
                action: 'downloadFile'
            }),
            success: function(response) {
                // Converts a response object to formatted JSON with indentation
                const jsonString = JSON.stringify(response, null, 2)

                // Creating a page link element
                // Putting a link in it that will prompt you to select a location
                // in the computer's file system
                const link = document.createElement('a')
                link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString)
                link.download = 'questions.json'

                // Simulate clicking on a newly created link to instantly download a file
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        })
    })
})
```

The file provides convenient and fast `.json` uploading at the moment when the teacher needs it

After clicking on the button to upload `.json` file, on the server the necessary information is collected from the database and formed into a `.json` file, this file will be sent by the teacher to the bot personally to process it and the teacher can run the quiz for his students

On the client side, a temporary link is formed, when you click on it, it opens a window of your computer's file system:
- macOS - Finder
- Windows - Explorer

Then you choose a convenient place on your computer to save the new file

The technologies used are similar

##### File `preloadScreen.js`:
```javascript
window.addEventListener("load", () => {
    const loadingScreen = document.querySelector("#loading-screen")
    const content = document.querySelector("main")
    
    loadingScreen.style.display = "none"
    content.style.display = "block"
})
```

As you can see, a compact file
Participates in the work of a beautiful and minimalistic loading screen for the platform, to brighten up your wait for loading the site if you have a weak computer)))))
Well, or, it is heavily loaded with other processes

The basic DOM tree, its methods, and `css` styles are used

##### File `sortableElements.js`:
The last file in this directory
```javascript
$(document).ready(function () {
    const $questions = $("#created-questions")

    function sortingElements($container, dataAttr) {
        // Check if there are elements that can be sorted
        if ($container.length) {
            new Sortable($container[0], {
                animation: 150,
                onEnd: function () {
                    const order = []
                    const containerCells = $container.children()
                    
                    // Prepare order before being sent to the server
                    containerCells.each(function (index) {
                        const cellId = $(this).data(dataAttr)
                        order.push({
                            id: cellId,
                            order: index + 1
                        })
                    })
    
                    const csrfToken = $('meta[name="csrf-token"]').attr('content')
                    
                    $.ajax({
                        url: "/",
                        type: "POST",
                        headers: {
                            'X-CSRF-Token': csrfToken,
                        },
                        contentType: 'application/json',
                        data: JSON.stringify({
                            cell_order: order,
                            action: "cellOrderUpgrade",
                        })
                    })
                }
            })
        }
    }

    sortingElements(
        $container=$questions,
        dataAttr="question-id"
    )
})
```

Used for smooth, and most importantly beautiful change of the order of questions in the interface of the site
There is a function that allows you to compactly sort and other groups of elements on the site

Used such technologies as:
- [jQuery](https://jquery.com/)
- [Sortable](https://jqueryui.com/sortable/)
- [AJAX](https://api.jquery.com/category/ajax/) 

The new order of questions, which are displayed on the page after dragging and dropping them, will be processed and saved in the database
That will allow to save the order of questions after page refresh, as well as to place them in the necessary order in the generated `.json` file when uploading it

---
#### The last thing left in the `/static` directory is the `/fetch_api`
What it consists of:
- `createQuestFetch.js`
- `deleteQuestFetch.js`

These files perform similar functionality to the `createQuest.js` and `deleteQuest.js` files
However, the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is used here

##### File `createQuestFetch.js`:
```javascript
$(document).ready(function() {
    $('.correct-answer-checkbox').change(function() {
        // If the current checkbox is selected, deselect all other checkboxes
        if ($(this).prop('checked')) {
            $('.correct-answer-checkbox').not(this).prop('checked', false)
        }
    })

    // Create question ajax request
    $(".question-form").submit(function(event) {
        event.preventDefault()

        // Get form input values
        // using jQuery
        const questionTextInput = $('#questionTextInput').val()
        const answer1Input = $('#answer1Input').val()
        const answer2Input = $('#answer2Input').val()
        const answer3Input = $('#answer3Input').val()
        const answer4Input = $('#answer4Input').val()

        const checkboxAnswers = [
            $('#correctAnswer1Input'),
            $('#correctAnswer2Input'),
            $('#correctAnswer3Input'),
            $('#correctAnswer4Input')
        ]

        function chooseCorrectAnswer() {
            const correctAnswers = checkboxAnswers.filter(checkbox => checkbox.prop('checked'))

            if (correctAnswers.length === 1) {
                const correctAnswerIndex = checkboxAnswers.indexOf(correctAnswers[0])
                return correctAnswerIndex
            }
            return null
        }

        const correctAnswerIndex = chooseCorrectAnswer()

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionTextInput,
                answer1Input,
                answer2Input,
                answer3Input,
                answer4Input,
                correctAnswerIndex,
                action: 'createQuest'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw response
            }
            return response.json()
        })
        // Successfully created question
        .then(data => {
            const newQuestionHtml = `
                <div class="question">
                    <div class="question-header">
                        <h3 class="question-text">${data.questionText}</h3>
                        <form action="/" method="post" class="delete-quest-form">
                            <input type="hidden" name="questionId" value="${data.id}">
                            <button type="submit" class="delete-quest-button" name="action" value="deleteQuest" data-question-id="${data.id}">Delete question</button>
                        </form>
                    </div>
                    <div class="answers">
                        <p class="answers-text">${data.answer1}</p>
                        <p class="answers-text">${data.answer2}</p>
                        <p class="answers-text">${data.answer3}</p>
                        <p class="answers-text">${data.answer4}</p>
                    </div>
                </div>
            `

            // Add new question on page
            // insertAdjacentHTML method is used to correctly add new code
            // using dom-tree
            document.getElementById('created-questions').insertAdjacentHTML('beforeend', newQuestionHtml)
            
            // Clear error message and reset form inputs
            document.querySelector('.error-message').textContent = ""
            document.querySelector('.question-form').reset()
        })
        // Errors during form validation
        .catch(error => {
            // Check if error is an instance of Response class
            // It is checked to ensure that the request has been sent, even if it is not correct
            if (error instanceof Response) {
                error.json().then(err => {
                    document.querySelector('.error-message').textContent = err.error
                })
            } else {
                console.error(error)
            }
        })
    })
})

// Response.json() takes the Response stream and reads it to the end
// It returns a promise that resolves to the result of parsing the response body as a string
```

It is used for what its counterpart - asynchronous question creation, is also used for
Check out the comments, and if you have ideas on how to improve this part of the project, I'd love to see your suggestions in the form of a Pull Request!

##### File `deleteQuestFetch.js`:
```javascript
$(document).ready(function() {
    // Delegation of events
    // to be able to handle events of dynamically added elements
    $(document).on('submit', '.delete-quest-form', function(event) {
        event.preventDefault()

        // Get form using jQuery for correctly questions deleting
        let $form = $(this)
        let questionId = $form.find("input[name=questionId]").val()

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId,
                action: 'deleteQuest'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw response
            }
            return response.json()
        })
        // Successfully deleted question
        .then(data => {
            if (data.deleteQuestion) {
                $form.closest('.question').remove()
            }
        })

        // Possible errors
        .catch(error => {
            // Check if error is an instance of Response class
            // It is checked to ensure that the request has been sent, even if it is not correct
            if (error instanceof Response) {
                error.json().then(err => {
                    console.error(err.error)
                })
            }
        })
    })
})

// Response.json() takes the Response stream and reads it to the end
// It returns a promise that resolves to the result of parsing the response body as a string
```

File deletion, using the same technology
Read the comments to familiarize yourself, if you have additional questions, contact me at my [Github profile](https://github.com/FeliksNovoselskyi)

These files provide an alternative for those developers who are either not familiar with [jQuery](https://jquery.com/) and [AJAX](https://api.jquery.com/category/ajax/) at all, or you're just more used to [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

If I have time, in the future I will try to make an alternative on [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and for the rest of the client part, and also, to finalize these files

And you will have an opportunity to work on this project with more familiar and familiar technology, if you are interested in it, of course

---
## Want to get back to the top?
>[Back to top](#quizizz-telegram-bot)
# Enjoy using it!