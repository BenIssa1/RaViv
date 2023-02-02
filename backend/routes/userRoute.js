/** @format */

const express = require("express");

const AWS = require("aws-sdk");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const s3Client = new AWS.S3({
  accessKeyId: "AKIA6AQ6CF7BCNGC2RXA",
  secretAccessKey: "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",
});

const uploadParams = {
  Bucket: "racine-vivante",
  Key: "", // pass key
  Body: null, // pass file body
  acl: "public-read ",
};

const {
  registerUser,
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
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register User
router.route("/register").post(registerUser);
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
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router
  .route("/admin/conteurs")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllConteur);
// Get Single User / Update Single User / Delete Single User
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.post("/api/file/upload", upload.single("file"), (req, res) => {
  const params = uploadParams;

  uploadParams.Key = req.file.originalname;
  uploadParams.Body = req.file.buffer;

  s3Client.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error -> " + err });
    }
    res.json({
      message: "File uploaded successfully",
      filename: Date.now().toString(),
      location: data.Location,
    });
  });
});

module.exports = router;
