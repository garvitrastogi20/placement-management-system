const express = require("express");
const protect = require("../middleware/authMiddleware");
const profileUpload = require("../middleware/profileUploadMiddleware");
const { authRateLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

const {
  test,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
} = require("../controllers/authController");

// ======================================================
// Test
// ======================================================

router.get("/test", test);

// ======================================================
// Profile
// ======================================================

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post(
  "/profile/image",
  protect,
  profileUpload.single("profileImage"),
  uploadProfileImage,
);

router.put("/change-password", protect, authRateLimiter, changePassword);

// ======================================================
// Authentication
// ======================================================

router.post("/register", authRateLimiter, registerUser);

router.post("/login", authRateLimiter, loginUser);

module.exports = router;
