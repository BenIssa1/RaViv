/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const HistoricalStudent = require("../models/historicalStudentModel");
// const Student = require("../models/studentModel");
const Tale = require("../models/taleModel");

// Register a history student
exports.registerHistoryStudent = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const tale = await Tale.findOne({ _id: req.body.taleId });

  if (!tale) {
    return next(new ErrorHander("Tale not found", 404));
  }

  // Response body
  let response1 = req.body.reponse1;
  let response2 = req.body.reponse2;
  let response3 = req.body.reponse3;

  // Response Tale
  let taleResponse1 = tale.questions[0].responses;
  let taleResponse2 = tale.questions[1].responses;
  let taleResponse3 = tale.questions[2].responses;

  // Count
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;

  // tableau d'erreur
  let arrayError = [];

  for (let index = 0; index < response1.length; index++) {
    const element1 = response1[index].result;
    const element2 = taleResponse1[index].result;

    const element3 = response2[index].result;
    const element4 = taleResponse2[index].result;

    const element5 = response3[index].result;
    const element6 = taleResponse3[index].result;

    if (element1 === element2) {
      count1 += 10;
    } else {
      arrayError.push({
        question: tale.questions[0].question,
        response: taleResponse1[index].response,
      });
    }

    if (element3 === element4) {
      count2 += 10;
    } else {
      arrayError.push({
        question: tale.questions[1].question,
        response: taleResponse1[index].response,
      });
    }

    if (element5 === element6) {
      count3 += 10;
    } else {
      arrayError.push({
        question: tale.questions[2].question,
        response: taleResponse2[index].response,
      });
    }
  }

  // Note
  let noteQuestion1 = Math.round(count1 / 3);
  let noteQuestion2 = Math.round(count2 / 3);
  let noteQuestion3 = Math.round(count3 / 3);

  let somme = noteQuestion1 + noteQuestion2 + noteQuestion3;
  let moyenne = Math.round(somme / 3);

  const historyStudent = await HistoricalStudent.create({
    user: req.user.id,
    tale: req.body.taleId,
    percentage: 75,
    note: moyenne,
  });

  res.status(201).json({
    success: true,
    historyStudent,
    arrayError,
  });
});

// Register a history student
exports.updateHistoryStudentNoteAndPercent = catchAsyncErrors(
  async (req, res, next) => {
    const tale = await Tale.findOne({ _id: req.body.taleId });

    if (!tale) {
      return next(new ErrorHander("Tale not found", 404));
    }

    // Response body
    let response1 = req.body.reponse1;
    let response2 = req.body.reponse2;
    let response3 = req.body.reponse3;

    // Response Tale
    let taleResponse1 = tale.questions[0].responses;
    let taleResponse2 = tale.questions[1].responses;
    let taleResponse3 = tale.questions[2].responses;

    // Count
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    // tableau d'erreur
    let arrayError = [];

    for (let index = 0; index < response1.length; index++) {
      const element1 = response1[index].result;
      const element2 = taleResponse1[index].result;

      const element3 = response2[index].result;
      const element4 = taleResponse2[index].result;

      const element5 = response3[index].result;
      const element6 = taleResponse3[index].result;

      if (element1 === element2) {
        count1 += 10;
      } else {
        arrayError.push({
          question: tale.questions[0].question,
          response: taleResponse1[index].response,
        });
      }

      if (element3 === element4) {
        count2 += 10;
      } else {
        arrayError.push({
          question: tale.questions[1].question,
          response: taleResponse1[index].response,
        });
      }

      if (element5 === element6) {
        count3 += 10;
      } else {
        arrayError.push({
          question: tale.questions[2].question,
          response: taleResponse2[index].response,
        });
      }
    }

    // Note
    let noteQuestion1 = Math.round(count1 / 3);
    let noteQuestion2 = Math.round(count2 / 3);
    let noteQuestion3 = Math.round(count3 / 3);

    let somme = noteQuestion1 + noteQuestion2 + noteQuestion3;
    let moyenne = Math.round(somme / 3);

    console.log(moyenne);
    console.log(arrayError);

    res.status(200).json({
      success: true,
      moyenne,
      arrayError,
    });
  }
);

// Get all ParentAsked
exports.getAllNote = catchAsyncErrors(async (req, res, next) => {
  const notes = await HistoricalStudent.find({ user: req.user.id }).populate(
    "tale"
  );

  res.status(200).json({
    success: true,
    notes,
  });
});
