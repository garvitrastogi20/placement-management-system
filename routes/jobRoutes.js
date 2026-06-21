const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    createJob,
    applyJob,
    getApplicants,
    getAllJobs,
    getMyApplications,
} = require("../controllers/jobController");

// Recruiter creates a job
router.post(
    "/",
    protect,
    authorizeRoles("recruiter"),
    createJob
);

// Student applies for a job
router.post(
    "/:jobId/apply",
    protect,
    authorizeRoles("student"),
    applyJob
);

// Get all jobs
router.get("/", getAllJobs);

// Get student's applications
router.get(
    "/my-applications",
    protect,
    authorizeRoles("student"),
    getMyApplications
);

// Recruiter views applicants for a job
router.get(
    "/:jobId/applicants",
    protect,
    authorizeRoles("recruiter"),
    getApplicants
);

module.exports = router;