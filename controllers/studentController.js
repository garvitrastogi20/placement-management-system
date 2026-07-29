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
                resume: student.resume,
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
                resumeUploaded: !!student.resume?.url,
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
        if (!req.file) {
            return res.status(400).json({
                message: "No resume uploaded",
            });
        }

        const student = await Student.findOne({
            user: req.user.id,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        // Delete old resume from Cloudinary
        if (student.resume?.publicId) {
            try {
                await cloudinary.uploader.destroy(
                    student.resume.publicId,
                    {
                        resource_type: "auto",
                    }
                );
            } catch (err) {
                console.log("Old resume deletion failed");
            }
        }

        // Upload new resume
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: "auto",
                folder: "placement-resumes",
                use_filename: true,
                unique_filename: true,
            }
        );

        student.resume = {
            url: result.secure_url,
            publicId: result.public_id,
            originalName: req.file.originalname,
            uploadedAt: new Date(),
        };

        await student.save();

        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: student.resume,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteResume = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.id,
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found.",
            });
        }

        if (!student.resume?.publicId) {
            return res.status(404).json({
                success: false,
                message: "No resume found to delete.",
            });
        }

        // Delete resume from Cloudinary
        await cloudinary.uploader.destroy(
            student.resume.publicId,
            {
                resource_type: "raw",
            }
        );

        // Clear resume details from MongoDB
        student.resume = {
            url: "",
            publicId: "",
            originalName: "",
            uploadedAt: null,
        };

        await student.save();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully.",
        });

    } catch (error) {
        console.error("Delete Resume Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const updateStudentProfile = async (req, res) => {

    try {

        const student = await Student.findOne({
            user: req.user.id,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found.",
            });
        }

        const {
            college,
            branch,
            cgpa,
            skills,
        } = req.body;

        student.college = college;
        student.branch = branch;
        student.cgpa = cgpa;
        student.skills = skills;

        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            student,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }

};


module.exports = {
    createStudentProfile,
    getStudentProfile,
    getStudentDashboard,
    uploadResume,
    deleteResume,
    updateStudentProfile,
};