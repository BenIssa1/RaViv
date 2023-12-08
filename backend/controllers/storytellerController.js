/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Storyteller = require("../models/storytellerModel");
const User = require("../models/userModel");
const ApiFeatures = require("../utils/apifeatures");

// Register a Storyteller
exports.registerStoryteller = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const storyteller = await Storyteller.create(req.body);

  res.status(201).json({
    success: true,
    storyteller,
  });
});

// update User Role -- Admin And update storyteller isVerified
exports.updateUserRoleAndStorytellerIsVerified = catchAsyncErrors(
  async (req, res, next) => {
    const newUserData = {
      role: "conteur",
    };

    const newStorytellerData = {
      isVerified: true,
    };

    let storytellerResponse = await Storyteller.findByIdAndUpdate(
      req.params.id,
      newStorytellerData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    await User.findByIdAndUpdate(storytellerResponse.user, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }
);

// Get all storytellerAsked
exports.getAllStorytellerAsked = catchAsyncErrors(async (req, res, next) => {
  /* const users = await Storyteller.find({ isVerified: false }); */

  const resultPerPage = 8;

  const apiFeature = new ApiFeatures(
    Storyteller.find({ isVerified: false }),
    req.query
  )
    .search()
    .filter()
    .pagination(resultPerPage);
  const users = await apiFeature.query;

  res.status(200).json({
    success: true,
    users,
  });
});

// Get all storyteller
exports.getAllStoryteller = catchAsyncErrors(async (req, res, next) => {
  /* const users = await Storyteller.find({ isVerified: true }).populate("user"); */

  const resultPerPage = 8;

  const apiFeature = new ApiFeatures(
    Storyteller.find({ isVerified: true }).populate("user"),
    req.query
  )
    .search()
    .filter()
    .pagination(resultPerPage);
  const users = await apiFeature.query;

  res.status(200).json({
    success: true,
    users,
  });
});

// Get all Tales to storyteller
exports.getAllStorytellerTales = catchAsyncErrors(async (req, res, next) => {
  const storyteller = await Storyteller.findOne({ user: req.user.id }).populate(
    "tales"
  );

  if (!storyteller) {
    return next(new ErrorHander("Storyteller not found", 404));
  }

  res.status(200).json({
    success: true,
    tales: storyteller.tales,
  });
});

// Update Storyteller

exports.updateStoryteller = catchAsyncErrors(async (req, res, next) => {
  let storyteller = await Storyteller.findById(req.params.id);

  if (!storyteller) {
    return next(new ErrorHander("Storyteller not found", 404));
  }

  storyteller = await Storyteller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    storyteller,
  });
});

exports.getStorytellerDetails = catchAsyncErrors(async (req, res, next) => {
  let storyteller = await Storyteller.findById(req.params.id).populate({
    path: "tales",
  });

  if (!storyteller) {
    return next(new ErrorHander("Storyteller not found", 404));
  }

  res.status(200).json({
    success: true,
    storyteller,
  });
});
