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

        const existingProfile = await Student.findOne({
            user: req.user.id,
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Profile already exists",
            });
        }

        const student = await Student.create({
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
        const student = await Student.findOne({
            user: req.user.id,
        }).populate("user", "name email role");

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
        const student = await Student.findOne({
            user: req.user.id,
        }).populate("user", "name email");

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        const applications = await Application.find({
            student: req.user.id,
        });

        const dashboard = {
            user: student.user,

            profile: {
                college: student.college,
                branch: student.branch,
                cgpa: student.cgpa,
                skills: student.skills,
                resumeUrl: student.resumeUrl,
            },

            stats: {
                totalApplications: applications.length,
                shortlisted: applications.filter(
                    (app) => app.status === "Shortlisted"
                ).length,
                selected: applications.filter(
                    (app) => app.status === "Selected"
                ).length,
                rejected: applications.filter(
                    (app) => app.status === "Rejected"
                ).length,
                resumeUploaded: !!student.resumeUrl,
                totalSkills: student.skills.length,
            },
        };

        res.status(200).json(dashboard);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Upload Resume
const uploadResume = async (req, res) => {
    try {
        console.log("\n========== RESUME UPLOAD ==========");
        console.log("Logged In User:", req.user);

        console.log("\nREQ.FILE:");
        console.log(req.file);

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "placement-resumes",
        });

        console.log("\n========== CLOUDINARY RESULT ==========");
        console.log(result);

        const student = await Student.findOne({
            user: req.user.id,
        });

        console.log("\nStudent Found:");
        console.log(student);

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        student.resumeUrl = result.secure_url;

        await student.save();

        console.log("\nResume URL Saved:");
        console.log(student.resumeUrl);

        console.log("\n========== UPLOAD SUCCESS ==========\n");

        res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: result.secure_url,
        });
    } catch (error) {
        console.log("\n========== UPLOAD ERROR ==========");
        console.log(error);
        console.log("==================================\n");

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createStudentProfile,
    getStudentProfile,
    getStudentDashboard,
    uploadResume,
};