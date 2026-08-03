const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDashboard,
    getRecruiterJobs,
    getApplicants,
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

router.get("/jobs/:jobId", getSingleJob);

// Update a Job
router.put("/jobs/:jobId", updateJob);

// Delete a Job
router.delete("/jobs/:jobId", deleteJob);

router.put("/jobs/:jobId", updateJob);

// Applicants for a specific Job
router.get("/jobs/:jobId/applicants", getApplicants);

module.exports = router;
