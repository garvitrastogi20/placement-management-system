const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getRecruiterAnalytics,
} = require("../controllers/analyticsController");

router.get(
  "/recruiter",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterAnalytics
);

module.exports = router;