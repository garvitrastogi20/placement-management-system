const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // ==========================
    // User Reference
    // ==========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==========================
    // Personal Information
    // ==========================

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // ==========================
    // Academic Information
    // ==========================

    college: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      default: null,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    // ==========================
    // Skills
    // ==========================

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================
    // Resume
    // ==========================

    resume: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    // ==========================
    // Professional Links
    // ==========================

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    // ==========================
    // AI / Profile Progress
    // ==========================

    resumeScore: {
      type: Number,
      default: 0,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Student", studentSchema);
