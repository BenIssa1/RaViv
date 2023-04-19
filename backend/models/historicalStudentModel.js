/** @format */

const mongoose = require("mongoose");

const historicalStudentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "Student",
    required: true,
  },
  tale: {
    type: mongoose.Schema.ObjectId,
    ref: "Tale",
    required: true,
  },
  note: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("HistoricalStudent", historicalStudentSchema);
