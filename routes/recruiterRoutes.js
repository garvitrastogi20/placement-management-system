const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    getRecruiterJobs,
} = require("../controllers/recruiterController");

router.get(
    "/jobs",
    protect,
    authorizeRoles("recruiter"),
    getRecruiterJobs
);

module.exports = router;