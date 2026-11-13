const dns = require("node:dns");
const path = require("node:path");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const isStaging = process.env.NODE_ENV === "staging";
if (isStaging) {
  const stagingEnvPath = path.resolve(__dirname, ".env.staging");
  const dotenvResult = require("dotenv").config({
    path: stagingEnvPath,
    override: true,
  });

  if (dotenvResult.error) {
    console.error("Failed to load .env.staging for staging mode.");
    process.exit(1);
  }

  const requiredStagingKeys = ["MONGO_URI", "JWT_SECRET", "PORT", "CORS_ORIGIN"];
  const parsedStaging = dotenvResult.parsed || {};
  const missingStagingKeys = requiredStagingKeys.filter(
    (key) =>
      typeof parsedStaging[key] !== "string" || !parsedStaging[key].trim(),
  );

  if (missingStagingKeys.length > 0) {
    console.error(
      `Missing required staging configuration keys in .env.staging: ${missingStagingKeys.join(", ")}`,
    );
    process.exit(1);
  }
} else {
  require("dotenv").config();
}

const mongoose = require("mongoose");
if (isStaging) {
  mongoose.set("autoIndex", false);
  mongoose.set("autoCreate", false);
}

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const multer = require("multer");
const connectDB = require("./config/db");
const { ensureUploadsDir } = require("./utils/fileSecurity");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const logger = require("./middleware/loggerMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors(
    allowedOrigins.length > 0
      ? {
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              return callback(null, true);
            }
            const err = new Error("Not allowed by CORS");
            err.statusCode = 403;
            return callback(err);
          },
          credentials: true,
        }
      : {},
  ),
);

app.use(express.json({ limit: "1mb" }));
app.use(logger);

const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Uploaded file exceeds the maximum allowed size.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "File upload error.",
    });
  }

  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  const statusCode =
    Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;

  if (statusCode >= 500) {
    console.error("Unhandled Server Error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Internal server error" : err.message,
  });
});

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error("Missing required JWT_SECRET environment variable.");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("Missing required MONGO_URI environment variable.");
    process.exit(1);
  }

  if (isStaging && !connectDB.isStagingMongoUriValid(process.env.MONGO_URI)) {
    console.error(
      "Staging safety check failed: MONGO_URI must target the staging host and placementor_staging database.",
    );
    process.exit(1);
  }

  ensureUploadsDir();
  await connectDB();

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
