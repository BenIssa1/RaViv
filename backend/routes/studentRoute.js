/** @format */

const express = require("express");

const { registerStudent, getCountStudet } = require("../controllers/studentController");
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

module.exports = router;
