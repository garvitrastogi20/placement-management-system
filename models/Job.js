const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
{
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    company: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    package: {
        type: Number,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    skillsRequired: [{
        type: String,
    }],

    deadline: {
        type: Date,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Job", jobSchema);