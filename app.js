const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();
const TourRoutes = require("./routes/Tours");
const UserRoutes = require("./routes/Users");

app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use("/api/v1/tours", TourRoutes);
app.use("/api/v1/users", UserRoutes);

module.exports = app;
