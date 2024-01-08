const mongoose = require('mongoose');
const User=require('./userModel');

const channelChatModel = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: User, // Reference to the User model for members
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: User, // Reference to the User model for members
  }],
  image:{
    type:String
  }
}, {
  timestamps: true
});
const ChannelChat = mongoose.model('ChannelChat', channelChatModel);
module.exports = ChannelChat;