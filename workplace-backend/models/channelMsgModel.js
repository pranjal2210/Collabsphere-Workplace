const mongoose = require('mongoose');

const ChannelMessageModel = new mongoose.Schema({
  channelChatID: {
    type: String,
  },
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
  }
}, { timestamps: true });

const ChannelMessage = mongoose.model('ChannelMessage', ChannelMessageModel);
module.exports = ChannelMessage;