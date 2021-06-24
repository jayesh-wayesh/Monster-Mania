const router = require('express').Router();
let Monster = require('../models/monster.model');
let User = require('../models/user.model');



// Fetch all monsters
router.route('/').get((req, res) => {

    Monster.find()
        .then(monsters => res.json(monsters))
        .catch(err => res.status(400).json('Error: ' + err));
})


// NFT Creation 
router.route('/create').post(async (req,res) => {

    /**
     *   NFT creation api
     * 
     *    @param developer_id: ENV_VARIABLE_DEVELOPER_ID
     *    @param recipient_account_id: 'dev'
     *    @param number: req.body.editions
     *    @param developer_metadata: {name: req.body.monsterProperties.name, monster_id: req.body.monsterProperties.monsterID}
     *    @param content: req.body.monsterProperties.imageUrl
     * 
     *    curl -X POST -H “Authorization: Bearer <string>” 
     *         -H “Content-Type: multipart/form-data” 
     *         -F “recipient_account_id=<string>” 
     *         -F upload=@{filename} 
     *         https://{hostname}/api/v1/nfts
     * 
     */

  /********** NFT Creation api call starts **********/

  var developerMetadata = {
    name: req.body.monsterProperties.name,
    monster_id: req.body.monsterProperties.monsterID
  }

  var data = {
    'developer_id': DEVELOPER_ID,     
    'recipient_account_id': 'dev',            
    'number': req.body.editions,    
    'developer_metadata': JSON.stringify( developerMetadata ),
    'content': req.body.monsterProperties.imageUrl,      
  }
  
  var jwt = generateAccessToken()
  var options = {
    uri: BASE_URL + '/api/v1/nfts',
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
      'Content-Type': 'application/json'
    }
  }

  request(options, (error, response) => {
    
    console.log('NFT creation api response :')
    console.log(error,response.body)

  });

  /********** Account Creation api call ends **********/
    
    // Temporary workaround to create NFTs 
    var editions = req.body.editions
    console.log('editions')
    console.log(req.body.editions)
    var newMonstersArray = []

    for(var i = 1; i <= editions; i++) {

        const newMonster = new Monster({
            nft_id: Number(req.body.last_nft_id) + i,  // value added is temporary 
            edition: i,  // value added is temporary 
            media_id: req.body.monsterProperties.monsterID
        });
        
        //newMonstersArray.push(newMonster)
        await newMonster.save()
                    .then(monster => {newMonstersArray.push(monster)})
                    .catch(err => res.status(400).json('Error: ' + err))

    }
    
    User.findOne({ account_id: 'dev'})
        .then(user => {
            user.monsters = user.monsters.concat(newMonstersArray)
            console.log(user)

            user.save()
                .then(() => res.status(200).json('NFTs added to developer account '))
                .catch(err => res.status(400).json('Error: ' + err));
        })

})


// NFT Transfer
router.route('/transfer').put(async (req, res) => {

    const media_id = req.body.monsterID
    var monsterToBeTransferred

    // Remove from developer's account
    await User.findOne({account_id: 'dev' })
            .populate('monsters')
            .then(user => {

                var index = user.monsters.findIndex(monster => monster.media_id == media_id)
                monsterToBeTransferred = user.monsters[index]
                user.monsters.splice(index, 1)

                console.log('monsterToBeTransferred')
                console.log(monsterToBeTransferred)

                user.save()
                    .then(() => {console.log('monster removed from developer account!')})
                    .catch(err => res.status(400).json('Error: ' + err))
            })
    
    //  Transfer it to user on blockchain        
    /**
     *   NFT transfer api
     * 
     *    @param developer_id: ENV_VARIABLE_DEVELOPER_ID
     *    @param sender_account_id: 'dev'
     *    @param recipient_account_id: req.body.recipient
     *    @param nft_ids: [monsterToBeTransferred.nft_id]
     * 
     * 
     *    curl -X PUT -H “Authorization: Bearer <string>” 
     *         -H “Content-Type: application/json” 
     *         -d ‘{“recipient_account_id”: <string>}’ 
     *         https://{hostname}/api/v1/nfts/{nft-id}/{edition}
     * 
     */

    /********** NFT Transfer api call starts **********/

    var data = {
        'developer_id': DEVELOPER_ID,     
        'sender_account_id': 'dev',            
        'recipient_account_id': req.body.recipient,    
        'nft_ids': [ monsterToBeTransferred.nft_id ]
    }
    
    var jwt = generateAccessToken()
    var options = {
        uri: BASE_URL + '/api/v1/nfts',
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
        'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
        'Content-Type': 'application/json'
        }
    }

    request(options, (error, response) => {
        
        console.log('NFT Transfer api response :')
        console.log(error,response.body)

    });

    /********** NFT Transfer api call ends **********/


    // Add to user's account
    await User.findOne({ account_id: req.body.recipient })
            .then(user => {
                user.monsters.push(monsterToBeTransferred)
                console.log('user')
                console.log(user)

                user.save()
                    .then(() => {console.log('monster added to user account!')})
                    .catch(err => res.status(400).json('Error: ' + err))
            })

    res.status(200).json(monsterToBeTransferred)

});


module.exports = router;