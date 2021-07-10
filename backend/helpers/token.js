const User = require('../models/user.model');
const blockCoApi = require('../blockco/api_calls')
const crypto = require("crypto");


// create a new passcode 
function createPasscode(){

    return crypto.randomBytes(20).toString('hex');
}

// Return passcode corresponding to a user's username
async function getPasscode(username){

    const passcode = await User.findOne({ account_id: username })
        .then(user => user.passcode)

    return passcode
}

// Find jwt token of the user in database
async function getUserJwt(username){
    
    const jwt = await User.findOne({ account_id: username })
        .then(user => user.jwt)

    return jwt
}

// Use blockCo api to get new jwt token
async function refreshToken(username) {
  
    var passcode = await getPasscode(username)
    const response = await blockCoApi.refreshToken(username, passcode)
    if(response.statusCode === 201){
        await updateUserJwt(username, response.body.jwt)
    }
    
    return response
}

// Update the new JWT token in database
async function updateUserJwt(username, newJwt) {
    
    await User.findOne({ account_id: username })
        .then(user => {
            user.jwt = newJwt
            user.save()
        })
} 


module.exports = { getUserJwt, refreshToken, updateUserJwt, getPasscode, createPasscode };