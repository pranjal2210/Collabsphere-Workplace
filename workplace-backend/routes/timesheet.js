const express = require('express');
const router = express.Router();
const expressasyncHandler = require("express-async-handler");
const { protect } = require("../middleware/authMiddleware");
const Timesheet = require('../models/timesheetModel');

router.post('/insertTimesheet', expressasyncHandler(async (req, res) => {
    const { eid, date, day, month, clockin, pause, resume, clockout, overtime, totalhours } = req.body;

    const timesheetData = new Timesheet({
        eid, date, day, month, clockin, pauseResume: { pause, resume }, clockout, overtime, totalhours
    });

    try {
        const isSubmitted = await Timesheet.findOne({
            $and: [
                { eid: eid },
                { date: date }
            ],
        });
        // console.log('Timesheet check', isSubmitted);

        if (isSubmitted === null) {
            const result = await timesheetData.save();
            res.status(200).json(result);
            // console.log('Timesheet ', result);
        }
        else {
            res.json({ message: 'Already Submitted' });
        }

    } catch (error) {
        res.status(500).json(error);
    }
}));

router.get('/getTimesheet/:ID/:month', protect, expressasyncHandler(async (req, res) => {
    // console.log(req.params.ID, req.params.month);
    const eid = req.params.ID;
    const month = req.params.month;
    try {
        const timesheet = await Timesheet.find({
            eid: eid,
            month: month
        }).sort({ date: 1 });
        // console.log("Timesheet...", timesheet);
        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json(error);
    }
}));
router.get('/getTimesheetByDate/:ID/:date', protect, expressasyncHandler(async (req, res) => {
    // console.log(req.params.ID, req.params.date);
    const eid = req.params.ID;
    const date = req.params.date;
    try {
        const timesheet = await Timesheet.find({
            eid: eid,
            date: date
        });
        // console.log("Timesheet...", timesheet);
        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json(error);
    }
}));

router.post('/updateTimesheet', expressasyncHandler(async (req, res) => {
    const { id, eid, date, day, month, clockin, pause, resume, clockout, overtime, totalhours } = req.body;
    // console.log(req.body);

    try {
        const timeSheetValue = await Timesheet.findOne({ _id: id });

        if (timeSheetValue.pauseResume[0].pause === '00:00:00' && timeSheetValue.pauseResume[0].resume === '00:00:00') {
            const timesheet = await Timesheet.updateOne(
                { _id: id },
                {
                    $set: {
                        pauseResume: {
                            pause: pause,
                            resume: resume
                        }
                    }
                }
            );
            if (timesheet) {
                res.status(200).json({ message: 'Updated Successfully' });
            }
            else {
                res.status(500).json({ message: 'UnSuccessful' });
            }
        }
        else {
            const timesheet = await Timesheet.updateOne(
                { _id: id },
                {
                    $push: {
                        pauseResume: {
                            pause: pause,
                            resume: resume
                        }
                    }
                }
            );
            if (timesheet) {
                res.status(200).json({ message: 'Updated Successfully' });
            }
            else {
                res.status(500).json({ message: 'UnSuccessful' });
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }

}));

router.post('/updateTimesheetLogout', expressasyncHandler(async (req, res) => {
    const { id, clockout, totalhours,overtime } = req.body;
    // console.log("logout body",req.body);
    const isAlreadyLogout = await Timesheet.findOne({ _id: id });
    // console.log("isAlreadyLogout", isAlreadyLogout);
    // console.log("isAlreadyLogout", id, clockout);
    if (isAlreadyLogout.clockout === "—") {
        try {
            const timesheet = await Timesheet.updateOne(
                { _id: id },
                {
                    $set: {
                        clockout: clockout,
                        totalhours:totalhours,
                        overtime:overtime,
                    }
                }
            );
            if (timesheet) {
                res.status(200).json({ message: 'Updated Successfully' });
            }
            else {
                res.status(500).json({ message: 'UnSuccessful' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else {
        res.json("Not updated during logged out");
    }
}));

module.exports = router;