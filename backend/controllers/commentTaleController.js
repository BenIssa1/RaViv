/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const Tale = require("../models/taleModel");
const CommentTale = require("../models/commentTaleModel");

// Create a comment
exports.createComment = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const tale = await Tale.findById(req.body.tale);

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  const commentTale = await CommentTale.create(req.body);

  // Add comment to tale
  let newCommentData = {
    $push: {
      comments: commentTale._id,
    },
  };

  await Tale.findByIdAndUpdate(tale._id, newCommentData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    commentTale,
  });
});
