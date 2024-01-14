/** @format */

const mongoose = require("mongoose");

const storytellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  storyTellersName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  cvUrl: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  fieldOfActivity: {
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
  tales: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tale",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Storyteller", storytellerSchema);
