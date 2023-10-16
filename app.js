const express = require("express");

const app = express();
const fs = require("fs");
const { parse } = require("path");
const port = process.env.PORT || 5000;
app.use(express.json());

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

app.post("/api/v1/tours", (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  //Push
  toursData.push(newTour);

  //Write updated File
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.get("/api/v1/tours/:id", (req, res) => {
  const { id } = req.params;

  //   console.log(id);
  const tour = toursData.find((el) => el.id === parseInt(id));

  if (!tour) {
    return res.status(400).json({
      staus: "Error",
      data: {
        message: "ID does not exist",
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
