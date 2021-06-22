const router = require('express').Router();
let User = require('../models/user.model');


// Return all users
router.route('/').get((req, res) => {
  
  User.find()
    .then(users => 
      {
        var usersList = []
        users.forEach(user => 
          { 
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
   
  console.log('er4t')
    const newUsername = req.body.username;
    const newPasscode = process.env.SECRET_PREFIX + newUsername + process.env.SECRET_SUFFIX;

    /**
     *   Account creation api
     * 
     *    @param developer_id: 'dev'
     *    @param account_id: newUsername
     *    @param passcode: newPasscode
     * 
     *    curl -X POST -H “Authorization: Bearer <string>”
     *         -H “Content-Type: application/json” 
     *         -d ‘{“account_id”: <integer>, “account_id”: <string>, “passcode”: <string>}’ 
     *         https://{hostname}/api/v1/accounts
     * 
     */
    

    const newUser = new User({
      account_id: newUsername,
      passcode: newPasscode,
      blockchain: "FLOW",
      blockchainAddress: "0xTESTING",
      monsters: []
    });

    console.log('newUser')
    console.log(newUser)
 
    newUser.save()
       .then((user) => res.json('User ' + user.account_id + ' added!'))
       .catch(err => res.status(400).json('Error: ' + err));
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
    
    /**
     *   NFT deletion api
     * 
     *    @param developer_id: 'dev'
     *    @param owner_account_id: username
     *    @param nft_ids: nft_ids
     *    @param edition: 
     * 
     *    curl -X DELETE -H “Authorization: Bearer <string>” 
     *         -H “Content-Type:application/json” 
     *         -d ‘{“nft_id”: <string>}’ 
     *         https://{hostname}/api/v1/nfts/{nft-id}/{edition}
     */
 
    //res.status(200).json('NFTs deleted!')
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

module.exports = router;