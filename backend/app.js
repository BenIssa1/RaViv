/** @format */

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

// Route Imports
const user = require("./routes/userRoute");
const tale = require("./routes/taleRoute");
const storyteller = require("./routes/storytellerRoute");
const parent = require("./routes/parentRoute");
const student = require("./routes/studentRoute");
const historicalStudent = require("./routes/historicalStudentRoute");
const commentTaleRoute = require("./routes/commentTaleRoute");

app.use("/api/v1", user);
app.use("/api/v1", tale);
app.use("/api/v1", storyteller);
app.use("/api/v1", parent);
app.use("/api/v1", student);
app.use("/api/v1", historicalStudent);
app.use("/api/v1", commentTaleRoute);

// Middleware for Errors
app.use(errorMiddleware);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

module.exports = app;
