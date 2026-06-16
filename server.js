const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/health", (req, res) => {
  res.send("Server Healthy");
});

app.get("/contact", (req, res) => {
  res.send("Contact Page");
});

app.get("/profile", (req, res) => {
  res.send("Profile Page");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});