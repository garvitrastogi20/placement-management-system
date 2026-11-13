const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getDashboard,
  getRecruiterJobs,
  getApplicants,
  getAllApplicants,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/recruiterController");

// Protect all recruiter routes
router.use(protect);
router.use(authorizeRoles("recruiter"));

// Dashboard
router.get("/dashboard", getDashboard);

// Recruiter's Jobs
router.get("/jobs", getRecruiterJobs);

// All applicants for this recruiter
router.get("/applicants", getAllApplicants);

// Applicants for a specific job
router.get("/jobs/:jobId/applicants", getApplicants);

// Single job
router.get("/jobs/:jobId", getSingleJob);

// Update job
router.put("/jobs/:jobId", updateJob);

// Delete job
router.delete("/jobs/:jobId", deleteJob);

module.exports = router;
