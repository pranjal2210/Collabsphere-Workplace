const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const expressasyncHandler = require("express-async-handler");

const { protect } = require("../middleware/authMiddleware");
const Timesheet = require('../models/timesheetModel');
const ChannelChat = require('../models/channelChatModel');

router.post('/insertuser', expressasyncHandler(async (req, res) => {
  const { eid, name, email, contact, password } = req.body;

  try {
    const employee = await User.findOne({ eid });
    if (!employee) {
      return res.json({ message: 'Employee not found', msgType: 'warning' });
    }
    else {
      const employeeId = employee._id;
      const isAlreadyRegistered = await User.findOne({
        $and: [
          { eid: eid },
          { email: email }
        ]
      });
      const isEmailExist = await User.findOne({ email });
      if (isAlreadyRegistered || employee.email !== "") {
        return res.json({ message: 'You are already registered', msgType: 'warning' });
      }
      else if (isEmailExist) {
        return res.json({ message: 'Email ID already in use', msgType: 'warning' });
      }
      else {
        try {
          const user = await User.updateOne(
            { eid: eid },
            {
              $set: {
                name: name,
                email: email,
                contact: contact,
                password: password
              }
            }
          );
          const addToChannel = await ChannelChat.updateOne(
            { channelName: { $regex: '^general$', $options: 'i' } },
            {
              $push: {
                members: employeeId._id
              }
            }
          );
          // console.log(addToChannel);
          if (user) {
            res.status(201).json({
              _id: user.id,
              eid: user.eid,
              name: user.name,
              email: user.email,
              contact: user.contact,
              isAdmin: user.isAdmin,
              message: "Registration successful",
              msgType: "success",
              token: generateToken(user._id)
            });
          }
          else {
            res.status(400);
            throw new Error("Registration Error");
          }
        } catch (error) {
          res.status(500).json(error);
        }
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}));

function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so we add 1.
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
}

router.post('/userlogin', expressasyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const employee = await User.findOne({ email });
  const logintime = new Date().toTimeString().split(' ')[0];
  const currentDate = formatDate(new Date());

  // console.log('Console Log', employee);

  try {
    if (!employee) {
      return res.json({ message: 'You are not registered', msgType: 'warning' });
    }

    else {
      const eid = employee.eid;
      // if (employee && (await employee.matchPassword(password))) {
      const isAlreadyFilled = await Timesheet.findOne({
        $and: [
          { eid: eid },
          { date: currentDate }
        ],
      });

      if (isAlreadyFilled !== null && isAlreadyFilled.clockin === "—") {
        try {
          const timesheet = await Timesheet.updateOne(
            { _id: isAlreadyFilled._id },
            {
              $set: {
                clockin: logintime,
              }
            }
          );
        } catch (error) {
          res.status(500).json(error);
        }
      }

      if (employee && password === employee.password) {
        const response = {
          _id: employee._id,
          eid: employee.eid,
          name: employee.name,
          email: employee.email,
          contact: employee.contact,
          isAdmin: employee.isAdmin,
          designation: employee.designation,
          image: employee.image,
          message: 'Login successful',
          msgType: 'success',
          token: generateToken(employee._id)

        };
        // console.log(response);
        res.json(response);
      }
      else {
        return res.json({ message: 'Wrong Credentials', msgType: 'warning' });
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}));

router.post('/updateuser', expressasyncHandler(async (req, res) => {
  try {
    const { eid, name, email, contact, password, image } = req.body;
    const user = await User.findOne({ eid });

    if (user) {
      // if (user && (await user.matchPassword(password))) {
      if (user && password === user.password) {
        user.name = name;
        user.email = email;
        user.contact = contact;
        user.image = image;
        const updatedUser = await user.save();
        if (updatedUser) {
          res.status(201).json({
            _id: updatedUser.id,
            eid: updatedUser.eid,
            name: updatedUser.name,
            email: updatedUser.email,
            contact: updatedUser.contact,
            image: updatedUser.image,
            designation: updatedUser.designation,
            message: "Profile Updated",
            msgType: "success",
            token: generateToken(updatedUser._id)
          });
        }
      }
      else {
        return res.status(201).json({
          _id: user.id,
          eid: user.eid,
          name: user.name,
          email: user.email,
          contact: user.contact,
          image: user.image,
          designation: user.designation,
          message: "Incorrect Password",
          msgType: "warning",
          token: generateToken(user._id)
        });
      }
    }
    else {
      return res.json({ message: 'User not found', msgType: 'warning' });
    }
  }
  catch (error) {
    console.log(error);
  }
}));

module.exports = router;