const Student = require("../models/Student");
const Application = require("../models/Application");
const cloudinary = require("../config/cloudinary");

// Create Student Profile
const createStudentProfile = async (req, res) => {
    try {

        const {
            college,
            branch,
            cgpa,
            skills,
        } = req.body;

        const existingProfile =
            await Student.findOne({
                user: req.user.id,
            });

        if (existingProfile) {
            return res.status(400).json({
                message: "Profile already exists",
            });
        }

        const student =
            await Student.create({
                user: req.user.id,
                college,
                branch,
                cgpa,
                skills,
            });

        res.status(201).json({
            message: "Student profile created successfully",
            student,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Student Profile
const getStudentProfile = async (req, res) => {
    try {

        const student =
            await Student.findOne({
                user: req.user.id,
            });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        res.status(200).json(student);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// Student Dashboard
const getStudentDashboard = async (req, res) => {
    try {

        const applications =
            await Application.find({
                student: req.user.id,
            });

        const dashboard = {
            totalApplications:
                applications.length,

            applied:
                applications.filter(
                    app =>
                        app.status === "Applied"
                ).length,

            shortlisted:
                applications.filter(
                    app =>
                        app.status === "Shortlisted"
                ).length,

            selected:
                applications.filter(
                    app =>
                        app.status === "Selected"
                ).length,

            rejected:
                applications.filter(
                    app =>
                        app.status === "Rejected"
                ).length,
        };

        res.status(200).json(
            dashboard
        );

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// Upload Resume
const uploadResume = async (req, res) => {
    try {

        console.log("FILE:", req.file);
        console.log("Logged In User:", req.user);

        const result =
            await cloudinary.uploader.upload(
                req.file.path,
                {
                    resource_type: "auto",
                    folder: "placement-resumes",
                }
            );

        const student =
            await Student.findOne({
                user: req.user.id,
            });

        console.log(
            "Student Found:",
            student
        );

        if (!student) {
            return res.status(404).json({
                message:
                    "Student profile not found",
            });
        }

        student.resumeUrl =
            result.secure_url;

        await student.save();

        res.status(200).json({
            message:
                "Resume uploaded successfully",
            resumeUrl:
                result.secure_url,
        });

    } catch (error) {

        console.log(
            "UPLOAD ERROR:",
            error
        );

        res.status(500).json({
            message:
                error.message,
        });
    }
};

module.exports = {
    createStudentProfile,
    getStudentProfile,
    getStudentDashboard,
    uploadResume,
};