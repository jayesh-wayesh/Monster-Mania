WIP!

<img src="./banner.png" width="1200">

<br/>

👋 Welcome! This demo app is created for [BlockCo Labs](https://www.blockcolabs.com/) NFT SaaS Platform. 
- **Monster Mania** is a collection game that uses BlockCo APIs for following use cases -
  - Account Creation
  - Token Refresh
  - NFT Creation
  - NFT Retrieval
  - NFT Transfer
  - NFT Deletion
- It's a full-stack app based on MERN stack.

<br/>

## Game Description 

Monster Mania is a collection game in which one can win a random Monster NFT daily! There are a total of 10 different monsters. Goal is to collect all the 10 monsters. Once you have completed the collection, you'll win a <b>King Monster NFT</b> to rule the monster world.


<br/>

## Getting Started

 Steps to run it locally

#### 1. Clone the project
```
git clone https://github.com/blockcolabs/monster-mania.git
```

#### 2. Complete the steps given in [Prerequisites](https://github.com/blockcolabs/monster-mania/tree/dev#prerequisites) to update `env` variables in frontend and backend.

#### 3. Start Backend
Use the following steps to 
3. Start `Backend` using following steps - 
    - cd backend
    - yarn
    - nodemon server
    - go to localhost:5000
4. Start `Frontend` using following steps -
    - yarn 
    - yarn start
    - go to localhost:3000
5. Follow the steps given in [Minting monsters](https://github.com/blockcolabs/monster-mania/tree/dev#minting-monsters) section to mint the monsters to play the game.
6. Sign up using a new username and start playing.

<br/>

## Prerequisites 

#### ⭐ Backend
- Copy the content of `.env.default` file to a new `.env` and update the required environment variable(s). Note the following points before updating env variables :
    - We are hosting are database using MongoDB Atlas. So, you'll need to create a new account in MongoDB Atlas and update the `ATLAS_URI` obtained in backend's .env file.
    - `ENCRYPTION_SECRET` is required by mongoose-encryption to encrypt passcode and password
    - `DEVELOPER_ACCOUNT` is basically the developer username. You can choose any username. Same can be used in .env file of frontend.

#### ⭐ Frontend
- Copy the content of `.env.default` file to a new `.env` file and update the required environment variable(s).

#### ⭐ BlockCo APIs
- You'll need to request a private key to use BlockCo APIs. You can request key by making a call to 
```
curl -X POST -H "Content-Type: application/json" -d '{"subscription": "FREE"}'  <BLOCKCO_API_URL>/api/v1/developers
```
In response you'll get `private_key` and `id` that you'll need to use in .env file present in backend for DEVELOPER_PRIVATE_KEY and DEVELOPER_ID respectively

<br/>

## Minting Monsters

In order to mint monsters, you'll need to sign up as admin. Use same username as `DEVELOPER_ACCOUNT` and enter a suitable password. It'll open a page for you where you can select the monster and number of editions to be minted for that monster. All the monsters will be minted to blockchain account corresponding to `DEVELOPER_ACCOUNT`. After you've minted enough NFTs you can logout and then login back as a new user.
```
⚠️ Make sure you've minted enough number of monsters before trying out the actual game otherwise game will not work properly 
```

<br/>

## References

#### Monster Images
We are using Blush Design's [Street Life](https://blush.design/collections/2q77tcQgOR3gUha4oprc/street-life) Collection by [YONG](https://blush.design/artists/YONG).
