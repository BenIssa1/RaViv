/** @format */

const mongoose = require("mongoose");

const commentTaleSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  tale: {
    type: mongoose.Schema.ObjectId,
    ref: "Tale",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CommentTale", commentTaleSchema);
