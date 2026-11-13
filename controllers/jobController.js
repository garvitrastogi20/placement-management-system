const Job = require("../models/Job");
const Application = require("../models/Application");
const {
  isValidObjectId,
  parseOptionalNumber,
  sanitizeStringArray,
  escapeRegex,
  parsePagination,
  formatPaginationResponse,
} = require("../utils/validation");

// In-process lock prevents concurrent double-submissions for the same (student, job) pair
// even when no unique database index is enforced yet.
const inFlightApplications = new Set();

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      package: jobPackage,
      description,
      skillsRequired,
      deadline,
    } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof company !== "string" ||
      !company.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Title, company, location, and description are required",
      });
    }

    const parsedPackage = parseOptionalNumber(jobPackage, {
      min: 0,
      emptyValue: null,
    });
    if (!parsedPackage.valid || parsedPackage.value === null) {
      return res.status(400).json({
        message: "Package must be a non-negative number",
      });
    }

    let parsedDeadline;
    if (deadline !== undefined && deadline !== null && deadline !== "") {
      const date = new Date(deadline);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: "Invalid deadline date",
        });
      }
      parsedDeadline = date;
    }

    const cleanSkills =
      skillsRequired !== undefined ? sanitizeStringArray(skillsRequired) : [];
    if (skillsRequired !== undefined && cleanSkills === null) {
      return res.status(400).json({
        message: "skillsRequired must be an array of strings",
      });
    }

    const job = await Job.create({
      recruiter: req.user.id,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      package: parsedPackage.value,
      description: description.trim(),
      skillsRequired: cleanSkills || [],
      deadline: parsedDeadline,
    });

    res.status(201).json({
      message: "Job Created Successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({
      message: "Failed to create job",
    });
  }
};

const applyJob = async (req, res) => {
  const { jobId } = req.params;
  const applicationKey = `${req.user.id}:${jobId}`;

  if (!isValidObjectId(jobId)) {
    return res.status(400).json({
      message: "Invalid job ID",
    });
  }

  if (inFlightApplications.has(applicationKey)) {
    return res.status(409).json({
      message: "Application submission already in progress",
    });
  }

  inFlightApplications.add(applicationKey);

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        message: "Application deadline has passed",
      });
    }

    const existingApplication = await Application.findOne({
      student: req.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
    });

    res.status(201).json({
      message: "Application Submitted",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Already Applied",
      });
    }

    console.error("Apply Job Error:", error);
    res.status(500).json({
      message: "Failed to submit application",
    });
  } finally {
    inFlightApplications.delete(applicationKey);
  }
};

const getApplicants = async (req, res) => {
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
        message: "Job not found or you are not authorized to access it.",
      });
    }

    const applicants = await Application.find({
      job: jobId,
    }).populate("student", "name email role");

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({
      message: "Failed to fetch applicants",
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { company, location, skill } = req.query;

    const filter = {};

    if (typeof company === "string" && company.trim()) {
      filter.company = new RegExp(`^${escapeRegex(company.trim())}$`, "i");
    }

    if (typeof location === "string" && location.trim()) {
      filter.location = new RegExp(`^${escapeRegex(location.trim())}$`, "i");
    }

    if (typeof skill === "string" && skill.trim()) {
      filter.skillsRequired = new RegExp(`^${escapeRegex(skill.trim())}$`, "i");
    }

    const { page, limit, skip } = parsePagination(req.query, 10, 50);

    const [totalRecords, jobs] = await Promise.all([
      Job.countDocuments(filter),
      Job.find(filter)
        .populate("recruiter", "name email")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    let finalJobs = jobs;

    // If the logged-in user is a student, mark applied jobs for the current page only
    if (req.user?.role === "student" && jobs.length > 0) {
      const pageJobIds = jobs.map((j) => j._id);
      const applications = await Application.find({
        student: req.user.id,
        job: { $in: pageJobIds },
      }).select("job");

      const appliedJobIds = new Set(
        applications.map((app) => app.job.toString()),
      );

      finalJobs = jobs.map((job) => ({
        ...job.toObject(),
        isApplied: appliedJobIds.has(job._id.toString()),
      }));
    } else {
      finalJobs = jobs.map((job) => (job.toObject ? job.toObject() : job));
    }

    return res.status(200).json(
      formatPaginationResponse({
        data: finalJobs,
        totalRecords,
        page,
        limit,
      }),
    );
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId).populate(
      "recruiter",
      "name email",
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    let isApplied = false;

    if (req.user?.role === "student") {
      const application = await Application.findOne({
        student: req.user.id,
        job: job._id,
      });

      isApplied = !!application;
    }

    res.status(200).json({
      ...job.toObject(),
      isApplied,
    });
  } catch (error) {
    console.error("Get Job By Id Error:", error);
    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 10, 50);

    const filter = {
      student: req.user.id,
    };

    const [totalRecords, applications] = await Promise.all([
      Application.countDocuments(filter),
      Application.find(filter)
        .populate("job", "title company location package deadline")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json(
      formatPaginationResponse({
        data: applications,
        totalRecords,
        page,
        limit,
      }),
    );
  } catch (error) {
    console.error("Get My Applications Error:", error);
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({
          job: job._id,
        });

        return {
          ...job,
          applicantCount,
        };
      }),
    );

    res.status(200).json(jobsWithApplicants);
  } catch (error) {
    console.error("Get Recruiter Jobs Error:", error);
    res.status(500).json({
      message: "Failed to fetch recruiter jobs",
    });
  }
};

module.exports = {
  createJob,
  applyJob,
  getApplicants,
  getAllJobs,
  getMyApplications,
  getJobById,
  getRecruiterJobs,
};
