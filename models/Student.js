const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        college: {
            type: String,
            required: true,
        },

        branch: {
            type: String,
            required: true,
        },

        cgpa: {
            type: Number,
            required: true,
        },

        skills: [
            {
                type: String,
            },
        ],

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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Student", studentSchema);