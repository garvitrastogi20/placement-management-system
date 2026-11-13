import api from "./api";

// Get recruiter analytics
export const getRecruiterAnalytics = async () => {
  try {
    const response = await api.get("/analytics/recruiter");

    return response.data;
  } catch (error) {
    console.error(
      "Get Recruiter Analytics Error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
