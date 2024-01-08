const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({
  chatID: {
    type: String,
  },
  senderID: {
    type: String,
  },
  text: {
    type: String,
  }
}, { timestamps: true });

const Message=mongoose.model('Message', messageModel);
module.exports = Message;