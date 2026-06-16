const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("AI Placement Management System Backend Running");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/health", (req, res) => {
  res.send("Server Healthy");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});