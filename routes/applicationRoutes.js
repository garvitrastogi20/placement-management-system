const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    updateApplicationStatus,
} = require("../controllers/applicationController");

router.patch(
    "/:applicationId/status",
    protect,
    authorizeRoles("recruiter"),
    updateApplicationStatus
);

router.get("/test", (req, res) => {
    res.send("Application Route Working");
});

module.exports = router;