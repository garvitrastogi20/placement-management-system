import api from "./api";

export const getDashboard = async () => {
  const response = await api.get("/recruiter/dashboard");
  return response.data;
};

export const getRecruiterJobs = async () => {
  const response = await api.get("/recruiter/jobs");
  return response.data;
};

export const getSingleJob = async (jobId) => {
    const response = await api.get(`/recruiter/jobs/${jobId}`);
    return response.data;
};

export const getApplicants = async (jobId) => {
  const response = await api.get(`/recruiter/jobs/${jobId}/applicants`);
  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/recruiter/jobs/${jobId}`, jobData);
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/recruiter/jobs/${jobId}`);
  return response.data;
};
