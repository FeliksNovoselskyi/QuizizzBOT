# Quizizz Telegram Bot
---
## About
Quizizz BOT created on NodeJS framework. 
The bot is able to handle the registration and authorisation of both student and teacher, to perform the change of these roles
According to the role - access levels to the bot, a teacher can create a quiz and start it for his students

## Installation
1. Clone the repository
```
git clone https://github.com/FeliksNovoselskyi/QuizizzBOT.git
```
2. Install packages
```
npm install
```
3. Create your own `.env` file in main directory
4. Write the token in it, and the password for the teacher's account

As in the example:
```shell
token = 'token'
teacherPassword = 'password'
```
5. Run the project
```
node index.js
```
### Importantly
There is an `questions.json` file in the project directory
You can use it to create a test when the bot asks you to upload a `.json` file with the questions for the test

# Enjoy using it!