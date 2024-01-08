const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const ChannelChat = require('../models/channelChatModel');
const Message = require('../models/messageModel');
const expressasyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
var upload=require("./multer");
const Media = require('../models/mediaModel');

// router.post('/accessChat',protect, expressasyncHandler(async (req, res) => { 
//     const { userId } = req.body;
//     console.log(req.body);

//     if (!userId) {
//       console.log("UserId param not sent with request");
//       return res.sendStatus(400);
//     }

//     var isChat = await Chat.find({
//       isGroupChat: false,
//       $and: [
//         { users: { $elemMatch: { $eq: req.user._id } } },
//         { users: { $elemMatch: { $eq: userId } } },
//       ],
//     })
//       .populate("users", "-password")
//       .populate("latestMessage");

//     isChat = await User.populate(isChat, {
//       path: "latestMessage.sender",
//       select: "name email",
//     });

//     if (isChat.length > 0) {
//       res.send(isChat[0]);
//     } else {
//       var chatData = {
//         chatName: "sender",
//         isGroupChat: false,
//         users: [req.user._id, userId],
//       };

//       try {
//         const createdChat = await Chat.create(chatData);
//         const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
//           "users",
//           "-password"
//         );
//         res.status(200).json(FullChat);
//       } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//       }
//     }
// }));

// router.post('/fetchChat', expressasyncHandler(async (req, res) => {
//     try {
//       console.log("Fetch Chats aPI : ", req);
//       Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 })
//         .then(async (results) => {
//           results = await User.populate(results, {
//             path: "latestMessage.sender",
//             select: "name email",
//           });
//           res.status(200).send(results);
//         });
//     } catch (error) {
//       res.status(400);
//       throw new Error(error.message);
//     }
//   }));

router.post('/createChat', expressasyncHandler(async (req, res) => {
  const newChat = new Chat({
    members: [req.body.senderID, req.body.receiverID]
  });

  try {
    const hadChat = await Chat.findOne({
      $or: [
        { members: [req.body.senderID, req.body.receiverID] },
        { members: [req.body.receiverID, req.body.senderID] }
      ]
    });
    // console.log('hadChat?:', hadChat);
    if (hadChat === null) {
      const result = await newChat.save();
      res.status(200).json(result);
    }
    else {
      res.status(200).json(hadChat);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}));

router.get('/userChat/:userID', protect, expressasyncHandler(async (req, res) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userID] }
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
}));

router.get('/findChat/:firstID/:secondID', expressasyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstID, req.params.secondID] }
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
}));

router.post('/savePictures', upload.single('picture'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Save file metadata to MongoDB
    const media= new Media({
      name: req.file.originalname,
      path: req.file.path,
    });

    media.save((err) => {
      if (err) {
        return res.status(500).send('Error saving to the database.');
      }

      res.status(200).send('File uploaded and saved to the database.');
      console.log(req.file);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
