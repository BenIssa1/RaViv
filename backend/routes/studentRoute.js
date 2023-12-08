/** @format */

const express = require("express");

const { registerStudent, getCountStudet, searchStudent } = require("../controllers/studentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register Storyteller
router
  .route("/student/register")
  .post(
    isAuthenticatedUser,
    authorizeRoles("parent", "teacher"),
    registerStudent
  );

router
  .route("/student/parent/count")
  .get(isAuthenticatedUser, authorizeRoles("parent"), getCountStudet);

router
  .route("/search/students/:name")
  .get(searchStudent);

module.exports = router;
