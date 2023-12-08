/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Parent = require("../models/parentModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const sendToken = require("../utils/jwtTokens");
const HistoricalStudent = require("../models/historicalStudentModel");

// Register a Parent
exports.registerParent = catchAsyncErrors(async (req, res, next) => {
  const {
    firstname,
    lastname,
    address,
    phone,
    email,
    password,
    type,
    establishment,
    country,
    city,
  } = req.body;

  let userData = {
    name: lastname,
    email,
    password,
    avatar: {
      public_id: "this sample id",
      url: "profileurl",
    },
  };

  let datas = {
    firstname,
    lastname,
    address,
    phone,
    type,
  };

  if (type == "parent") {
    userData.role = "parent";
  } else {
    userData.role = "teacher";
    datas.establishment = establishment;
    datas.country = country;
    datas.city = city;
  }

  const user = await User.create(userData);
  datas.user = user._id;

  if (user) {
    await Parent.create(datas);

    sendToken(user, 201, res);
  }
});

// update User Role -- Admin And update parent isVerified
exports.updateUserRoleAndParentIsVerified = catchAsyncErrors(
  async (req, res, next) => {
    const newUserData = {
      role: "parent",
    };

    const newParentData = {
      isVerified: true,
    };

    let parentResponse = await Parent.findByIdAndUpdate(
      req.params.id,
      newParentData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    await User.findByIdAndUpdate(parentResponse.user, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }
);

// Get all ParentAsked
exports.getAllParentAsked = catchAsyncErrors(async (req, res, next) => {
  const parents = await Parent.find({ isVerified: false });

  res.status(200).json({
    success: true,
    parents,
  });
});

// Get all Parent
exports.getAllParent = catchAsyncErrors(async (req, res, next) => {
  const parents = await Parent.find({ isVerified: true });

  res.status(200).json({
    success: true,
    parents,
  });
});

// Get all Students to Parent
exports.getAllParentStudent = catchAsyncErrors(async (req, res, next) => {
  const parent = await Parent.findOne({ user: req.user.id }).populate(
    "students"
  );

  if (!parent) {
    return next(new ErrorHander("Parent not found", 404));
  }

  res.status(200).json({
    success: true,
    students: parent.students,
  });
});

// Get Tale Details
exports.getStudentDetails = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate('user parent');

  if (!student) {
    return next(new ErrorHander("Student not found", 404));
  }

  res.status(200).json({
    success: true,
    student,
  });
});

// Update Student -- Parent

exports.updateStudent = catchAsyncErrors(async (req, res, next) => {
  let student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorHander("Student not found", 404));
  }

  student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    student,
  });
});

// Update Parent

exports.updateParent = catchAsyncErrors(async (req, res, next) => {
  let parent = await Parent.findById(req.params.id);

  if (!parent) {
    return next(new ErrorHander("Parent not found", 404));
  }

  parent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    parent,
  });
});

// Delete Student

exports.deleteStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorHander("Student not found", 404));
  }

  const parent = await Parent.findOne({ user: req.user.id });

  // Add Student to parent
  let newStudentData = {
    $pull: {
      students: student._id,
    },
  };

  await Parent.findByIdAndUpdate(parent._id, newStudentData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await student.remove();

  res.status(200).json({
    success: true,
    message: "Student Delete Successfully",
  });
});

// Get all Parent
exports.getAllStudentsHistoriques = catchAsyncErrors(async (req, res, next) => {
  const parent = await Parent.findOne({ user: req.user.id }).populate('students');
  const studentsIds = parent.students;
  const historicalStudents = []

  for (let index = 0; index < studentsIds.length; index++) {
    const element = studentsIds[index];

    let historicalStudentAll = await HistoricalStudent.find({ user: element.user }).populate("user");

    for (let index2 = 0; index2 < historicalStudentAll.length; index2++) {
      const element = historicalStudentAll[index2];

      if (element)
        historicalStudents.push(element)
    }

  }

  res.status(200).json({
    success: true,
    /* studentsIds, */
    historicalStudents
  });
});

// Get all Parent
exports.getAllStudentHistoriques = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.studentId);

  let StudentHistoricalAll = await HistoricalStudent.find({ user: student.user }).populate("tale");

  res.status(200).json({
    success: true,
    StudentHistoricalAll
  });
});