const mongoose = require("mongoose");

const interviewPreparationSchema = new mongoose.Schema(
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

    technicalQuestions: [
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
        hint: {
          type: String,
          default: "",
        },
      },
    ],

    projectQuestions: [
      {
        question: {
          type: String,
          required: true,
        },
        project: {
          type: String,
          default: "",
        },
        hint: {
          type: String,
          default: "",
        },
      },
    ],

    hrQuestions: [
      {
        question: {
          type: String,
          required: true,
        },
        hint: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "InterviewPreparation",
  interviewPreparationSchema,
);
