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

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

module.exports = app;
