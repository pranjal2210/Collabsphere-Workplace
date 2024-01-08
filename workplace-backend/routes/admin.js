const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const expressasyncHandler = require("express-async-handler");

const { protect } = require("../middleware/authMiddleware");
const Timesheet = require('../models/timesheetModel');
const Payroll = require('../models/payrollModel');
const ChannelChat = require('../models/channelChatModel');

router.post('/insertuser', expressasyncHandler(async (req, res) => {
    const { eid, name, email, password, isAdmin, contact, designation, address, city, state, country, pincode, pancard, accountno, ifsc, package, joining, image } = req.body;
    const firstLetter = eid[0];
    try {
        const isAlreadyRegistered = await User.findOne({ eid });
        if (isAlreadyRegistered) {
            return res.json({ message: 'Employee already added', msgType: 'warning' });
        }
        else {
            if (firstLetter === 'A') {
                const isAdmin = true;
                const user = new User({
                    eid, name, email, password, isAdmin, contact, designation, address, city, state, country, pincode, pancard, accountno, ifsc, package, joining, image
                });
                await user.save();
                if (user) {
                    res.status(201).json({
                        _id: user.id,
                        eid: user.eid,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        contact: user.contact,
                        designation: user.designation,
                        address: user.address,
                        city: user.city,
                        state: user.state,
                        country: user.country,
                        pincode: user.pincode,
                        pancard: user.pancard,
                        accountno: user.accountno,
                        ifsc: user.ifsc,
                        package: user.package,
                        joining: user.joining,
                        message: "Inserted successfully",
                        msgType: "success",
                        token: generateToken(user._id)
                    });
                }
                else {
                    res.status(400);
                    throw new Error("Registration Error");
                }
            }
            else {
                const isAdmin = false;
                const user = new User({
                    eid, name, email, password, isAdmin, contact, designation, address, city, state, country, pincode, pancard, accountno, ifsc, package, joining, image
                });
                await user.save();
                if (user) {
                    res.status(201).json({
                        _id: user.id,
                        eid: user.eid,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        contact: user.contact,
                        designation: user.designation,
                        address: user.address,
                        city: user.city,
                        state: user.state,
                        country: user.country,
                        pincode: user.pincode,
                        pancard: user.pancard,
                        accountno: user.accountno,
                        ifsc: user.ifsc,
                        package: user.package,
                        joining: user.joining,
                        message: "Inserted successfully",
                        msgType: "success",
                        token: generateToken(user._id)
                    });
                }
                else {
                    res.status(400);
                    throw new Error("Registration Error");
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}));

router.get('/displayUsers/:loggedInId', protect, expressasyncHandler(async (req, res) => {
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

router.get('/displayUsersById/:id', protect, expressasyncHandler(async (req, res) => {
    try {
        // Fetch all channel names from MongoDB
        const id = req.params.id;
        const users = await User.find({ eid: id });
        // console.log("DATA......", users);
        if (users) {
            return res.json({ data: users });
        }

    } catch (error) {
        console.error('Error fetching user names:', error);
        res.status(500).send('Internal Server Error');
    }
}));

router.post('/updateUser/:id', expressasyncHandler(async (req, res) => {
    const { name, email, contact, pincode, designation, address, city, state, country, pancard, accountno, ifsc, image } = req.body;
    const ID = req.params.id;
    // console.log(req.body);

    try {
        const user = await User.updateOne(
            { _id: ID },
            {
                $set: {
                    name: name,
                    email: email,
                    contact: contact,
                    pincode: pincode,
                    designation: designation,
                    address: address,
                    city: city,
                    state: state,
                    country: country,
                    pancard: pancard,
                    accountno: accountno,
                    ifsc: ifsc,
                    image: image
                }
            }
        );
        if (user) {
            res.status(200).json({ message: 'Updated Successfully', msgType: "success" });
        }
        else {
            res.status(500).json({ message: 'UnSuccessful', msgType: "warning" });
        }
    } catch (error) {
        res.status(500).json(error);
    }

}));

router.post('/deleteUsers/:id', expressasyncHandler(async (req, res) => {
    const ID = req.params.id;
    try {
        const result = await User.deleteOne({ _id: ID });
        res.status(200).json({ message: "Deleted Successfully", msgType: 'success' });
    }
    catch (error) {
        console.log(error);
    }
}));

router.get('/getAdminTimesheetByDate/:date', protect, expressasyncHandler(async (req, res) => {
    const date = req.params.date;
    try {
        const timesheet = await Timesheet.find({
            date: date
        });
        // console.log("Timesheet...", timesheet);
        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json(error);
    }
}));

router.get('/displayAUser/:userID', protect, expressasyncHandler(async (req, res) => {
    const ID = req.params.userID;
    try {
        // Fetch all channel names from MongoDB
        const users = await User.findOne({ eid: ID });
        // console.log("DATA......", users);
        if (users) {
            return res.json(users);
        }

    } catch (error) {
        console.error('Error fetching user names:', error);
        res.status(500).send('Internal Server Error');
    }
}));
router.get('/getTimesheetByMonth/:month', protect, expressasyncHandler(async (req, res) => {
    const month = req.params.month;
    try {
        const timesheet = await Timesheet.find({
            month: month
        });
        // console.log("Timesheet Admin", timesheet);
        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/insertPayroll', expressasyncHandler(async (req, res) => {
    const { eid, name, designation, isApproved, date, tax, pf, pfamount, overtimepay, lop, finalsalary, month, package } = req.body;
    try {
        const isInserted = await Payroll.findOne({
            $and: [
                { eid: eid },
                { month: month }
            ]
        });
        if (isInserted === null) {
            const payroll = new Payroll({
                eid, name, designation, isApproved, date, tax, pf, pfamount, overtimepay, lop, finalsalary, month, package
            });
            const result = await payroll.save();
            res.status(200).json(result);
        }
        else {
            res.status(200).json("Already Inserted");
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.get('/fetchPayroll/:month', protect, expressasyncHandler(async (req, res) => {
    const month = req.params.month;
    try {
        const payroll = await Payroll.find({
            month: month
        });
        // console.log(payroll);
        res.status(200).json(payroll);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.get('/fetchPayrollByEID/:ID', protect, expressasyncHandler(async (req, res) => {
    const EID = req.params.ID;
    try {
        const payrolls = await Payroll.find({
            eid: EID
        });
        // console.log(payrolls);
        res.status(200).json(payrolls);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/updatePayroll/:ID', expressasyncHandler(async (req, res) => {
    const ID = req.params.ID;
    const { isApproved, date, finalsalary, overtimepay, lop } = req.body;
    // console.log('updatePayroll', req.body);
    try {
        const payroll = await Payroll.updateOne(
            { _id: ID },
            {
                $set: {
                    isApproved: isApproved,
                    date: date,
                    finalsalary: finalsalary,
                    lop: lop,
                    overtimepay: overtimepay
                }
            }
        );
        res.status(200).json({ message: `Payroll ${isApproved}`, msgType: 'success' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/updateChannelName', expressasyncHandler(async (req, res) => {
    const ID = req.body.id;
    const name = req.body.name;
    try {
        const updateName = await ChannelChat.updateOne(
            { _id: ID },
            {
                $set: {
                    channelName: name
                }
            }
        );
        res.status(200).json({ message: "Team name updated", msgType: 'success' });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/updateAdmins', expressasyncHandler(async (req, res) => {
    const ID = req.body.channelID;
    // console.log(req.body);
    try {
        const updateAdmins = await ChannelChat.updateOne(
            { _id: ID },
            {
                $push: {
                    admins: req.body.adminID
                }
            }
        );
        res.status(200).json({ message: "Admins Added Successfully", msgType: 'success' });

        // console.log(updateAdmins)
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/updateMembers', expressasyncHandler(async (req, res) => {
    const ID = req.body.channelID;
    // console.log(req.body);
    try {
        const updateMembers = await ChannelChat.updateOne(
            { _id: ID },
            {
                $push: {
                    members: req.body.memberID
                }
            }
        );
        res.status(200).json({ message: "Participants Added Successfully", msgType: 'success' });
        // console.log(updateMembers)
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/updateImage', expressasyncHandler(async (req, res) => {
    const ID = req.body.channelID;
    // console.log(req.body);
    try {
        const updateMembers = await ChannelChat.updateOne(
            { _id: ID },
            {
                image: req.body.image
            }
        );
        res.status(200).json({ message: "Image Updated Successfully", msgType: 'success' });
        // console.log(updateMembers)
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post('/deleteAdmins', expressasyncHandler(async (req, res) => {
    const ID = req.body.channelID;
    try {
        const result = await ChannelChat.updateOne(
            { _id: ID },
            {
                $pull: {
                    admins: { $eq: req.body.adminID }
                }
            }
        );
        res.status(200).json({ message: "Removed Successfully", msgType: 'success' });

    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/deleteMembers', expressasyncHandler(async (req, res) => {
    const ID = req.body.channelID;
    try {
        const result = await ChannelChat.updateOne(
            { _id: ID },
            {
                $pull: {
                    members: { $eq: req.body.memberID }
                }
            }
        );
        res.status(200).json({ message: "Removed Successfully", msgType: 'success' });

    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/deleteChannel', expressasyncHandler(async (req, res) => {
    const ID = req.body.channelID;
    try {
        const result = await ChannelChat.deleteOne({ _id: ID });
        res.status(200).json({ message: "Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
    }
}));

module.exports = router;