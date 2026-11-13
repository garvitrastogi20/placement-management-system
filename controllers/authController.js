const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const { safeUnlink, isSupportedImageFile } = require("../utils/fileSecurity");
const {
  normalizeEmail,
  isValidEmail,
  isValidHttpUrl,
  parseOptionalNumber,
  sanitizeStringArray,
} = require("../utils/validation");

const ALLOWED_REGISTER_ROLES = new Set(["student", "recruiter"]);

const test = (req, res) => {
  res.send("Auth Route Working");
};

// ======================================================
// Get Profile
// ======================================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

// ======================================================
// Register User
// ======================================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (
      role !== undefined &&
      (typeof role !== "string" || !ALLOWED_REGISTER_ROLES.has(role))
    ) {
      return res.status(400).json({
        message: "Invalid role. Must be student or recruiter.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    console.error("Register User Error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

// ======================================================
// Login User
// ======================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({
        message: "Authentication service misconfigured",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

// ======================================================
// Update Profile
// ======================================================

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      profileImage,

      // Recruiter professional information
      designation,
      department,
      recruiterId,
      phone,

      // Company information
      companyName,
      companyLogo,
      companyType,
      industry,
      companyWebsite,
      companyDescription,
      companySize,
      foundedYear,

      // Office / location
      officeAddress,
      city,
      state,
      country,

      // Social links
      linkedin,
      companyLinkedin,

      // Recruiter information
      bio,
      recruitmentExperience,

      // Hiring preferences
      hiringRoles,
      preferredSkills,
      employmentTypes,
      workModes,
      preferredLocations,

      // Eligibility preferences
      minimumCgpa,
      graduationBatches,
    } = req.body || {};

    const urlFields = {
      profileImage,
      companyLogo,
      companyWebsite,
      linkedin,
      companyLinkedin,
    };

    for (const [field, val] of Object.entries(urlFields)) {
      if (val !== undefined && !isValidHttpUrl(val)) {
        return res.status(400).json({
          message: `Invalid URL for ${field}`,
        });
      }
    }

    const parsedFoundedYear = parseOptionalNumber(foundedYear, {
      min: 1800,
      max: new Date().getFullYear() + 1,
      integer: true,
      emptyValue: null,
    });
    if (!parsedFoundedYear.valid) {
      return res.status(400).json({
        message: "Invalid foundedYear",
      });
    }

    const parsedExperience = parseOptionalNumber(recruitmentExperience, {
      min: 0,
      max: 80,
      emptyValue: 0,
    });
    if (!parsedExperience.valid) {
      return res.status(400).json({
        message: "Invalid recruitmentExperience",
      });
    }

    const parsedMinCgpa = parseOptionalNumber(minimumCgpa, {
      min: 0,
      max: 10,
      emptyValue: 0,
    });
    if (!parsedMinCgpa.valid) {
      return res.status(400).json({
        message: "minimumCgpa must be between 0 and 10",
      });
    }

    // ==================================================
    // Basic Information
    // ==================================================

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      user.name = name.trim();
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    // ==================================================
    // Recruiter Professional Information
    // ==================================================

    const optionalStrings = {
      designation,
      department,
      recruiterId,
      phone,
      companyName,
      companyLogo,
      companyType,
      industry,
      companyWebsite,
      companyDescription,
      companySize,
      officeAddress,
      city,
      state,
      country,
      linkedin,
      companyLinkedin,
      bio,
    };

    for (const [field, val] of Object.entries(optionalStrings)) {
      if (val !== undefined) {
        if (typeof val !== "string") {
          return res.status(400).json({ message: `Invalid value for ${field}` });
        }
        user[field] = val.trim();
      }
    }

    if (parsedFoundedYear.provided) {
      user.foundedYear = parsedFoundedYear.value;
    }

    if (parsedExperience.provided) {
      user.recruitmentExperience = parsedExperience.value;
    }

    // ==================================================
    // Hiring Preferences
    // ==================================================

    const arrayFields = {
      hiringRoles,
      preferredSkills,
      employmentTypes,
      workModes,
      preferredLocations,
      graduationBatches,
    };

    for (const [field, val] of Object.entries(arrayFields)) {
      if (val !== undefined) {
        user[field] = sanitizeStringArray(val) || [];
      }
    }

    // ==================================================
    // Eligibility Preferences
    // ==================================================

    if (parsedMinCgpa.provided) {
      user.minimumCgpa = parsedMinCgpa.value;
    }

    // ==================================================
    // Save Updated User
    // ==================================================

    await user.save();

    // Don't send password back to frontend
    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    const isValidImage = await isSupportedImageFile(req.file.path);
    if (!isValidImage) {
      return res.status(400).json({
        message: "Invalid image file. Only JPEG, PNG, WebP, or GIF are allowed.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const result = await uploadToCloudinary(req.file.path);

    user.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: result.secure_url,
    });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);

    res.status(500).json({
      message: "Failed to upload profile image",
    });
  } finally {
    await safeUnlink(req.file?.path);
  }
};

// ======================================================
// Change Password
// ======================================================

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (
      typeof currentPassword !== "string" ||
      !currentPassword ||
      typeof newPassword !== "string" ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};

// ======================================================
// Export Controllers
// ======================================================

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
};
