/** @format */

const express = require("express");

const {
  getAllParent,
  registerParent,
  getAllParentStudent,
  getAllParentAsked,
  updateUserRoleAndParentIsVerified,
  getStudentDetails,
  updateStudent,
  updateParent,
  deleteStudent,
  getAllStudentsHistoriques,
  getAllStudentHistoriques
} = require("../controllers/parentController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Register Storyteller
router.route("/parent/register").post(registerParent);

router
  .route("/parent/update-role/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateUserRoleAndParentIsVerified
  );

router
  .route("/parent/students")
  .get(
    isAuthenticatedUser,
    authorizeRoles("parent", "teacher"),
    getAllParentStudent
  );

router
  .route("/admin/parent")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllParent);

router
  .route("/admin/parent-asked")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllParentAsked);

// Get Single User / Update Single User / Delete Single User
router
  .route("/parent/student/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles("parent", "teacher"),
    getStudentDetails
  )
  .put(isAuthenticatedUser, authorizeRoles("parent", "teacher"), updateStudent)
  .delete(
    isAuthenticatedUser,
    authorizeRoles("parent", "teacher"),
    deleteStudent
  );

router
  .route("/parent/:id")
  .put(isAuthenticatedUser, authorizeRoles("parent", "teacher"), updateParent);

router
  .route("/parent/students/historiques")
  .get(isAuthenticatedUser, authorizeRoles("parent"), getAllStudentsHistoriques);

router
  .route("/parent/student/:studentId/historiques")
  .get(isAuthenticatedUser, authorizeRoles("parent"), getAllStudentHistoriques);

module.exports = router;
