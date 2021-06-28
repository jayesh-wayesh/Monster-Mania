const User = require('../models/user.model');
const blockCoApi = require('../blockco/api_calls')
const SECRET_PREFIX=process.env.SECRET_PREFIX
const SECRET_SUFFIX=process.env.SECRET_SUFFIX

// Return passcode corresponding to a user's username
function getPasscode(username){
    return SECRET_PREFIX + username + SECRET_SUFFIX
}

// Find jwt token of the user in database
async function getUserJwt(username){
    
    const jwt = await User.findOne({ account_id: username })
        .then(user => user.jwt)

    return jwt
}

// Use blockCo api to get new jwt token
async function refreshToken(username) {
  
    var passcode = getPasscode(username)
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


module.exports = { getUserJwt, refreshToken, updateUserJwt, getPasscode };