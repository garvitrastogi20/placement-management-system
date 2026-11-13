const Job = require("../models/Job");
const Application = require("../models/Application");
const {
  isValidObjectId,
  parseOptionalNumber,
  sanitizeStringArray,
  parsePagination,
  formatPaginationResponse,
} = require("../utils/validation");

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

    const jobIds = recruiterJobs.map((job) => job._id);

    // Total Applicants & Shortlisted count
    const [totalApplicants, shortlisted] = await Promise.all([
      Application.countDocuments({
        job: {
          $in: jobIds,
        },
      }),
      Application.countDocuments({
        job: {
          $in: jobIds,
        },
        status: "Shortlisted",
      }),
    ]);

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
        const applicantCount = await Application.countDocuments({
          job: job._id,
        });

        return {
          ...job,
          applicantCount,
        };
      }),
    );

    // Recent Applications
    const recentApplications = await Application.find({
      job: {
        $in: jobIds,
      },
    })
      .populate("student", "name email")
      .populate("job", "title company")
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
        shortlisted,
      },
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    console.error("Get Recruiter Dashboard Error:", error);
    res.status(500).json({
      message: "Failed to load recruiter dashboard",
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
    }).sort({
      createdAt: -1,
    });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({
          job: job._id,
        });

        return {
          ...job.toObject(),
          applicantCount,
        };
      }),
    );

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    console.error("Get Recruiter Jobs Error:", error);
    res.status(500).json({
      message: "Failed to fetch recruiter jobs",
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

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

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
    console.error("Get Single Job Error:", error);
    res.status(500).json({
      message: "Failed to fetch job",
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

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    // Verify job ownership
    const job = await Job.findOne({
      _id: jobId,
      recruiter: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you are not authorized to access it.",
      });
    }

    // Get applicants for this job
    const applicants = await Application.find({
      job: jobId,
    })
      .populate("student", "name email role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(applicants);
  } catch (error) {
    console.error("Get Job Applicants Error:", error);

    return res.status(500).json({
      message: "Failed to fetch job applicants",
    });
  }
};

/**
 * @desc Get All Applicants of Recruiter's Jobs
 * @route GET /api/recruiter/applicants
 * @access Recruiter
 */
const getAllApplicants = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 10, 50);

    // Get all jobs posted by this recruiter
    const recruiterJobs = await Job.find({
      recruiter: req.user.id,
    }).select("_id");

    const jobIds = recruiterJobs.map((job) => job._id);

    const filter = {
      job: {
        $in: jobIds,
      },
    };

    const [totalRecords, applicants] = await Promise.all([
      Application.countDocuments(filter),
      Application.find(filter)
        .populate("student", "name email role")
        .populate("job", "title company")
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json(
      formatPaginationResponse({
        data: applicants,
        totalRecords,
        page,
        limit,
      }),
    );
  } catch (error) {
    console.error("Get All Applicants Error:", error);
    res.status(500).json({
      message: "Failed to fetch applicants",
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

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Job.findOneAndDelete({
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

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({
      message: "Failed to delete job",
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

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

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
      package: jobPackage,
      description,
      skillsRequired,
      deadline,
    } = req.body || {};

    for (const [field, val] of Object.entries({
      title,
      company,
      location,
      description,
    })) {
      if (val !== undefined) {
        if (typeof val !== "string" || !val.trim()) {
          return res.status(400).json({
            message: `${field} cannot be empty`,
          });
        }
        job[field] = val.trim();
      }
    }

    if (jobPackage !== undefined) {
      const parsedPackage = parseOptionalNumber(jobPackage, {
        min: 0,
        emptyValue: null,
      });
      if (!parsedPackage.valid || parsedPackage.value === null) {
        return res.status(400).json({
          message: "Package must be a non-negative number",
        });
      }
      job.package = parsedPackage.value;
    }

    if (skillsRequired !== undefined) {
      const cleanSkills = sanitizeStringArray(skillsRequired);
      if (cleanSkills === null) {
        return res.status(400).json({
          message: "skillsRequired must be an array of strings",
        });
      }
      job.skillsRequired = cleanSkills;
    }

    if (deadline !== undefined) {
      if (deadline === null || deadline === "") {
        job.deadline = undefined;
      } else {
        const date = new Date(deadline);
        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            message: "Invalid deadline date",
          });
        }
        job.deadline = date;
      }
    }

    await job.save();

    res.status(200).json({
      message: "Job Updated Successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({
      message: "Failed to update job",
    });
  }
};

module.exports = {
  getDashboard,
  getRecruiterJobs,
  getApplicants,
  getAllApplicants,
  getSingleJob,
  updateJob,
  deleteJob,
};
