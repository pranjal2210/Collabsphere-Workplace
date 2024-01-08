const mongoose = require('mongoose');

const mediaModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  chatID: {
    type: String,
    required: true
  },
  senderID: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaModel);

module.exports = Media;