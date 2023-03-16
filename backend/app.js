/** @format */

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

// Route Imports d
const user = require("./routes/userRoute");
const tale = require("./routes/taleRoute");
const storyteller = require("./routes/storytellerRoute");

app.use("/api/v1", user);
app.use("/api/v1", tale);
app.use("/api/v1", storyteller);

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
