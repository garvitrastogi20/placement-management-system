const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createStudentProfile,
    getStudentProfile,
} = require("../controllers/studentController");

router.get(
    "/profile",
    protect,
    getStudentProfile
);

router.post(
    "/profile",
    protect,
    createStudentProfile
);

module.exports = router;