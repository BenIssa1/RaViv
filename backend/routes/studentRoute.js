/** @format */

const express = require("express");

const { registerStudent } = require("../controllers/studentController");
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

module.exports = router;
