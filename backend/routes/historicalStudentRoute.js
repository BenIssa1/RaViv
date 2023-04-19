/** @format */

const express = require("express");

const {
  registerHistoryStudent,
  updateHistoryStudentNoteAndPercent,
} = require("../controllers/historicalStudentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register a history student
router
  .route("/history-student/register")
  .post(isAuthenticatedUser, authorizeRoles("student"), registerHistoryStudent);

// Update a history student
router
  .route("/history-student/update")
  .put(
    isAuthenticatedUser,
    authorizeRoles("student"),
    updateHistoryStudentNoteAndPercent
  );

module.exports = router;
