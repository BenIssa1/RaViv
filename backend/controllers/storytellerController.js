/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Storyteller = require("../models/storytellerModel");
const User = require("../models/userModel");

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
  const users = await Storyteller.find({ isVerified: false });

  res.status(200).json({
    success: true,
    users,
  });
});

// Get all storyteller
exports.getAllStoryteller = catchAsyncErrors(async (req, res, next) => {
  const users = await Storyteller.find({ isVerified: true });

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
