const mongoose = require('mongoose');

const chatModel = new mongoose.Schema({
  members:{
    type:Array
  }
}, {
  timestamps: true
});
const Chat=mongoose.model('Chat', chatModel);
module.exports = Chat;