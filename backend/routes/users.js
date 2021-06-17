const router = require('express').Router();
let User = require('../models/user.model');


// Return all users
router.route('/').get((req, res) => {

  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));

});


// Find monsters of a given user
router.route('/:username').get((req, res) => {

  User.findOne({account_id: req.params.username})
    .populate('monsters')
    .then(user => res.json(user.monsters))
    .catch(err => res.status(400).json('Error: ' + err));

});


// Account creation api
router.route('/add').post((req, res) => {

    const newUsername = req.body.username;
    const newPasscode = "a_secret_prefix" + username + "a_secret_suffix";

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
       .then(() => res.json('User added!'))
       .catch(err => res.status(400).json('Error: ' + err));
});


// NFT deletion api
router.route('/:username').delete(async (req, res) => {
    
    var nft_ids = []
    var username = req.params.username

    // Find the nft_ids of all the monsters user is currently having to burn 
    await User.findOne({account_id: username })
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
 
    res.status(200).json('NFTs deleted!')
});


module.exports = router;