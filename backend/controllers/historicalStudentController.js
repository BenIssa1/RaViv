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
  let userRole = req.user.role;
  let userEmail = req.user.email;

  const getHistotrique = await HistoricalStudent.findOne({ user: req.user.id, tale: req.body.taleId });

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

  res.status(201).json({
    success: true,
    historyStudent,
    arrayError,
  });

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;


  const message = `
  Le conte ${tale.title} vient d'être lu par ${req.user.name}`

  try {
    if (userRole === 'student') {
      await sendEmail({
        email: email,
        subject: `Lecture d'un récit.`,
        message: `Nous espérons que vous appréciez votre expérience sur Raviv, et nous sommes ravis de vous informer que votre enfant ${req.user.name} a récemment regardé/écouté/lu le conte suivant :
Titre du Film : ${tale.title}
Date de Lecture : ${formattedToday}
Nous espérons que ce conte a répondu à ses attentes et que vous avez apprécié chaque moment. Chez RaViv, notre objectif est de vous offrir une expérience  exceptionnelle, et votre satisfaction est notre priorité.
        ` ,
      });
    } else {
      await sendEmail({
        email: email,
        subject: `Lecture d'un récit.`,
        message: `Nous espérons que vous appréciez votre expérience sur Raviv, et nous sommes ravis de vous informer que vous venez récemment regardé/écouté/lu le conte suivant :
Titre du Film : ${tale.title}
Date de Lecture : ${formattedToday}
Nous espérons que ce conte a répondu à ses attentes et que vous avez apprécié chaque moment. Chez RaViv, notre objectif est de vous offrir une expérience  exceptionnelle, et votre satisfaction est notre priorité.
        `
      });
    }


    await sendEmail({
      email: emailStoryteller,
      subject: `Lecture d'un récit`,
      message: message,
    });

  } catch (error) {

    return next(new ErrorHander(error.message, 500));
  }



});

// Register a history student
exports.updateHistoryStudentNoteAndPercent = catchAsyncErrors(
  async (req, res, next) => {
    req.body.user = req.user.id;
    let userRole = req.user.role;
    let userEmail = req.user.email;

    const tale = await Tale.findOne({ _id: req.body.taleId }).populate({
      path: 'storyteller',
      populate: { path: 'user' }
    });

    let emailStoryteller = tale.storyteller.user.email;

    if (!tale) {
      return next(new ErrorHander("Le récit n'existe pas", 404));
    }

    const histotrique = await HistoricalStudent.findOne({ user: req.user.id, tale: req.body.taleId });

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

    res.status(200).json({
      success: true,
    });

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;



    try {
      if (userRole === 'student') {
        await sendEmail({
          email: email,
          subject: `Résolution d'un conte`,
          message: `Votre enfant ${req.user.name} vient de prendre sa résolution qui est : ${req.body.resolution} 
Titre du Film : ${tale.title}
Date de résolution : ${formattedToday}
          `,
        });

        await sendEmail({
          email: userEmail,
          subject: `Résolution d'un conte`,
          message: `Sommes particulièrement reconnaissants que vous ayez pris le temps de prendre une résolution après avoir visionné ce conte. Chez RaViv, nous nous efforçons de créer une communauté où le partage d'expériences et la connexion avec notre contenu sont au cœur de tout ce que nous faisons.
Si vous êtes disposé(e) à partager davantage sur la résolution que vous avez prise, n'hésitez pas à nous le faire savoir. Nous adorons entendre les histoires de nos utilisateurs et découvrir comment notre contenu peut avoir un impact positif.
Merci encore pour votre fidélité et votre soutien continu. Si vous avez des questions, des suggestions ou simplement envie de discuter, notre équipe est toujours à votre disposition.
          `,
        });
      } else {
        await sendEmail({
          email: email,
          subject: `Résolution d'un conte`,
          message: `Sommes particulièrement reconnaissants que vous ayez pris le temps de prendre une résolution après avoir visionné ce conte. Chez RaViv, nous nous efforçons de créer une communauté où le partage d'expériences et la connexion avec notre contenu sont au cœur de tout ce que nous faisons.
Si vous êtes disposé(e) à partager davantage sur la résolution que vous avez prise, n'hésitez pas à nous le faire savoir. Nous adorons entendre les histoires de nos utilisateurs et découvrir comment notre contenu peut avoir un impact positif.
Merci encore pour votre fidélité et votre soutien continu. Si vous avez des questions, des suggestions ou simplement envie de discuter, notre équipe est toujours à votre disposition.
          `,
        });
      }

      await sendEmail({
        email: emailStoryteller,
        subject: `Résolution d'un conte`,
        message: `L'utilisateur ${req.user.name} vient de prendre sa résolution qui est : ${req.body.resolution}
Titre du Film : ${tale.title}
Date de résolution : ${formattedToday}
          `,
      });

    } catch (error) {

      return next(new ErrorHander(error.message, 500));
    }

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
