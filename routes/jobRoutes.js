const express = require("express");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createJob,
    applyJob,
    getApplicants,
    getAllJobs,
    getMyApplications,
} = require("../controllers/jobController");

router.post(
    "/",
    protect,
    authorizeRoles("recruiter"),
    createJob
);

router.post(
    "/:jobId/apply",
    protect,
    authorizeRoles("student"),
    applyJob
);
router.get(
    "/",
    protect,
    getAllJobs
);

router.get(
    "/my-applications",
    protect,
    authorizeRoles("student"),
    getMyApplications
);

router.get(
    "/:jobId/applicants",
    protect,
    authorizeRoles("recruiter"),
    getApplicants
);

module.exports = router;