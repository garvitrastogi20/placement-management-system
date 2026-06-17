const express = require("express");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});