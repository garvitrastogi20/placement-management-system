const Student = require("../models/Student");
const Application = require("../models/Application");
const cloudinary = require("../config/cloudinary");
const Job = require("../models/Job");
const { safeUnlink, isPdfFile } = require("../utils/fileSecurity");
const {
  isValidHttpUrl,
  parseOptionalNumber,
  sanitizeStringArray,
} = require("../utils/validation");

const destroyCloudinaryResume = async (publicId) => {
  if (!publicId) return;

  const rawResult = await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });

  // Backward compatibility: older resumes uploaded via resource_type: "auto" may be stored as "image"
  if (rawResult?.result === "not found") {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  }
};

// ======================================================
// Create Student Profile
// ======================================================

const createStudentProfile = async (req, res) => {
  try {
    const {
      phone,
      college,
      branch,
      semester,
      cgpa,
      skills,
      linkedin,
      github,
      portfolio,
      bio,
      profileImage,
    } = req.body || {};

    if (
      typeof college !== "string" ||
      !college.trim() ||
      typeof branch !== "string" ||
      !branch.trim()
    ) {
      return res.status(400).json({
        message: "College and branch are required",
      });
    }

    const parsedSemester = parseOptionalNumber(semester, {
      min: 1,
      max: 12,
      integer: true,
      emptyValue: null,
    });
    if (!parsedSemester.valid) {
      return res.status(400).json({
        message: "Semester must be an integer between 1 and 12",
      });
    }

    const parsedCgpa = parseOptionalNumber(cgpa, {
      min: 0,
      max: 10,
      emptyValue: 0,
    });
    if (!parsedCgpa.valid) {
      return res.status(400).json({
        message: "CGPA must be a number between 0 and 10",
      });
    }

    for (const [field, val] of Object.entries({
      linkedin,
      github,
      portfolio,
      profileImage,
    })) {
      if (val !== undefined && !isValidHttpUrl(val)) {
        return res.status(400).json({
          message: `Invalid URL for ${field}`,
        });
      }
    }

    const existingProfile = await Student.findOne({
      user: req.user.id,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    const cleanSkills = sanitizeStringArray(skills) || [];
    const cleanCgpa = parsedCgpa.provided ? parsedCgpa.value : 0;

    const student = await Student.create({
      user: req.user.id,
      phone: typeof phone === "string" ? phone.trim() : "",
      college: college.trim(),
      branch: branch.trim(),
      semester: parsedSemester.provided ? parsedSemester.value : null,
      cgpa: cleanCgpa,
      skills: cleanSkills,
      linkedin: typeof linkedin === "string" ? linkedin.trim() : "",
      github: typeof github === "string" ? github.trim() : "",
      portfolio: typeof portfolio === "string" ? portfolio.trim() : "",
      bio: typeof bio === "string" ? bio.trim() : "",
      profileImage: typeof profileImage === "string" ? profileImage.trim() : "",
      profileCompleted: Boolean(
        college.trim() && branch.trim() && cleanCgpa > 0 && cleanSkills.length > 0,
      ),
    });

    res.status(201).json({
      message: "Student profile created successfully",
      student,
    });
  } catch (error) {
    console.error("Create Student Profile Error:", error);

    res.status(500).json({
      message: "Failed to create student profile",
    });
  }
};

// ======================================================
// Get Student Profile
// ======================================================

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
    console.error("Get Student Profile Error:", error);

    res.status(500).json({
      message: "Failed to fetch student profile",
    });
  }
};

