const router = require('express').Router()
const User = require('../models/user.model')
const request = require('request')
const jwt = require('jsonwebtoken')

const SECRET_PREFIX=process.env.SECRET_PREFIX
const SECRET_SUFFIX=process.env.SECRET_SUFFIX
const BASE_URL=process.env.BASE_URL 
const DEVELOPER_PRIVATE_KEY=process.env.DEVELOPER_PRIVATE_KEY
const DEVELOPER_ID=Number(process.env.DEVELOPER_ID)
const SERVER_NAME=process.env.SERVER_NAME


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
router.route('/:username/monsters').get((req, res) => {

  var username = req.params.username
  User.findOne({account_id: username})
    .populate('monsters')
    .then(user => res.json(user.monsters))
    .catch(err => res.status(400).json('Error: ' + err));

});


// Account creation api
router.route('/add').post((req, res) => {
   
  const playerUsername = req.body.username;
  const playerPasscode = SECRET_PREFIX + playerUsername + SECRET_SUFFIX;

  /********** Account Creation api call starts **********/

  var data = {
    'developer_id': DEVELOPER_ID,     
    'account_id': playerUsername,            
    'passcode': playerPasscode,          
  }
  
  var jwt = generateAccessToken()
  var options = {
    uri: BASE_URL + '/api/v1/accounts',
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
      'Content-Type': 'application/json'
    }
  }

  request(options, (error, response) => {
    
    console.log('user account creation api response :')
    console.log(error,response)

  });

  /********** Account Creation api call ends **********/

  const newUser = new User({
    account_id: playerUsername,
    passcode: playerPasscode,
    blockchain: "FLOW",
    blockchainAddress: "0xTESTING",
    monsters: []
  });

  console.log('newUser')
  console.log(newUser)
 
  return res.json('User ' + newUser.account_id + ' added!')
  // newUser.save()
  //   .then((user) => res.json('User ' + user.account_id + ' added!'))
  //   .catch(err => res.status(400).json('Error: ' + err))

});


// NFT deletion api
router.route('/:username/monsters').delete((req, res) => {
    
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

  var data = {
    'developer_id': Number(DEVELOPER_ID),     
    'owner_account_id': username,            
    'nft_ids': nft_ids,          
  }
  
  var jwt = generateAccessToken()
  var options = {
    uri: BASE_URL + '/api/v1/nfts',
    body: JSON.stringify(data),
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
      'Content-Type': 'application/json'
    }
  }

  request(options, (error, response) => {
    
    console.log('user account creation api response :')
    console.log(error,response.status)

  });

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


function generateAccessToken() {
  
  var DeveloperClaims = {
    'DeveloperID': DEVELOPER_ID,
    'StandardClaims': {
      'ExpiresAt': Date.now() + 15000,
      'Issuer': SERVER_NAME
    }
  }

  const buffer = Buffer.from(DEVELOPER_PRIVATE_KEY, 'base64')
  const bufString = buffer.toString('hex')

  return jwt.sign(DeveloperClaims, bufString)
}


module.exports = router;