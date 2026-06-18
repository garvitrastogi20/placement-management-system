const express = require("express");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createJob,
    applyJob,
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

module.exports = router;