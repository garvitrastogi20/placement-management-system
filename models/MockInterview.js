const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
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
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        topic: {
          type: String,
          default: "",
        },
        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Medium",
        },
      },
    ],

    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 10,
        },
        feedback: {
          type: String,
          default: "",
        },
        strengths: {
          type: [String],
          default: [],
        },
        improvements: {
          type: [String],
          default: [],
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    overallFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);
