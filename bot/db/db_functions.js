// My scripts
import * as models from './models.js'

// Function in which user information is added to the database
export async function addUser(userId, username, firstName, lastName, role) {
    try {
        models.Users.create({
            userId: userId,
            username: username,
            firstName: firstName,
            lastName: lastName,
            role: role,
        })
    } catch (error) {
        console.error('Error adding a user:', error.message)
    }
}

// Function to get information about the user when he/she wants it
export async function getUserById(userId) {
    try {
        const user = await models.Users.findOne({where: {userId}})
        return user
    } catch (error) {
        console.error('Error when receiving a user:', error.message)
        return null
    }
}

// Function updating the user role in the database
// depending on the one he's got now
export async function updateUserRole(userId, newRole, callback) {
    try {
        const [updated] = await models.Users.update({role: newRole}, {where: {userId}})
        
        if (updated) {
            callback()
        } else {
            console.error("Error: user with this id was not found")
        }
    } catch (error) {
        console.error("Error updating a role:", error.message)
    }
}

// Function that updates the user's progress
export async function updateProgress(newList, userId) {
    try {
        await models.Users.update({progress: newList}, {where: {userId}})
    } catch (error) {
        console.error("Error when updating user progress:", error.message)
    }
}


// Function to clearing user progress from the database
export async function clearProgress(userId) {
    try {
        await models.Users.update({progress: null}, {where: {userId}})
    } catch (error) {
        console.error("Error during clearing progress", error.message)
    }
}