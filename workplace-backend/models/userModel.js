const mongoose = require('mongoose');
var bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
  eid: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  contact: {
    type: String,
  },
  designation: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  pancard: {
    type: String,
    required: true
  },
  accountno: {
    type: String,
    required: true
  },
  ifsc: {
    type: String,
    required: true
  },
  package: {
    type: Number,
    required: true
  },
  joining: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
},
  {
    timestamps: true,
  });


// userModel.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userModel.pre("save", async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model('Users', userModel);
module.exports = User;