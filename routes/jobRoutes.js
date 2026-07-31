const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles =
    require("../middleware/roleMiddleware");


    
const {
  createJob,
  applyJob,
  getAllJobs,
  getMyApplications,
  getJobById
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
router.get("/", protect, getAllJobs);

// Get student's applications
router.get(
    "/my-applications",
    protect,
    authorizeRoles("student"),
    getMyApplications
);


router.get(
    "/:jobId",
    protect,
    getJobById
);


module.exports = router;