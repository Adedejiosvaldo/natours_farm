const express = require("express");

const app = express();
const fs = require("fs");
const port = process.env.PORT || 5000;

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    result: toursData.length,
    data: {
      toursData,
    },
  });
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
