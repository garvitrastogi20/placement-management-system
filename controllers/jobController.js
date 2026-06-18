const Job = require("../models/Job");
const Application = require("../models/Application");

const createJob = async (req, res) => {
    try {

        const {
            title,
            company,
            location,
            package,
            description,
            skillsRequired,
            deadline,
        } = req.body;

        const job = await Job.create({
            recruiter: req.user.id,
            title,
            company,
            location,
            package,
            description,
            skillsRequired,
            deadline,
        });

        res.status(201).json({
            message: "Job Created Successfully",
            job,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const applyJob = async (req, res) => {
    try {

        const { jobId } = req.params;

        const existingApplication =
            await Application.findOne({
                student: req.user.id,
                job: jobId,
            });

        if (existingApplication) {
            return res.status(400).json({
                message: "Already Applied",
            });
        }

        const application =
            await Application.create({
                student: req.user.id,
                job: jobId,
            });

        res.status(201).json({
            message: "Application Submitted",
            application,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createJob,
    applyJob,
};