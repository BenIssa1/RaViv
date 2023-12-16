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
  imageBackground: {
    type: String,
    required: false,
    default: 'https://i.pinimg.com/originals/d9/66/cb/d966cbf3aadc0db38adc92769a907f63.jpg'
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      responses: [
        {
          response: {
            type: String,
            required: true,
          },
          result: {
            type: Boolean,
            required: true,
          },
        },
      ],
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
