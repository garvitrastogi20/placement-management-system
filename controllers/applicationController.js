const Application = require("../models/Application");
const Job = require("../models/Job");
const { isValidObjectId } = require("../utils/validation");

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body || {};

    if (!isValidObjectId(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const validStatuses = ["Applied", "Shortlisted", "Selected", "Rejected"];

    // Validate status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Find the application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Verify that the recruiter owns the job
    const job = await Job.findOne({
      _id: application.job,
      recruiter: req.user.id,
    });

    if (!job) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    // Update application status
    application.status = status;

    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);

    return res.status(500).json({
      message: "Failed to update application status",
    });
  }
};

module.exports = {
  updateApplicationStatus,
};
