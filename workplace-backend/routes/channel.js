const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const ChannelChat = require('../models/channelChatModel');
const { protect } = require('../middleware/authMiddleware');
const expressAsyncHandler = require('express-async-handler');
const ChannelMessage = require('../models/channelMsgModel');
const Media = require('../models/mediaModel');

router.post('/addchannel', expressAsyncHandler(async (req, res) => {
  const { channelName } = req.body;
  try {
    const channel = await Channels.findOne({ channelName });
    if (channel) {
      return res.json({ message: `${channelName} is already present` });
    }
    else {
      const channels = new Channels({
        channelName
      });
      await channels.save();
      res.status(201).json({ message: "Channel added" });
    }
  }
  catch (error) {
    console.log(error);
  }
}));

router.post('/createChannelChat', expressAsyncHandler(async (req, res) => {
  const channelName = req.body.channelName;
  const members = req.body.members;
  const admins = req.body.admins;
  const image = req.body.image;

  try {
    const isPresent = await ChannelChat.findOne({ channelName: channelName });

    if (isPresent === null) {
      const channelData = new ChannelChat({
        channelName, members, admins,image
      });

      const result = await channelData.save();
      res.status(201).json({ message: 'Team created successfully', msgType: 'success' });
      // console.log('Result Channel Members', result);
    }
    else {
      res.status(500).json({ message: 'Team already created', msgType: 'warning' });
    }
  }
  catch (error) {
    console.log(error);
  }
}));

router.get('/displayChannels/:ID', expressAsyncHandler(async (req, res) => {
  const userId = req.params.ID;
  // console.log('UserID', userId);
  try {
    // Fetch all channel names from MongoDB
    const groupChats = await ChannelChat.find({
      $or: [
        { members: userId },
        { admins: userId }
      ]
    });
    // console.log('groupChats', groupChats);
    res.status(200).json(groupChats);

  } catch (error) {
    console.error('Error fetching channel names:', error);
    res.status(500).send('Internal Server Error');
  }
}));
router.get('/displayChannelsById/:ID', expressAsyncHandler(async (req, res) => {
  const channelId = req.params.ID;
  // console.log('UserID', userId);
  try {
    // Fetch all channel names from MongoDB
    const fetchChannel = await ChannelChat.findOne({
      _id: channelId
    }).populate([
      { path: 'members', select: 'name designation contact image' },
      { path: 'admins', select: 'name designation contact image' }
    ]);
    // console.log('groupChats', groupChats);
    res.status(200).json(fetchChannel);

  } catch (error) {
    console.error('Error fetching channel names:', error);
    res.status(500).send('Internal Server Error');
  }
}));
router.get('/displayAllChannels', expressAsyncHandler(async (req, res) => {
  try {
    // Fetch all channel names from MongoDB
    const allChannels = await ChannelChat.find().populate([
      { path: 'members', select: 'name' },
      { path: 'admins', select: 'name' }
    ]);
    if (allChannels) {
      // console.log('groupChats', allChannels);
      res.status(200).json(allChannels);
    }
    else {
      console.log("Not Found");
    }


  } catch (error) {
    console.error('Error fetching channel names:', error);
    res.status(500).send('Internal Server Error');
  }
}));

router.get('/displayUsers/:loggedInId', protect, expressAsyncHandler(async (req, res) => {
  try {
    // Fetch all channel names from MongoDB
    const users = await User.find({ eid: { $ne: req.params.loggedInId } });
    // console.log("DATA......", users);
    if (users) {
      return res.json({ data: users });
    }

  } catch (error) {
    console.error('Error fetching user names:', error);
    res.status(500).send('Internal Server Error');
  }
}));

router.get('/displayAUser/:userID', protect, expressAsyncHandler(async (req, res) => {
  try {
    // Fetch all channel names from MongoDB
    const users = await User.findById(req.params.userID);
    // console.log("DATA......", users);
    if (users) {
      return res.json(users);
    }

  } catch (error) {
    console.error('Error fetching user names:', error);
    res.status(500).send('Internal Server Error');
  }
}));

router.post('/addMessage', expressAsyncHandler(async (req, res) => {
  const { channelChatID, senderID, text } = req.body;

  const message = new ChannelMessage({
    channelChatID, senderID, text
  });

  // console.log("SENDER", message);
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}));

router.get('/getMessages/:channelChatID', protect, expressAsyncHandler(async (req, res) => {
  const channelChatID = req.params.channelChatID;
  try {
    const result = await ChannelMessage.find({ channelChatID }).sort({ createdAt: 'asc' });
    const result2 = await Media.find({ chatID: channelChatID }).sort({ createdAt: 'asc' });;

    const combinedData = [...result, ...result2].sort((a, b) => a.createdAt - b.createdAt);
    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json(error);
  }
}));

router.get('/getCommonChannel/:myID/:otherID', protect, expressAsyncHandler(async (req, res) => {
  const loggedInUserId = req.params.myID;
  const otherUserId = req.params.otherID;
  console.log('myID', loggedInUserId);
  console.log('otherID', otherUserId);
  try {
    const result = await ChannelChat.find({
      $or: [
        {
          $and: [
            { members: { $all: [loggedInUserId, otherUserId] } }
          ]
        },
        {
          $and: [
            { members: loggedInUserId },
            { admins: otherUserId }
          ]
        },
        {
          $and: [
            { admins: loggedInUserId },
            { members: otherUserId }
          ]
        }
      ]
    });
    // console.log('result...', result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}));

module.exports = router;