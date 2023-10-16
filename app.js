const express = require("express");

const app = express();
const fs = require("fs");
const { parse } = require("path");
const TourRouter = require("./routes/Tours");
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/v1/tours", TourRouter);



// app.get("/api/v1/tours", (req, res) => {

// });

// app.post("/api/v1/tours", (req, res) => {

// });

// app.get("/api/v1/tours/:id", (req, res) => {

// });

// app.patch("/api/v1/:id", (req, res) => {

// });

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
