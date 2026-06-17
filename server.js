require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const logger = require("./middleware/loggerMiddleware");

const app = express();

connectDB();

app.use(express.json());

app.use(logger);

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});