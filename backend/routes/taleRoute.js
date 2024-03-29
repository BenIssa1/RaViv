/** @format */

const express = require("express");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  createTale,
  getAdminTales,
  getTaleDetails,
  updateTale,
  deleteTale,
  updateTaleLike,
  test,
  getAllTales,
} = require("../controllers/taleController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register User
router.post(
  "/admin/tale/new",
  upload.single("file"),
  isAuthenticatedUser,
  authorizeRoles("conteur"),
  createTale
);

// Get All Users
router.route("/admin/tales").get( getAdminTales);
// .get(isAuthenticatedUser, authorizeRoles("conteur"), getAdminTales);

router.route("/admin/test").get(isAuthenticatedUser, test);

// Get Single User / Update Single User / Delete Single User
router
  .route("/admin/tale/:id")
  .get( getTaleDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateTale)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteTale);

router.route("/storyteller/tales/:id").get(isAuthenticatedUser, getAllTales);

router.route("/tale-like/:id").put(isAuthenticatedUser, updateTaleLike);

module.exports = router;
