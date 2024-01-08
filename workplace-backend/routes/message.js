const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const Media = require('../models/mediaModel');
const expressasyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
var upload = require("./multer");
const path = require('path')

router.post('/upload', upload.single('image'), expressasyncHandler(async (req, res) => {
    res.send("Uploaded!!");
    // console.log(req.body);
    // console.log(req.file.filename);
    const name = req.file.filename;
    const fileExtension = path.extname(name).toLowerCase();
    const chatID = req.body.chatID;
    const senderID = req.body.senderID;
    try {
        await Media.create({ name: name, type: fileExtension, chatID: chatID, senderID: senderID });
        res.status(200).json();
    }
    catch (error) {
        res.status(500).json(error);
    }
}));

router.get('/showImages', expressasyncHandler(async (req, res) => {
    try {
        const images = await Media.find();
        const imageUrls = images.map(image => `http://localhost:5000/images/${image.name}`); // Assuming images are stored in public/images folder
        res.status(200).json(imageUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}));

router.get('/showAnImage/:imageName', protect, expressasyncHandler(async (req, res) => {
    const imageName = req.params.imageName;
    try {
        const images = await Media.findOne({ name: imageName });
        const imageUrl = `http://localhost:5000/images/${images.name}`;
        res.status(200).json({ imageUrl: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}));

router.post('/addMessage', expressasyncHandler(async (req, res) => {
    const { chatID, senderID, text } = req.body;
    const message = new Message({
        chatID, senderID, text
    });
    // console.log("SENDER",message)
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}));

router.get('/getMessages/:chatID', protect, expressasyncHandler(async (req, res) => {
    const chatID = req.params.chatID;
    try {
        const result = await Message.find({ chatID }).sort({ createdAt: 'asc' });;
        const result2 = await Media.find({ chatID }).sort({ createdAt: 'asc' });;

        const combinedData = [...result, ...result2].sort((a, b) => a.createdAt - b.createdAt);

        // console.log('combinedData', combinedData);
        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json(error);
    }
}));

module.exports = router;