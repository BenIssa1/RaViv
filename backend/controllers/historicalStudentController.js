/** @format */

const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHander = require("../utils/errorhander");
const HistoricalStudent = require("../models/historicalStudentModel");
// const Student = require("../models/studentModel");
const Tale = require("../models/taleModel");
const sendEmail = require("../utils/sendEmail");
const Student = require("../models/studentModel");

// Register a history student
exports.registerHistoryStudent = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const getHistotrique = await HistoricalStudent.findOne({ user: req.user.id });

  if (getHistotrique) {
    return next(new ErrorHander("Vous avez déjà répondu aux questions.", 404));
  }

  let email = req.user.email;

  if (req.user.role === 'student') {
    const student = await Student.findOne({ user: req.user.id }).populate({
      path: 'parent',
      populate: { path: 'user' }
    });

    email = student.parent.user.email;

  }

  const tale = await Tale.findOne({ _id: req.body.taleId }).populate({
    path: 'storyteller',
    populate: { path: 'user' }
  });

  let emailStoryteller = tale.storyteller.user.email;

  if (!tale) {
    return next(new ErrorHander("Le récit n'existe pas.", 404));
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

    if (element1 == element2) {
      count1 += 10;
    } else {
      arrayError.push({
        question: tale.questions[0].question,
        response: taleResponse1[index].response,
      });
    }

    if (element3 == element4) {
      count2 += 10;
    } else {
      arrayError.push({
        question: tale.questions[1].question,
        response: taleResponse1[index].response,
      });
    }

    if (element5 == element6) {
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


  const message = `Lecture d'un récit.`;

  try {
    await sendEmail({
      email: email,
      subject: `Lecture d'un récit de votre enfant ${req.user.name}`,
      message,
    });

    await sendEmail({
      email: emailStoryteller,
      subject: `Lecture d'un récit`,
      message: "Une personne a regardé votre récit",
    });

  } catch (error) {

    return next(new ErrorHander(error.message, 500));
  }

  res.status(201).json({
    success: true,
    historyStudent,
    arrayError,
  });

});

// Register a history student
exports.updateHistoryStudentNoteAndPercent = catchAsyncErrors(
  async (req, res, next) => {
    req.body.user = req.user.id;

    const tale = await Tale.findOne({ _id: req.body.taleId }).populate({
      path: 'storyteller',
      populate: { path: 'user' }
    });
  
    let emailStoryteller = tale.storyteller.user.email;
  
    if (!tale) {
      return next(new ErrorHander("Le récit n'existe pas", 404));
    }

    const histotrique = await HistoricalStudent.findOne({ user: req.user.id });

    if (!histotrique) {
      return next(new ErrorHander("Historique du récit n'existe pas", 404));
    }

    let email = req.user.email;

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id }).populate({
        path: 'parent',
        populate: { path: 'user' }
      });

      email = student.parent.user.email;

    }

    histotrique.resolution = req.body.resolution;
    histotrique.percentage += 25;

    await histotrique.save();


    try {
      await sendEmail({
        email: email,
        subject: `Resolution d'un conte`,
        message: `Voici la résolution de votre enfant ${req.user.name}  : ${req.body.resolution} `,
      });

      await sendEmail({
        email: emailStoryteller,
        subject: `Resolution d'un conte`,
        message: `Voici la résolution d'un utilisateur : ${req.body.resolution}`,
      });
  
    } catch (error) {
  
      return next(new ErrorHander(error.message, 500));
    }

    res.status(200).json({
      success: true,
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
