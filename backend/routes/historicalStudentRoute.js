/** @format */

const express = require("express");

const {
  registerHistoryStudent,
  updateHistoryStudentNoteAndPercent,
  getAllNote,
} = require("../controllers/historicalStudentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register a history student
router
  .route("/history-user/register")
  .post(isAuthenticatedUser, registerHistoryStudent);

// Update a history student
router.route("/history-student/update").put(
  isAuthenticatedUser,
  // authorizeRoles("student"),
  updateHistoryStudentNoteAndPercent
);

// Get All Notes
router.route("/history-user/notes").get(isAuthenticatedUser, getAllNote);

module.exports = router;
