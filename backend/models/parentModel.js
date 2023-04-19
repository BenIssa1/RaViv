/** @format */

const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Firstname cannot exceed 30 characters"],
    minLength: [4, "Firstname should have more than 4 characters"],
  },
  lastname: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Lastname cannot exceed 30 characters"],
    minLength: [4, "Lastname should have more than 4 characters"],
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],
  type: {
    type: String,
    required: true,
  },
  establishment: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Parent", parentSchema);
