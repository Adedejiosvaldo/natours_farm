const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const app = express();
const TourRouter = require("./routes/Tours");
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from MiddleWare");
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan("dev"));

//Routes
app.use("/api/v1/tours", TourRouter);

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
