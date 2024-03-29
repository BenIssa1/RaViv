/** @format */

const express = require("express");

const {
  registerUser,
  loginUserName,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getAllConteur,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getAdminCounts
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register User
router.route("/register").post(registerUser);
// LOgin UserName
router.route("/login-username").post(loginUserName);
// LOgin User
router.route("/login").post(loginUser);
// Logout User
router.route("/logout").get(logout);
// Forgot Password
router.route("/password/forgot").post(forgotPassword);
// Reset Password
router.route("/password/reset/:token").put(resetPassword);
// User credentials
router.route("/me").get(isAuthenticatedUser, getUserDetails);
// Upadate / Change Password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
// Update / User Profile
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
// Get All Users
router
  .route("/admin/users")
  .get( getAllUser);

router
  .route("/admin/counts")
  .get( getAdminCounts);
// Get Single User / Update Single User / Delete Single User
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
