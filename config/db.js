const mongoose = require("mongoose");

const STAGING_DB_HOST = "placementor-staging.4itgfgh.mongodb.net";
const STAGING_DB_NAME = "placementor_staging";

const isStagingMongoUriValid = (uri) => {
  if (typeof uri !== "string" || !uri.trim()) {
    return false;
  }

  try {
    const parsed = new URL(uri);
    const isMongoProtocol =
      parsed.protocol === "mongodb+srv:" || parsed.protocol === "mongodb:";
    const hostname = parsed.hostname.toLowerCase();
    const dbName = parsed.pathname.replace(/^\/+/, "").split("/")[0];

    return (
      isMongoProtocol &&
      hostname === STAGING_DB_HOST &&
      dbName === STAGING_DB_NAME
    );
  } catch {
    return false;
  }
};

const connectDB = async () => {
  const isStaging = process.env.NODE_ENV === "staging";

  if (isStaging) {
    mongoose.set("autoIndex", false);
    mongoose.set("autoCreate", false);

    if (!isStagingMongoUriValid(process.env.MONGO_URI)) {
      console.error(
        "Staging safety check failed: MONGO_URI must target the staging host and placementor_staging database.",
      );
      process.exit(1);
    }
  }

  try {
    if (isStaging) {
      await mongoose.connect(process.env.MONGO_URI, {
        autoIndex: false,
        autoCreate: false,
      });
    } else {
      await mongoose.connect(process.env.MONGO_URI);
    }

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB.isStagingMongoUriValid = isStagingMongoUriValid;

module.exports = connectDB;
