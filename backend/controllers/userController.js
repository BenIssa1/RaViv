/** @format */

const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail");
const ApiFeatures = require("../utils/apifeatures");
const crypto = require("crypto");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this sample id",
      url: "profileurl",
    },
  });

  sendToken(user, 201, res);
});

// Login UserName
exports.loginUserName = catchAsyncErrors(async (req, res, next) => {
  const { name, password } = req.body;

  // checking if user has given password and email both

  if (!name || !password) {
    return next(new ErrorHander("Veuillez entrer votre nom et votre mot de passe", 400));
  }

  const user = await User.findOne({ name }).select("+password");

  if (!user) {
    return next(new ErrorHander("Nom ou mot de passe invalide", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Email ou mot de passe invalide", 401));
  }

  sendToken(user, 200, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Veuillez entrer votre e-mail et votre mot de passe", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Email ou mot de passe invalide", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Email ou mot de passe invalide", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Déconnecté",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("Utilisateur non trouvé", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Votre jeton de réinitialisation de mot de passe est :- \n\n ${resetPasswordUrl} \n\nSi vous n'avez pas demandé cet e-mail, veuillez l'ignorer.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Récupération de mot de passe`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email envoyé à ${user.email} avec succès`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Le jeton de réinitialisation du mot de passe n’est pas valide ou a expiré",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Le mot de passe n'est pas un mot de passe", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Ancien mot de passe est incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("le mot de passe ne correspond pas", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    avatar: {
      public_id: 'Id',
      url: req.body.urlImage
    }
  };

  console.log(newUserData)

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
 /*  const users = await User.find({ role: "user" });
 */
  const resultPerPage = 8;

  const apiFeature = new ApiFeatures(
    User.find({ role: "user" }),
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

// Get all conteurs(admin)
exports.getAllConteur = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ role: "conteur" });

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`L'utilisateur n'existe pas avec son identifiant: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    role: "conteur",
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`L'utilisateur n'existe pas avec son identifiant: ${req.params.id}`, 400)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Utilisateur supprimé avec succès",
  });
});


// Get all conteurs(admin)
exports.getAdminCounts = catchAsyncErrors(async (req, res, next) => {
  const usersCount = await User.find({role: 'user'}).count();
  const ConteurCount = await User.find({role: 'conteur'}).count();
  const ParentCount = await User.find({role: 'parent'}).count();
  const StudentCount = await User.find({role: 'student'}).count();

  res.status(200).json({
    userCount: usersCount,
    ConteurCount: ConteurCount,
    ParentCount: ParentCount,
    StudentCount: StudentCount,
  });
});