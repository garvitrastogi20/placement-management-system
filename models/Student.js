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

    skills: [{
        type: String,
    }],

    resumeUrl: {
        type: String,
        default: "",
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Student", studentSchema);