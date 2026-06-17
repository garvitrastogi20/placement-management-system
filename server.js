const express = require("express");

const authRoutes = require("./routes/authRoutes");
const logger = require("./middleware/loggerMiddleware");

const app = express();
app.use(express.json());

app.use(logger);

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});