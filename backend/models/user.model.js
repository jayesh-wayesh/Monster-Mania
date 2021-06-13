const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Monster = require('./monster.model');

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  blockchain: {type: String, required: true},
  blockchainAddress: {type: String, required: true},
  monsters: [{ type: Schema.Types.ObjectId, ref: Monster}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
