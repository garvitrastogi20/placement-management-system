const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboard,
    getRecruiterJobs,
    getApplicants,
} = require("../controllers/recruiterController");

// Protect all recruiter routes
router.use(protect);
router.use(authorizeRoles("recruiter"));

// Dashboard
router.get("/dashboard", getDashboard);

// Recruiter's Jobs
router.get("/jobs", getRecruiterJobs);

// Applicants for a specific job
router.get("/jobs/:jobId/applicants", getApplicants);

module.exports = router;