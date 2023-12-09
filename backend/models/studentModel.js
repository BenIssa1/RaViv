/** @format */

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Firstname cannot exceed 30 characters"],
    minLength: [2, "Firstname should have more than 4 characters"],
  },
  lastname: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Lastname cannot exceed 30 characters"],
    minLength: [2, "Lastname should have more than 4 characters"],
  },
  classroom: {
    type: String,
    required: true,
  },
  establishment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: "Parent",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
