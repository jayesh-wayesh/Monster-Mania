const router = require('express').Router()
const Monster = require('../models/monster.model')
const User = require('../models/user.model')
const blockCoApi = require('../blockco/api_calls')
const Token = require('../helpers/token')
const DEVELOPER_ACCOUNT=process.env.DEVELOPER_ACCOUNT
const monsterNames = ["Birdy Boss","Casper Spray","Hit Woman","Aqua Coach","Thunder Kid","Mad Sauce","Octo Crush","Shady Stick","Sawft Ball","Hippie Puns","King Cyborg"]


// Fetch all Monsters NFTs
router.route('/').get((req, res) => {

    Monster.find()
        .then(monsters => res.json(monsters))
        .catch(err => res.status(400).json('Error: ' + err));
    
})


// Create Monster NFT 
router.route('/create').post(async (req,res) => {

    // Mint new NFTs to developer account
    const monsterID = req.body.monsterID
    const editions = req.body.editions
    var response = await blockCoApi.createNFTs(
        DEVELOPER_ACCOUNT,
        {
            'name': monsterNames[monsterID - 1],
            'monster_id': monsterID, 
            'editions': editions,
        }
    )
    if(response.statusCode !== 201){
        return res.json({"Error": response})
    }

    // Store the IDs of these newly minted NFTs
    const nft_ids = response.body.nft_ids


    // Retrieve the info of all the NFTs in developer account
    var response = await blockCoApi.retrieveNFT(DEVELOPER_ACCOUNT)
    if(response.statusCode !== 200){
        return res.json({"Error": response})
    }

    // Store the infos of all NFTs in developer account
    const monsters = response.body.nft_infos


    // Filter all the NFTs that are newly minted and update them in database
    var newMonstersArray = []
    if(monsters){

        // Create a monster in database for each newly minted NFT
        for (const monster of monsters) {
            if(nft_ids.includes(monster.id)){
                
                var ipfsURL = monster.content_url
                var imageURL = 'https://ipfs.io/ipfs/' + ipfsURL.replace("ipfs://", "")

                const newMonster = new Monster({
                    nft_id: monster.id,
                    edition: monster.edition,
                    media_id: JSON.parse(monster.developer_metadata).monster_id,
                    name: JSON.parse(monster.developer_metadata).name,
                    content_url: imageURL,
                });

                await newMonster.save()
                    .then(monster => { newMonstersArray.push(monster) })
                    .catch(err => res.json('Error: ' + err))
            }
        }
    }
    console.log('newMonstersArray : ', newMonstersArray)


    // Update users database to add all new monsters 
    User.findOne({ account_id: DEVELOPER_ACCOUNT })
        .then(user => {
            user.monsters = user.monsters.concat(newMonstersArray)

            user.save()
                .then(() => res.json('NFTs added to developer account '))
                .catch(err => res.json('Error: ' + err));
        })
})


// Transfer Monster NFT
router.route('/transfer').put(async (req, res) => {
    
    var monsterToBeTransferred
    const mediaID = req.body.monsterID
    const recipient = req.body.recipient
    const sender = DEVELOPER_ACCOUNT

    // Find a monster in developer's account having `media_id` equal to requested `mediaID`
    await User.findOne({ account_id: DEVELOPER_ACCOUNT })
        .populate('monsters')
        .then(user => {

            var index = user.monsters.findIndex(monster => monster.media_id == mediaID)
            monsterToBeTransferred = user.monsters[index]

            // Remove the monster from developer's collection
            user.monsters.splice(index, 1)

            user.save()
                .then(() => {console.log('monster removed from developer account!')})
                .catch(err => res.json('Error: ' + err))
        })


    var senderJwt = await Token.getUserJwt(sender)
    const nft_ids = [monsterToBeTransferred.nft_id]

    // Transfer the nft having `nft_id` equal to above found monster from sender to recipient
    var response = await blockCoApi.transferNFT(sender, recipient, nft_ids, senderJwt)

    // In case sender's jwt expires
    if(response.statusCode === 401){
        console.log('Trying with new Token')

        // call refresh token
        response = await Token.refreshToken(sender)
        if(response.statusCode !== 201){
            return res.json({"Error": response})
        }
        
        // update Token
        senderJwt = response.body.jwt

        // again call Transfer NFTs
        response = await blockCoApi.transferNFT(sender, recipient, nft_ids, senderJwt)
        if(response.statusCode !== 200){
            return res.json({"Error": response})
        }
  
    }else if(response.statusCode !== 200){
        return res.json({"Error": response})
    }


    // Add the monster user's collection
    await User.findOne({ account_id: recipient })
        .then(user => {
            user.monsters.push(monsterToBeTransferred)

            user.save()
                .then(() => {console.log('monster added to user account!')})
                .catch(err => res.json('Error: ' + err))
        })

    return res.json(monsterToBeTransferred)

});


module.exports = router;