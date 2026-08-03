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

        // Recent Jobs (with Applicant Count)
const recentJobsData = await Job.find({
    recruiter: recruiterId,
})
    .sort({
        createdAt: -1,
    })
    .limit(5)
    .lean();

const recentJobs = await Promise.all(
    recentJobsData.map(async (job) => {

        const applicantCount =
            await Application.countDocuments({
                job: job._id,
            });

        return {
            ...job,
            applicantCount,
        };
    })
);

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
            "title company"
        )
        .sort({
            createdAt: -1,
        })
        .limit(5)
        .lean();

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
 * @desc Get Single Recruiter Job
 * @route GET /api/recruiter/jobs/:jobId
 * @access Recruiter
 */
const getSingleJob = async (req, res) => {
    try {

        const { jobId } = req.params;

        const job = await Job.findOne({
            _id: jobId,
            recruiter: req.user.id,
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
/**
 * @desc Get Applicants for a Job
 * @route GET /api/recruiter/jobs/:jobId/applicants
 * @access Recruiter
 */
const getApplicants = async (req, res) => {
    try {

        const { jobId } = req.params;

        // Check whether the job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        const applicants = await Application.find({
            job: jobId,
        })
            .populate(
                "student",
                "name email role"
            )
            .sort({
                createdAt: -1,
            });

        res.status(200).json(applicants);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};


/**
 * @desc Delete Job
 * @route DELETE /api/recruiter/jobs/:jobId
 * @access Recruiter
 */
const deleteJob = async (req, res) => {
    try {

        const { jobId } = req.params;

        const job = await Job.findOne({
            _id: jobId,
            recruiter: req.user.id,
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        await Application.deleteMany({
            job: jobId,
        });

        await Job.findByIdAndDelete(jobId);

        res.status(200).json({
            message: "Job deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
/**
 * @desc Update Job
 * @route PUT /api/recruiter/jobs/:jobId
 * @access Recruiter
 */
const updateJob = async (req, res) => {
    try {

        const { jobId } = req.params;

        const job = await Job.findOne({
            _id: jobId,
            recruiter: req.user.id,
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        const {
            title,
            company,
            location,
            package,
            description,
            skillsRequired,
            deadline,
        } = req.body;

        job.title = title ?? job.title;
        job.company = company ?? job.company;
        job.location = location ?? job.location;
        job.package = package ?? job.package;
        job.description = description ?? job.description;
        job.skillsRequired = skillsRequired ?? job.skillsRequired;
        job.deadline = deadline ?? job.deadline;

        await job.save();

        res.status(200).json({
            message: "Job Updated Successfully",
            job,
        });

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
    getSingleJob,
    updateJob,
    deleteJob,
};