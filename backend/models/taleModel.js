/** @format */

const mongoose = require("mongoose");

const taleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  typeTale: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      response: {
        type: Boolean,
        required: true,
      },
    },
  ],
  storyteller: {
    type: mongoose.Schema.ObjectId,
    ref: "Storyteller",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "CommentTale",
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  userLikes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tale", taleSchema);
