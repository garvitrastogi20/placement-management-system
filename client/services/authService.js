import api from "./api";

// ======================================================
// Get Profile
// ======================================================

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// ======================================================
// Update Profile
// ======================================================

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};

// ======================================================
// Change Password
// ======================================================

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

// ======================================================
// Upload Profile Image
// ======================================================

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await api.post("/auth/profile/image", formData);
  return response.data;
};
