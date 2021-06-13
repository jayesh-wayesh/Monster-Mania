const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monsterSchema = new Schema({
  nft_id: {type: Number, required: true, unique: true},
  edition: {type: Number, required: true},
  media_id: {type: Number, required: true},
});

const Monster = mongoose.model('Monster', monsterSchema);

module.exports = Monster;