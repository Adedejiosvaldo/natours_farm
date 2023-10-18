const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
const TourRoutes = require("./routes/Tours");
const UserRoutes = require("./routes/Users");

app.use(express.json());

//Routes
app.use("/api/v1/tours", TourRoutes);
app.use("/api/v1/users", UserRoutes);

module.exports = app;
