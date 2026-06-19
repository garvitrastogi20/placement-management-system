const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const {
    createStudentProfile,
    getStudentProfile,
    getStudentDashboard,
    uploadResume,
} = require("../controllers/studentController");


router.post(
    "/profile",
    protect,
    authorizeRoles("student"),
    createStudentProfile
);

router.get(
    "/profile",
    protect,
    authorizeRoles("student"),
    getStudentProfile
);

router.get(
    "/dashboard",
    protect,
    authorizeRoles("student"),
    getStudentDashboard
);

router.post(
    "/upload-resume",
    protect,
    authorizeRoles("student"),
    upload.single("resume"),
    uploadResume
);


module.exports = router;