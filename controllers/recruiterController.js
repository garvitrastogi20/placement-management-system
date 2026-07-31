const Job = require("../models/Job");
const Application = require("../models/Application");

/**
 * @desc Get Recruiter's Dashboard Data
 * @route GET /api/recruiter/dashboard
 * @access Recruiter
 */
const getDashboard = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const today = new Date();

        // Total Jobs
        const totalJobs = await Job.countDocuments({
            recruiter: recruiterId,
        });

        // Active Jobs
        const activeJobs = await Job.countDocuments({
            recruiter: recruiterId,
            deadline: {
                $gte: today,
            },
        });

        // Recruiter's Job IDs
        const recruiterJobs = await Job.find({
            recruiter: recruiterId,
        }).select("_id");

        const jobIds = recruiterJobs.map(job => job._id);

        // Total Applicants
        const totalApplicants =
            await Application.countDocuments({
                job: {
                    $in: jobIds,
                },
            });

        // Recent Jobs
        const recentJobs = await Job.find({
            recruiter: recruiterId,
        })
            .sort({
                createdAt: -1,
            })
            .limit(5);

        // Recent Applications
        const recentApplications =
            await Application.find({
                job: {
                    $in: jobIds,
                },
            })
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "job",
                    "title"
                )
                .sort({
                    createdAt: -1,
                })
                .limit(5);

        res.status(200).json({
            stats: {
                totalJobs,
                activeJobs,
                totalApplicants,
                shortlisted: 0, // We'll implement later
            },
            recentJobs,
            recentApplications,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

/**
 * @desc Get Recruiter's Jobs
 * @route GET /api/recruiter/jobs
 * @access Recruiter
 */
const getRecruiterJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            recruiter: req.user.id,
        })
            .sort({
                createdAt: -1,
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

/**
 * @desc Get Applicants of a Job
 * @route GET /api/recruiter/jobs/:jobId/applicants
 * @access Recruiter
 */
const getApplicants = async (req, res) => {
    try {

        const { jobId } = req.params;

        const applicants =
            await Application.find({
                job: jobId,
            })
                .populate(
                    "student",
                    "name email role"
                );

        res.status(200).json(applicants);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getDashboard,
    getRecruiterJobs,
    getApplicants,
};