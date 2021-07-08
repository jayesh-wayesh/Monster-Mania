const request = require('request')
const jwt = require('jsonwebtoken')
var FormData = require('form-data')
var fs = require('fs')

const BLOCKCO_API_URL=process.env.BLOCKCO_API_URL 
const DEVELOPER_PRIVATE_KEY=process.env.DEVELOPER_PRIVATE_KEY
const DEVELOPER_ID=Number(process.env.DEVELOPER_ID)
const SERVER_NAME=process.env.SERVER_NAME


// 🅱️ BlockCo's Create Account API 
function createAccount(account_id, passcode){
   
    var data = {
        'developer_id': DEVELOPER_ID,     
        'account_id': account_id,            
        'passcode': passcode,          
    }
      
    var jwt = generateAccessToken()
    var options = {
        uri: BLOCKCO_API_URL + '/api/v1/accounts',
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
          'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            resolve({
                statusCode: response.statusCode, 
                statusMessage: response.statusMessage,
                body: JSON.parse(response.body), 
            })
        })
    })
}


// 🅱️ BlockCo's Create NFT API 
function createNFTs(recipient_account_id, monster_props){
    
    var form = new FormData()
    var developerMetadata = {
        name: monster_props.name, 
        monster_id: monster_props.monster_id,
    }
    var monsterMediaPath = './media/monster'+ monster_props.monster_id + '.png'
  
    form.append('developer_id', DEVELOPER_ID)
    form.append('recipient_account_id', recipient_account_id)
    form.append('number', monster_props.editions) 
    form.append('developer_metadata', JSON.stringify( developerMetadata ))
    form.append('content', fs.createReadStream( monsterMediaPath )) 
    
    var jwt = generateAccessToken()
    var bound = form.getBoundary()
    var options = {
        uri: BLOCKCO_API_URL + '/api/v1/nfts',
        body: form,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
            'Content-Type': 'multipart/form-data; boundary=' + bound,
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            resolve({
                statusCode: response.statusCode, 
                statusMessage: response.statusMessage,
                body: JSON.parse(response.body), 
            })
        })
    })
}


// 🅱️ BlockCo's Transfer NFT API 
function transferNFT(sender_account_id, recipient_account_id, nft_ids, sender_jwt){

    var data = {
        'developer_id': DEVELOPER_ID,     
        'sender_account_id': sender_account_id,            
        'recipient_account_id': recipient_account_id,    
        'nft_ids': nft_ids,
    }
        
    var options = {
        uri: BLOCKCO_API_URL + '/api/v1/nfts',
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + sender_jwt,               // sender's JWT.
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            resolve({
                statusCode: response.statusCode, 
                statusMessage: response.statusMessage,
                body: response.body, 
            })
        })
    })
}


// 🅱️ BlockCo's Retrieve NFTs API 
function retrieveNFT(owner_account_id){

    var data = {
        'developer_id': DEVELOPER_ID,     
        'owner_account_id': owner_account_id,            
    }
            
    var jwt = generateAccessToken()
    var options = {
        uri: BLOCKCO_API_URL + '/api/v1/nfts',
        body: JSON.stringify(data),
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwt,               // developers's JWT.
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            resolve({
                statusCode: response.statusCode, 
                statusMessage: response.statusMessage,
                body: JSON.parse(response.body), 
            })
        })
    })
}


// 🅱️ BlockCo's Delete NFTs API 
function deleteNFTs(owner_account_id, nft_ids, owner_jwt){

    var data = {
        'developer_id': DEVELOPER_ID,     
        'owner_account_id': owner_account_id,        
        'nft_ids': nft_ids,   
    }
  
    var options = {
        uri: BLOCKCO_API_URL + '/api/v1/nfts',
        body: JSON.stringify(data),
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + owner_jwt,               // sender's JWT.
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            resolve({
                statusCode: response.statusCode, 
                statusMessage: response.statusMessage,
                body: response.body, 
            })
        })
    })
}


// 🅱️ BlockCo's Refresh token API 
function refreshToken(account_id, passcode) {

    var data = {
      'developer_id': DEVELOPER_ID,     
      'account_id': account_id,            
      'passcode': passcode,          
    }
    
    var jwt = generateAccessToken()
    var options = {
      uri: BLOCKCO_API_URL + '/api/v1/tokens',
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + jwt,               // Developer’s JWT.
        'Content-Type': 'application/json'
      }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            resolve({
                statusCode: response.statusCode, 
                statusMessage: response.statusMessage,
                body: JSON.parse(response.body), 
            })
        })
    })
}


// Creating developer JWT signed by private key 
function generateAccessToken() {
  
    var DeveloperClaims = {
      'exp': Date.now() + 15000,
      'iss': SERVER_NAME,
      'developer_id': DEVELOPER_ID,
    }
  
    const buffer = Buffer.from(DEVELOPER_PRIVATE_KEY, 'base64');
    return jwt.sign(DeveloperClaims, buffer)
}


module.exports = { createAccount, createNFTs, transferNFT, retrieveNFT, deleteNFTs, refreshToken };