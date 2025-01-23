import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'

import {fileURLToPath} from 'url'
import {dirname, join} from 'path'


dotenv.config({path: '../.env'})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export const sequelize = new Sequelize(process.env.BOT_DB_NAME, process.env.BOT_DB_ADMIN_NAME, process.env.BOT_DB_PASSWORD, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: join(__dirname, `${process.env.BOT_DB_NAME}.db`)
})


sequelize.sync()
    .then(() => {
        console.log('Database created successfully')
    })
    .catch((error) => {
        console.log('Error during database creation:', error)
    })