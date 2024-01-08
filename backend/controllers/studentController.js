/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Parent = require("../models/parentModel");
const Student = require("../models/studentModel");
const sendToken = require("../utils/jwtTokens");

// Register a Parent
exports.registerStudent = catchAsyncErrors(async (req, res, next) => {
  const { firstname, lastname, classroom, establishment, email, password } =
    req.body;

  const user = await User.create({
    name: lastname,
    email: email ? email : lastname + "@gmail.com" ,
    password,
    role: "student",
    avatar: {
      public_id: "this sample id",
      url: 'avatar',
    },
  });

  if (user) {
    const parent = await Parent.findOne({ user: req.user.id });

    if (parent) {
      let student = await Student.create({
        firstname,
        lastname,
        classroom,
        establishment,
        parent: parent._id,
        user: user._id,
      });

      // Add Student to parent
      let newStudentData = {
        $push: {
          students: student._id,
        },
      };

      await Parent.findByIdAndUpdate(parent._id, newStudentData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
        user
      }); 
      /* sendToken(user, 201, res); */
    }
  }
});

// Get User Detail
exports.searchStudent = catchAsyncErrors(async (req, res, next) => {
  // Get students
  const students = await Student.find({ firstname: { $regex: new RegExp(req.params.name, 'i') } }).populate('user parent');

  res.status(200).json({
    success: true,
    students
  });
});

// Get User Detail
exports.getCountStudet = catchAsyncErrors(async (req, res, next) => {
  // Get parent
  const parent = await Parent.findOne({ user: req.user.id });
  const studentCountOfParent = await Student.find({ parent: parent._id }).count();

  res.status(200).json({
    success: true,
    studentCountOfParent,
  });
});