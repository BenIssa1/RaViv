/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const HistoricalStudent = require("../models/historicalStudentModel");
const Student = require("../models/studentModel");
const Tale = require("../models/taleModel");

// Register a history student
exports.registerHistoryStudent = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const student = await Student.findOne({ user: req.user.id });

  if (!student) {
    return next(new ErrorHander("Parent not found", 404));
  }

  const historyStudent = await HistoricalStudent.create({
    student: student._id,
    tale: req.body.taleId,
    percentage: 50,
  });

  res.status(201).json({
    success: true,
    historyStudent,
  });
});

// Register a history student
exports.updateHistoryStudentNoteAndPercent = catchAsyncErrors(
  async (req, res, next) => {
    const historyStudent = await HistoricalStudent.findOne({
      tale: req.body.taleId,
    });
    const tale = await Tale.findOne({ _id: req.body.taleId });

    if (!historyStudent) {
      return next(new ErrorHander("History Student not found", 404));
    }

    if (!tale) {
      return next(new ErrorHander("Tale not found", 404));
    }

    let array1 = tale.questions;
    let array2 = req.body.questions;
    let count = 0;

    for (let index = 0; index < array1.length; index++) {
      const element1 = array1[index];
      const element2 = array2[index];

      if (element1.response === element2.response) {
        count += 20;
      }
    }

    let moyenne = count / 3;

    let historyStudentUpdate = await HistoricalStudent.findByIdAndUpdate(
      historyStudent._id,
      {
        note: moyenne,
        percentage: historyStudent.percentage + 25,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      historyStudentUpdate,
    });
  }
);
