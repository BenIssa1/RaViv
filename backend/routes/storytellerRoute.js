/** @format */

const express = require("express");

const {
  getAllStoryteller,
  registerStoryteller,
  getAllStorytellerTales,
  getAllStorytellerAsked,
  updateUserRoleAndStorytellerIsVerified,
} = require("../controllers/storytellerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register Storyteller
router
  .route("/storyteller/register")
  .post(isAuthenticatedUser, registerStoryteller);

router
  .route("/storyteller/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateUserRoleAndStorytellerIsVerified
  );

router
  .route("/storyteller/tales")
  .get(isAuthenticatedUser, authorizeRoles("conteur"), getAllStorytellerTales);

router
  .route("/admin/storyteller")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllStoryteller);

router
  .route("/admin/storyteller-asked")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllStorytellerAsked);

module.exports = router;
