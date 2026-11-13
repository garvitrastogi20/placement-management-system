const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "placementor/profile-images",
    resource_type: "image",
  });

  return result;
};

module.exports = uploadToCloudinary;
