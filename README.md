# Monster Mania

Monster Mania is a collection game in which one can win a random Monster NFT daily! There are a total of 10 different monsters. Goal is to collect all the 10 monsters. Once you have completed the collection, you'll win a <b>King Monster NFT</b> to rule the monster world.

<img src="https://blush.design/api/download?shareUri=PscwxZOpVNvMn679&c=Skin_0%7Ef45675-0.0%7E0089fd-0.1%7Eacff00-0.2%7Ef45675-0.3%7Efd8800-0.4%7Ef45675-0.5%7E0089fd-0.6%7Effcf00-0.7%7E7c6bba-0.8%7E0099a3-0.9%7Eacff00-0.10%7E00d2dc-0.11%7Efd8800&w=800&h=800&fm=png" width="500">


## Steps to run it locally

1. git clone [https://github.com/jayesh-wayesh/Monster_Mania.git](https://github.com/jayesh-wayesh/Monster_Mania.git)
2. Set branch to `main`
3. Make sure to complete steps given in Prerequisites
4. Start `Backend` using following steps - 
- cd backend
- yarn
- nodemon server
- go to localhost:5000
5. Start `Frontend` using following steps -
- yarn 
- yarn start
- go to localhost:3000
6. Follow the steps given in Minting monsters section to mint the monsters to play the game.
7. Sign up using a new username and start playing.

## Prerequisites 

#### Frontend
- Copy the content of `.env.default` file to a new `.env` file and update the required environment variable(s).

#### Backend
- Copy the content of `.env.default` file to a new `.env` and update the required environment variable(s).
    - We are hosting are database using MongoDB Atlas. So, you'll need to create a new account in MongoDB Atlas and update the `ATLAS_URI` obtained in backend's .env file.
    - `ENCRYPTION_SECRET` is required by mongoose-encryption to encrypt passcode and password
    - `DEVELOPER_ACCOUNT` is basically the developer username. You can choose any username. Same can be used in .env file of frontend.

#### BlockCo APIs
- You'll need to request a private key to use BlockCo APIs. You can request key by making a call to 
    > curl -X POST -H "Content-Type: application/json" -d '{"subscription": "FREE"}'  http://ec2-3-142-243-10.us-east-2.compute.amazonaws.com:8081/api/v1/developers
    In response you'll get `private_key` and `id` that you'll need to use in .env file present in backend for DEVELOPER_PRIVATE_KEY and DEVELOPER_ID respectively

## Minting Monsters

In order to mint monsters, you'll need to sign up as admin. Use same username as `DEVELOPER_ACCOUNT` and enter a suitable password. It'll open a page for you where you can select the monster and number of editions to be minted for that monster. All the monsters will be minted to blockchain account corresponding to `DEVELOPER_ACCOUNT`. After you've minted enough NFTs you can logout and then login back as a new user.
> Make sure you've minted enough number of monsters before trying out the actual game otherwise game will not work properly 

## References

#### Monster Images
We are using Blush Design's [Street Life](https://blush.design/collections/2q77tcQgOR3gUha4oprc/street-life) Collection by [YONG](https://blush.design/artists/YONG).
