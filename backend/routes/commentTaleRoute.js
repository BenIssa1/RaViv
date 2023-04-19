/** @format */

const express = require("express");

const { createComment } = require("../controllers/commentTaleController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Create Comment
router.route("/comment/create").post(isAuthenticatedUser, createComment);

module.exports = router;
