/** @format */

const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Tale = require("../models/taleModel");
const Storyteller = require("../models/storytellerModel");
const ApiFeatures = require("../utils/apifeatures");
require("dotenv").config({ path: "backend/config/config.env" });

// Create a Tale
exports.createTale = catchAsyncErrors(async (req, res, next) => {
  
  const storyteller = await Storyteller.findOne({ user: req.user.id });

  if (!storyteller) {
    return next(new ErrorHander("Storyteller not found", 404));
  }

  let questions = [
    JSON.parse(req.body.questions1),
    JSON.parse(req.body.questions2),
    JSON.parse(req.body.questions3),
  ];
  
    req.body.user = req.user.id;
    // req.body.videoUrl = data.Location;
    req.body.questions = questions;

    // Create tale
    req.body.storyteller = storyteller._id;
    const tale = await Tale.create(req.body);

    // Add Tale to storyteller
    let newUserStorytellerData = {
      $push: {
        tales: tale._id,
      },
    };

    await Storyteller.findByIdAndUpdate(
      storyteller._id,
      newUserStorytellerData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(201).json({
      success: true,
      tale,
    });
});

// Get All Tale Admin(tale)
exports.getAdminTales = catchAsyncErrors(async (req, res, next) => {
  // const tales = await Tale.find();

  const resultPerPage = 8;

  const apiFeature = new ApiFeatures(
    Tale.find().populate("comments storyteller"),
    req.query
  )
    .search()
    .filter()
    .pagination(resultPerPage);
  const tales = await apiFeature.query;

  res.status(200).json({
    success: true,
    tales,
  });
});

// Get Tale Details
exports.getTaleDetails = catchAsyncErrors(async (req, res, next) => {
  const tale = await Tale.findById(req.params.id).populate(
    "comments storyteller"
  );

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  res.status(200).json({
    success: true,
    tale,
  });
});

// Get Tale Details
exports.getAllTales = catchAsyncErrors(async (req, res, next) => {
  const tale = await Tale.find({ storyteller: req.params.id }).populate(
    "comments storyteller"
  );

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  res.status(200).json({
    success: true,
    tale,
  });
});

// Update Product -- Admin(tale)

exports.updateTale = catchAsyncErrors(async (req, res, next) => {
  let tale = await Tale.findById(req.params.id);

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  tale = await Tale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    tale,
  });
});

// Update Like

exports.updateTaleLike = catchAsyncErrors(async (req, res, next) => {
  let tale = await Tale.findById(req.params.id);

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  let datas = tale.userLikes;
  let data = datas.find((element) => element == req.user.id);

  if (data) {
    // Delete likeUser to userLikes
    let userLikesData = {
      $pull: {
        userLikes: req.user.id,
      },
      likeCount: tale.likeCount - 1,
    };

    let returnData = await Tale.findByIdAndUpdate(
      req.params.id,
      userLikesData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      returnData,
    });
  } else {
    // Add likeUser to userLikes
    let userLikesData = {
      $push: {
        userLikes: req.user.id,
      },
      likeCount: tale.likeCount + 1,
    };

    let returnData = await Tale.findByIdAndUpdate(
      req.params.id,
      userLikesData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      returnData,
    });
  }
});

// Delete Tale

exports.deleteTale = catchAsyncErrors(async (req, res, next) => {
  const tale = await Tale.findById(req.params.id);

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  await tale.remove();

  res.status(200).json({
    success: true,
    message: "Tale Delete Successfully",
  });
});

// Delete Tale

exports.test = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Tale Delete Successfully",
  });
});
