const Student = require("../models/Student");

const createStudentProfile = async (req, res) => {
    try {

        const {
            college,
            branch,
            cgpa,
            skills,
            resumeUrl,
        } = req.body;

        const student = await Student.create({
            user: req.user.id,
            college,
            branch,
            cgpa,
            skills,
            resumeUrl,
        });

        res.status(201).json({
            message: "Student Profile Created",
            student,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
const getStudentProfile = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id,
        }).populate("user", "name email role");

        if (!student) {
            return res.status(404).json({
                message: "Profile not found",
            });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
module.exports = {
    createStudentProfile,
    getStudentProfile,
};