const router = require('express').Router()
const User = require('../models/user.model')
const blockCoApi = require('../blockco/api_calls')
const Token = require('../helpers/token')


// Return all users
router.route('/').get((req, res) => {
  
    User.find()
        .then(users => {
            var usersList = []
            users.forEach(user => { 
                usersList.push( user.account_id ) 
            }) 
            return res.json(usersList)
        })
        .catch(err => res.status(400).json('Error: ' + err)); 
});


// Create new user account
router.route('/add').post(async (req, res) => {
   
    const newAccountUsername = req.body.username
    var newAccountPasscode = Token.createPasscode()
  
    // Create a new account on blockchain using username and passcode
    const response = await blockCoApi.createAccount(newAccountUsername, newAccountPasscode)
    if(response.statusCode !== 201){
        return res.json({"Error": response})
    }
    const newAccount = response.body
    
    // Create a user object and update in database
    const newUser = new User({
        account_id: newAccountUsername,
        passcode: newAccountPasscode,
        jwt: newAccount.jwt,   
        blockchain: newAccount.blockchain,
        blockchainAddress: newAccount.blockchain_address,
        monsters: []
    });

    await newUser.save()
        .then((user) => res.json('User ' + user.account_id + ' added!'))
        .catch(err => res.status(400).json('Error: ' + err))
});


// Find monsters of a given user
router.route('/:username/monsters').get(async (req, res) => {
  
    var username = req.params.username

    // Retrieve info of all the NFTs owned by user
    
    // OPTION 1: Fetching from local database
    User.findOne({account_id: username})
        .populate('monsters')
        .then(user => res.json(user.monsters))
        .catch(err => res.status(400).json('Error: ' + err));
    
    /** OR **/

    // OPTION 2: Directly querying blockchain
    /*
    const response = await blockCoApi.retrieveNFT(username)
    if(response.statusCode !== 200){
        return res.json({"Error": response})
    }

    var monsters = response.body.nft_infos
    return res.json(monsters)
    */

    /**
     *  🔊 NOTE : 
     *   Currently UI is configured according to output of `OPTION 1`
     *   In case you want to use `OPTION 2` then you'll need to make some changes in `hooks/retrieve-monsters.js`
     */

});


// Delete monsters of given user
router.route('/:username/monsters').delete(async (req, res) => {
    
    var nftIds = []
    const owner = req.params.username

    // Find the nftIds of all the monsters user is currently having to burn 
    await User.findOne({account_id: owner })
        .populate('monsters')
        .then(user => {
            user.monsters.forEach(monster => {
                nftIds.push(monster.nft_id)
            })

            user.monsters = []
            user.save()
                .then(() => {console.log('monsters removed from user account!')})
                .catch(err => res.status(400).json('Error: ' + err))
        })

    // Find the owner jwt
    var ownerJwt =  await Token.getUserJwt(owner)

    // Burn the nfts corresponding to nftIds
    var response = await blockCoApi.deleteNFTs(owner, nftIds, ownerJwt)

    // In case owner's jwt expires
    if(response.statusCode === 401){
        console.log('Trying with new jwt..')

        // call refresh token
        response = await Token.refreshToken(owner)
        if(response.statusCode !== 201){
            return res.status(400).json({"Error": response})
        }
        
        // update Token
        ownerJwt = response.body.jwt

        // again call Delete NFTs
        response = await blockCoApi.deleteNFTs(owner, nftIds, ownerJwt)
        if(response.statusCode !== 200){
            return res.status(400).json({"Error": response})
        }else{
            return res.status(200).json('NFTs deleted!')
        }

    }else if(response.statusCode !== 200){
        return res.status(400).json({"Error": response})
    }else{
        return res.status(200).json('NFTs deleted!')
    }
});


// Check if user already won or not
router.route('/:username/winner').get((req, res) => {

    var username = req.params.username
    User.findOne({account_id: username})
        .populate('monsters')
        .then(user => {
            if(user.game_info.isWinner){
                res.json({kingMonster: user.monsters[0]})
            }else{
                res.json({kingMonster: null})
            }
        })
        .catch(err => res.json('Error: ' + err));
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


// Get the time of last NFT award
router.route('/:username/timerdetails').get((req, res) => {

    var username = req.params.username
    User.findOne({account_id: username})
        .then(user => res.json(user.game_info.last_nft_award))
        .catch(err => res.status(400).json('Error: ' + err));
});


// Set the time of latest NFT award
router.route('/:username/timerdetails').put((req, res) => {

    var username = req.params.username
    User.findOne({account_id: username})
        .then(user => {
            user.game_info.last_nft_award.date = req.body.date
            user.game_info.last_nft_award.time = req.body.time
            user.save()
        })
        .then(() =>  res.json('Game timer details updated for user ' + username))
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;