// ======================================================
// Update Student Profile
// ======================================================

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
      phone,
      college,
      branch,
      semester,
      cgpa,
      skills,
      linkedin,
      github,
      portfolio,
      bio,
      profileImage,
    } = req.body || {};

    const parsedSemester = parseOptionalNumber(semester, {
      min: 1,
      max: 12,
      integer: true,
      emptyValue: null,
    });
    if (!parsedSemester.valid) {
      return res.status(400).json({
        message: "Semester must be an integer between 1 and 12",
      });
    }

    const parsedCgpa = parseOptionalNumber(cgpa, {
      min: 0,
      max: 10,
      emptyValue: 0,
    });
    if (!parsedCgpa.valid) {
      return res.status(400).json({
        message: "CGPA must be a number between 0 and 10",
      });
    }

    for (const [field, val] of Object.entries({
      linkedin,
      github,
      portfolio,
      profileImage,
    })) {
      if (val !== undefined && !isValidHttpUrl(val)) {
        return res.status(400).json({
          message: `Invalid URL for ${field}`,
        });
      }
    }

    if (college !== undefined) {
      if (typeof college !== "string" || !college.trim()) {
        return res.status(400).json({
          message: "College cannot be empty",
        });
      }
      student.college = college.trim();
    }

    if (branch !== undefined) {
      if (typeof branch !== "string" || !branch.trim()) {
        return res.status(400).json({
          message: "Branch cannot be empty",
        });
      }
      student.branch = branch.trim();
    }

    // Personal
    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return res.status(400).json({ message: "Invalid phone value" });
      }
      student.phone = phone.trim();
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({ message: "Invalid bio value" });
      }
      student.bio = bio.trim();
    }

    if (profileImage !== undefined) {
      student.profileImage = typeof profileImage === "string" ? profileImage.trim() : "";
    }

    // Academic
    if (parsedSemester.provided) {
      student.semester = parsedSemester.value;
    }

    if (parsedCgpa.provided) {
      student.cgpa = parsedCgpa.value;
    }

    // Skills
    if (skills !== undefined) {
      student.skills = sanitizeStringArray(skills) || [];
    }

    // Professional Links
    if (linkedin !== undefined) {
      student.linkedin = typeof linkedin === "string" ? linkedin.trim() : "";
    }

    if (github !== undefined) {
      student.github = typeof github === "string" ? github.trim() : "";
    }

    if (portfolio !== undefined) {
      student.portfolio = typeof portfolio === "string" ? portfolio.trim() : "";
    }

    // Profile completion
    student.profileCompleted = Boolean(
      student.college &&
      student.branch &&
      student.cgpa &&
      student.skills &&
      student.skills.length > 0,
    );

    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      student,
    });
  } catch (error) {
    console.error("Update Student Profile Error:", error);

    res.status(500).json({
      message: "Failed to update student profile",
    });
  }
};

// ======================================================
// Student Dashboard
// ======================================================

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

    const recentApplications = await Application.find({
      student: req.user.id,
    })
      .populate("job", "title company location package deadline")
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    const studentSkills = (student.skills || []).map((skill) =>
      skill.trim().toLowerCase(),
    );

    const appliedJobIds = applications.map((application) => application.job);

    const availableJobs = await Job.find({
      _id: {
        $nin: appliedJobIds,
      },
      deadline: {
        $gte: new Date(),
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(20)
      .lean();

    const recommendedJobs = availableJobs
      .map((job) => {
        const requiredSkills = (job.skillsRequired || []).map((skill) =>
          skill.trim().toLowerCase(),
        );

        const matchedSkills = requiredSkills.filter((skill) =>
          studentSkills.includes(skill),
        );

        const matchPercentage =
          requiredSkills.length > 0
            ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
            : 0;

        return {
          ...job,
          matchedSkills,
          matchPercentage,
        };
      })
      .filter((job) => job.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);

    const dashboard = {
      user: student.user,

      profile: {
        college: student.college || "",
        branch: student.branch || "",
        cgpa: student.cgpa || 0,
        skills: student.skills || [],
        resume: student.resume || {
          url: "",
          publicId: "",
          originalName: "",
          uploadedAt: null,
        },
        phone: student.phone || "",
        semester: student.semester ?? null,
        linkedin: student.linkedin || "",
        github: student.github || "",
        portfolio: student.portfolio || "",
        bio: student.bio || "",
        profileImage: student.profileImage || "",
      },

      stats: {
        totalApplications: applications.length,
        shortlisted: applications.filter((app) => app.status === "Shortlisted")
          .length,
        selected: applications.filter((app) => app.status === "Selected")
          .length,
        rejected: applications.filter((app) => app.status === "Rejected")
          .length,
        resumeUploaded: !!student.resume?.url,
        totalSkills: student.skills?.length || 0,
      },

      recentApplications,
      recommendedJobs,
    };

    res.status(200).json(dashboard);
  } catch (error) {
    console.error("Student Dashboard Error:", error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};

// ======================================================
// Upload Resume
// ======================================================

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded",
      });
    }

    const validPdf = await isPdfFile(req.file.path);
    if (!validPdf) {
      return res.status(400).json({
        message: "Invalid PDF file. Please upload a valid PDF resume.",
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

    // Delete old resume
    if (student.resume?.publicId) {
      try {
        await destroyCloudinaryResume(student.resume.publicId);
      } catch (err) {
        console.error("Old resume deletion failed:", err.message);
      }
    }

    // Upload new resume as raw PDF
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "placement-resumes",
      use_filename: true,
      unique_filename: true,
    });

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
    console.error("Upload Resume Error:", error);

    res.status(500).json({
      message: "Failed to upload resume",
    });
  } finally {
    await safeUnlink(req.file?.path);
  }
};

// ======================================================
// Delete Resume
// ======================================================

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

    await destroyCloudinaryResume(student.resume.publicId);

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

// ======================================================
// Exports
// ======================================================

module.exports = {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  uploadResume,
  deleteResume,
};
