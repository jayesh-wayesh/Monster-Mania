const router = require('express').Router()
const User = require('../models/user.model')
const blockCoApi = require('../blockco/api_calls')

const SECRET_PREFIX=process.env.SECRET_PREFIX
const SECRET_SUFFIX=process.env.SECRET_SUFFIX


// Return all users
router.route('/').get((req, res) => {
  
    User.find()
        .then(users => {
            var usersList = []
            users.forEach(user => { 
            usersList.push( user.account_id ) 
            console.log(usersList) 
        }) 
        return res.json(usersList)
    })
    .catch(err => res.status(400).json('Error: ' + err));
    
});


// Find monsters of a given user
router.route('/:username/monsters').get(async (req, res) => {
  
    var username = req.params.username

    // NFT Retrieval api call 
    /*
    const response = await blockCoApi.retrieveNFT(username)
    if(response.statusCode !== 200){
        return res.json({"Error": response})
    }

    var monsters = response.body.nft_infos
    var monsterResponse = []
    if(monsters){
        monsters.forEach(monster => {
            monsterResponse.push({
                'nft_id': monster.id,
                'edition': monster.edition,
                'media_id': JSON.parse(monster.developer_metadata).monster_id,
            })
        })
    }
    return res.json(monsterResponse)
    */
    /** OR **/
    
    User.findOne({account_id: username})
        .populate('monsters')
        .then(user => res.json(user.monsters))
        .catch(err => res.status(400).json('Error: ' + err));

});


// Create new account
router.route('/add').post(async (req, res) => {
   
    const newAccountUsername = req.body.username;
    const newAccountPasscode = SECRET_PREFIX + newAccountUsername + SECRET_SUFFIX;
  
    /*
    const response = await blockCoApi.createAccount(newAccountUsername, newAccountPasscode)
        if(response.statusCode !== 201){
            return res.json({"Error": response})
    }

    const newAccount = response.body
    return res.json(newAccount)
    */

    const newUser = new User({
        account_id: newAccountUsername,
        passcode: newAccountPasscode,
        blockchain: "FLOW",
        blockchainAddress: "0xTESTING",
        jwt: process.env.testUser2_JWT,        // TEMP
        monsters: []
    });

    console.log('newUser')
    console.log(newUser)
 
    // return res.json('User ' + newUser.account_id + ' added!')
    newUser.save()
        .then((user) => res.json('User ' + user.account_id + ' added!'))
        .catch(err => res.status(400).json('Error: ' + err))
});


// Delete monsters of given user
router.route('/:username/monsters').delete(async (req, res) => {
    
    var nft_ids = []
    var username = req.params.username

    // Find the nft_ids of all the monsters user is currently having to burn 
    User.findOne({account_id: username })
        .populate('monsters')
        .then(user => {
            
        user.monsters.forEach(monster => {
            nft_ids.push(monster.nft_id)
        })

        console.log(nft_ids)
        user.monsters = []
        console.log(user)

        user.save()
            .then(() => {console.log('monsters removed from user account!')})
            .catch(err => res.status(400).json('Error: ' + err))
        })
        .then(() => res.status(200).json('NFTs deleted!'))

    /********** NFT Deletion api call starts **********/
    /*
    var response = await blockCoApi.deleteNFTs('testUser2', [6])
    console.log(response)
    if(response.statusCode === 401){

        // call refresh token
        response = await refreshToken('testUser2')
        if(response.statusCode !== 201){
            return res.json({"Error": response})
        }
        
        // update JWT
        process.env.testUser2_JWT = response.body.jwt

        // again call Delete NFTs
        response = await blockCoApi.deleteNFTs('testUser2', [6])
        if(response.statusCode !== 200){
            return res.json({"Error": response})
        }
    }else if(response.statusCode !== 200){
        return res.json({"Error": response})
    }

    return res.json(response)
    */
    /********** NFT Deletion api call ends **********/
});


// Check if user already won or not
router.route('/:username/winner').get((req, res) => {

    var username = req.params.username
    User.findOne({account_id: username})
        .then(user => res.json(user.game_info.isWinner))
        .catch(err => res.status(400).json('Error: ' + err));

});


// Set status of winner
router.route('/:username/winner').put((req, res) => {
  
    var username = req.params.username
    User.findOne({account_id: username})
        .then(user => {
            user.game_info.isWinner = true
            user.save()
        })
        .then(() => res.json('Winner status updated for user ' + username))
        .catch(err => res.status(400).json('Error: ' + err));
});


// Get the time of last NFT drop
router.route('/:username/timerdetails').get((req, res) => {

    var username = req.params.username
    User.findOne({account_id: username})
        .then(user => res.json(user.game_info.last_nft_drop))
        .catch(err => res.status(400).json('Error: ' + err));
});


// Set the time of latest NFT drop
router.route('/:username/timerdetails').put((req, res) => {

    var username = req.params.username
    User.findOne({account_id: username})
        .then(user => {
            user.game_info.last_nft_drop.date = req.body.date
            user.game_info.last_nft_drop.time = req.body.time
            user.save()
        })
        .then(() =>  res.json('Game timer details updated for user ' + username))
        .catch(err => res.status(400).json('Error: ' + err));
});


const refreshToken = async (username) => {
  
    const passcode = SECRET_PREFIX + username + SECRET_SUFFIX
    const response = await blockCoApi.refreshToken(username, passcode)
    return response
}

module.exports = router;