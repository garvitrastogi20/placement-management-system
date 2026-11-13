const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { aiRateLimiter } = require("../middleware/rateLimitMiddleware");

const {
  generateInterviewPreparation,
  getInterviewPreparationHistory,
  getInterviewPreparationById,
} = require("../controllers/aiInterviewController");

const {
  analyzeResumeForJob,
  getResumeAnalysisHistory,
  getResumeAnalysisById,
} = require("../controllers/aiResumeController");

const {
  startMockInterview,
  submitMockInterviewAnswer,
  getMockInterview,
} = require("../controllers/aiMockInterviewController");

// Analyze resume and save the report
router.post(
  "/resume-analysis",
  protect,
  authorizeRoles("student"),
  aiRateLimiter,
  analyzeResumeForJob,
);

// Get the logged-in student's reports
router.get(
  "/resume-analysis/history",
  protect,
  authorizeRoles("student"),
  getResumeAnalysisHistory,
);

// Get one saved report
router.get(
  "/resume-analysis/history/:analysisId",
  protect,
  authorizeRoles("student"),
  getResumeAnalysisById,
);

router.post(
  "/interview-preparation",
  protect,
  authorizeRoles("student"),
  aiRateLimiter,
  generateInterviewPreparation,
);

router.get(
  "/interview-preparation/history",
  protect,
  authorizeRoles("student"),
  getInterviewPreparationHistory,
);

router.get(
  "/interview-preparation/history/:sessionId",
  protect,
  authorizeRoles("student"),
  getInterviewPreparationById,
);

// Start a new mock interview
router.post(
  "/mock-interview/start",
  protect,
  authorizeRoles("student"),
  aiRateLimiter,
  startMockInterview,
);

// Submit an answer and receive AI feedback
router.post(
  "/mock-interview/:interviewId/answer",
  protect,
  authorizeRoles("student"),
  aiRateLimiter,
  submitMockInterviewAnswer,
);

// Get interview progress or completed report
router.get(
  "/mock-interview/:interviewId",
  protect,
  authorizeRoles("student"),
  getMockInterview,
);

module.exports = router;
