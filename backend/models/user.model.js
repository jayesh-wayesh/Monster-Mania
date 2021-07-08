const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const Schema = mongoose.Schema;
let Monster = require('./monster.model');

const userSchema = new Schema({
    account_id: {type: String, required: true, unique: true}, 
    passcode: {type: String, required: true},
    blockchain: {type: String, required: true},
    blockchainAddress: {type: String, required: true},
    jwt: {type: String, required: true},         // 🔊 NOTE: Only for the purpose of demo app we are storing jwt openly in database
    monsters: [{ type: Schema.Types.ObjectId, ref: Monster}],
    game_info: {
        isWinner: {type: Boolean, default: false}, 
        last_nft_award : {
            date: {type: Number},                // date in yyyymmdd
            time: {type: Number}                 // time in total secs
        }
    }
});

var secret = process.env.ENCRYPTION_SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['passcode'] });
const User = mongoose.model('User', userSchema);

module.exports = User;
