const express = require("express");

const app = express();
const fs = require("fs");
const { parse } = require("path");
const TourRouter = require("./routes/Tours");
const port = process.env.PORT || 5000;
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from MiddleWare");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", TourRouter);

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
