const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "Not specified",
    },

    resumeName: {
      type: String,
      default: "resume.pdf",
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    scoreExplanation: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    matchedSkills: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    missingSkills: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    actionPlan: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

resumeAnalysisSchema.index({
  student: 1,
  createdAt: -1,
});

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
