import {DataTypes} from 'sequelize'

// My scripts
import * as dataBase from './db_setup.js'

// Users model
export const Users = dataBase.sequelize.define('Users', {
    userId: {type: DataTypes.INTEGER},
    username: {type: DataTypes.TEXT},
    firstName: {type: DataTypes.TEXT},
    lastName: {type: DataTypes.TEXT},
    role: {type: DataTypes.TEXT},
    progress: {type: DataTypes.TEXT}
})