require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const logger = require("./middleware/loggerMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const app = express();
const recruiterRoutes =
    require("./routes/recruiterRoutes");
const applicationRoutes =
    require("./routes/applicationRoutes");
connectDB();

app.use(express.json());

app.use(logger);

app.use("/api/jobs", jobRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/student", studentRoutes);

app.use(
    "/api/recruiter",
    recruiterRoutes
);
app.use(
    "/api/applications",
    applicationRoutes
);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});