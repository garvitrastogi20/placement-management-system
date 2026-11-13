import api from "./api";

// ==============================
// Get All Applicants
// ==============================
export const getApplicants = async (params = {}) => {
  try {
    const response = await api.get("/recruiter/applicants", {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch applicants.";
  }
};

// ==============================
// Update Applicant Status
// ==============================
export const updateApplicantStatus = async (applicationId, status) => {
  try {
    const response = await api.patch(
      `/applications/${applicationId}/status`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update applicant status.";
  }
};
