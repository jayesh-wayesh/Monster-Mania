const router = require('express').Router();
const Monster = require('../models/monster.model');
let User = require('../models/user.model');


// Return all users
router.route('/').get((req, res) => {

  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));

});


// Find monsters of a given user
router.route('/:username').get((req, res) => {

  User.findOne({username: req.params.username})
    .populate('monsters')
    .then(user => res.json(user.monsters))
    .catch(err => res.status(400).json('Error: ' + err));

});


// Account creation api
router.route('/add').post((req, res) => {

    /**
     *   NFT retrieval api
     * 
     *    @param developer_id: ENV_VARIABLE_DEVELOPER_ID
     *    @param account_id: req.body.username
     *    @param passcode: 
     * 
     *    curl -X POST -H “Authorization: Bearer <string>”
     *         -H “Content-Type: application/json” 
     *         -d ‘{“account_id”: <integer>, “account_id”: <string>, “passcode”: <string>}’ 
     *         https://{hostname}/api/v1/accounts
     * 
     */
    
    const username = req.body.username;
    const newUser = new User({
      username: username,
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
    await User.findOne({username: username })
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
     *    @param developer_id: ENV_VARIABLE
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