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

In the platform's file system, there is a `/db` folder (as well as in the bot's file system)

A database will be created in the `/db` folder, with the name you specify in the `.env` file (fill it according to the example in `.env-sample`)

In the database, you will be able to track:
- Adding test questions
- Deleting questions
- Changing their order

And so, let's move on to the files
File `dbSetup.js`:
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

File `models.js`:
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


---
## Want to get back to the top?
>[Back to top](#quizizz-telegram-bot)
# Enjoy using it!