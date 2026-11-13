const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC ACCOUNT INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    // =====================================================
    // PROFILE PHOTO
    // =====================================================

    profileImage: {
      type: String,
      default: "",
    },

    // =====================================================
    // RECRUITER PROFESSIONAL INFORMATION
    // =====================================================

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    recruiterId: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // COMPANY INFORMATION
    // =====================================================

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    companyType: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    companyWebsite: {
      type: String,
      default: "",
      trim: true,
    },

    companyDescription: {
      type: String,
      default: "",
      trim: true,
    },

    companySize: {
      type: String,
      default: "",
      trim: true,
    },

    foundedYear: {
      type: Number,
      default: null,
    },

    // =====================================================
    // OFFICE / CONTACT INFORMATION
    // =====================================================

    officeAddress: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    // =====================================================
    // PROFESSIONAL LINKS
    // =====================================================

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    companyLinkedin: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // RECRUITER BIO
    // =====================================================

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    recruitmentExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // HIRING PREFERENCES
    // =====================================================

    hiringRoles: {
      type: [String],
      default: [],
    },

    preferredSkills: {
      type: [String],
      default: [],
    },

    employmentTypes: {
      type: [String],
      default: [],
    },

    workModes: {
      type: [String],
      default: [],
    },

    preferredLocations: {
      type: [String],
      default: [],
    },

    minimumCgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    graduationBatches: {
      type: [String],
      default: [],
    },

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
