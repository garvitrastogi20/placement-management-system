const Application = require("../models/Application");

const updateApplicationStatus = async (req, res) => {
    try {

        const { applicationId } = req.params;

        const { status } = req.body;

        const application =
            await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            message: "Application status updated",
            application,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    updateApplicationStatus,
};