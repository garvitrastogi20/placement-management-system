const Job = require("../models/Job");
const Application = require("../models/Application");

const getRecruiterJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            recruiter: req.user.id,
        });

        const jobsWithCounts = await Promise.all(
            jobs.map(async (job) => {

                const applicantCount =
                    await Application.countDocuments({
                        job: job._id,
                    });

                return {
                    ...job.toObject(),
                    applicantCount,
                };
            })
        );

        res.status(200).json(jobsWithCounts);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getRecruiterJobs,
};