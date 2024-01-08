const mongoose = require('mongoose');

const payrollModel = new mongoose.Schema({
  eid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  isApproved:{
    type: String,
    required:true,
  },
  date:{
    type: String,
    required:true,
  },
  tax:{
    type: Number,
    required:true,
  },
  pfamount:{
    type:Number,
    required:true,
  },
  pf:{
    type:String,
    required:true,
  },
  overtimepay:{
    type:Number,
    required:true,
  },
  lop:{
    type:Number,
    required:true,
  },
  finalsalary:{
    type:Number,
    required:true,
  },
  month:{
    type:String,
    required:true,
  },
  package:{
    type:Number,
    required:true,
  },
}, {
  timestamps: true
});
const Payroll = mongoose.model('payroll', payrollModel);
module.exports = Payroll;