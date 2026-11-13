const Job = require("../models/Job");
const Application = require("../models/Application");

const getRecruiterAnalytics = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // ===========================
    // Recruiter's Jobs
    // ===========================

    const jobs = await Job.find({
      recruiter: recruiterId,
    });

    const jobIds = jobs.map((job) => job._id);

    // ===========================
    // Applications
    // ===========================

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    });

    // ===========================
    // Basic Stats
    // ===========================

    const totalJobs = jobs.length;

    const activeJobs = jobs.filter(
      (job) => !job.deadline || new Date(job.deadline) >= new Date(),
    ).length;

    const expiredJobs = totalJobs - activeJobs;

    const totalApplications = applications.length;

    const shortlisted = applications.filter(
      (app) => app.status === "Shortlisted",
    ).length;

    const selected = applications.filter(
      (app) => app.status === "Selected",
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected",
    ).length;

    const averageApplicants =
      totalJobs === 0 ? 0 : Number((totalApplications / totalJobs).toFixed(1));

    // ===========================
    // Most Popular Job
    // ===========================

    let mostPopularJob = null;

    if (jobs.length > 0) {
      const counts = {};

      applications.forEach((app) => {
        const jobId = app.job.toString();

        counts[jobId] = (counts[jobId] || 0) + 1;
      });
      let max = 0;

      jobs.forEach((job) => {
        const count = counts[job._id.toString()] || 0;

        if (count > max) {
          max = count;

          mostPopularJob = {
            title: job.title,

            applicants: count,
          };
        }
      });
    }

    // ===========================
    // Top Skills
    // ===========================

    const skillMap = {};

    jobs.forEach((job) => {
      (job.skillsRequired || []).forEach((skill) => {
        skillMap[skill] = (skillMap[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillMap)

      .sort((a, b) => b[1] - a[1])

      .slice(0, 8)

      .map((item) => ({
        skill: item[0],

        count: item[1],
      }));

    // ===========================
    // Monthly Applications
    // ===========================

    const months = [
      "Jan",

      "Feb",

      "Mar",

      "Apr",

      "May",

      "Jun",

      "Jul",

      "Aug",

      "Sep",

      "Oct",

      "Nov",

      "Dec",
    ];

    const monthlyApplications = new Array(12)

      .fill(0)

      .map((_, index) => ({
        month: months[index],

        applications: 0,
      }));

    applications.forEach((app) => {
      const month = new Date(app.createdAt).getMonth();

      monthlyApplications[month].applications++;
    });

    // ===========================

    res.json({
      stats: {
        totalJobs,

        activeJobs,

        expiredJobs,

        totalApplications,

        shortlisted,

        selected,

        rejected,

        averageApplicants,
      },

      mostPopularJob,

      topSkills,

      monthlyApplications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getRecruiterAnalytics,
};
