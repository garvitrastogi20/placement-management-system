import api from "./api";

// =====================================
// Get Applicants for a Specific Job
// =====================================
export const getApplicants = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error("Job ID is required to fetch applicants.");
    }

    const response = await api.get(`/recruiter/jobs/${jobId}/applicants`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch applicants."
    );
  }
};

// Get Recruiter Dashboard
export const getDashboard = async () => {
  try {
    const response = await api.get("/recruiter/dashboard");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch recruiter dashboard."
    );
  }
};

// Delete Recruiter Job
export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`/recruiter/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to delete job."
    );
  }
};

// =====================================
// Update Applicant Status
// =====================================
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    if (!applicationId) {
      throw new Error("Application ID is required.");
    }

    if (!status) {
      throw new Error("Application status is required.");
    }

    const response = await api.patch(`/applications/${applicationId}/status`, {
      status,
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update applicant status."
    );
  }
};

// =====================================
// Get Single Recruiter Job
// =====================================
export const getSingleJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const response = await api.get(`/recruiter/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch job."
    );
  }
};

// =====================================
// Update Recruiter Job
// =====================================
export const updateJob = async (jobId, jobData) => {
  try {
    if (!jobId) {
      throw new Error("Job ID is required.");
    }

    const response = await api.put(`/recruiter/jobs/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update job."
    );
  }
};
