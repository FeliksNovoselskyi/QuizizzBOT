# Quizizz Telegram Bot
---
## About
A two-part project

Platform - provides the ability to build a quiz on the site and get an output `.json` file with quiz info that the bot needs to start the quiz

Bot - provides access levels for teacher and student, teacher is able to upload `.json` files and start the quiz. At the time the student is able to take it

---
## Installation
*Of course install [NodeJS](https://nodejs.org/en) previously


1. Clone the repository
```
git clone https://github.com/FeliksNovoselskyi/QuizizzBOT.git
```
2. Choose directory of the project
3. Install packages
```
npm install
```
4. Create your own `.env` file in main directory

5. Write the information required for the bot and platform here as in the `.env-sample` file in main directory

6. Then choose what project do you wanna to start
### BOT
7. Choose Telegram BOT directiory
```
cd bot
```

8. Run the project (run `index.js`)
```
node index.js
```

### PLATFORM
7. Choose Platform directiory
```
cd platform
```

8. Run the project (run `server.js`)
```
node server.js
```

### Importantly
There is an `questions.json` file in the project directory

You can use it to create a quiz when the bot asks you to upload a `.json` file with the questions for the quiz

---
# Enjoy using it!
# Enjoy exploring it!