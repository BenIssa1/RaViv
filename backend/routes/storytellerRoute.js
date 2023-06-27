/** @format */

const express = require("express");

const {
  getAllStoryteller,
  registerStoryteller,
  getAllStorytellerTales,
  getAllStorytellerAsked,
  updateStoryteller,
  getStorytellerDetails,
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
  .get(isAuthenticatedUser, getStorytellerDetails)
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateUserRoleAndStorytellerIsVerified
  );

router
  .route("/storyteller/tales")
  .get(isAuthenticatedUser, authorizeRoles("conteur"), getAllStorytellerTales);

router.route("/list-storyteller").get(isAuthenticatedUser, getAllStoryteller);

router
  .route("/admin/storyteller-asked")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllStorytellerAsked);

router
  .route("/storyteller/update-profile/:id")
  .put(isAuthenticatedUser, authorizeRoles("conteur"), updateStoryteller);

module.exports = router;
