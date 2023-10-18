const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const morgan = require("morgan");
dotenv.config({ path: "./config.env" });
const app = express();

const TourRoutes = require("./routes/Tours");
const UserRoutes = require("./routes/Users");

//Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Routes
app.use("/api/v1/tours", TourRoutes);
app.use("/api/v1/users", UserRoutes);

module.exports = app;
