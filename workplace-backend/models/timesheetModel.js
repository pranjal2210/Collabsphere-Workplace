const mongoose = require('mongoose');

const TimesheetModel = new mongoose.Schema({
  eid: {
    type: String,
  },
  date: {
    type: String,
  },
  day: {
    type: String,
  },
  month:{
    type:String,
  },
  clockin: {
    type: String,
  },
  pauseResume:[{
    pause:String,
    resume:String
  }],
  clockout: {
    type: String,
  },
  overtime: {
    type: Number,
  },
  totalhours: {
    type: Number,
  }  
}, { timestamps: true });

const Timesheet=mongoose.model('Timesheet', TimesheetModel);
module.exports = Timesheet;