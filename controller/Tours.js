const fs = require("fs");

const toursData = JSON.parse(
  fs.readFileSync("./dev-data/data/tours-simple.json")
);

const getAllTours = async (req, res) => {
  res.status(200).json({
    status: "success",

    result: toursData.length,
    data: {
      toursData,
    },
  });
};

const createTour = async (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  //Push
  toursData.push(newTour);

  //Write updated File
  fs.writeFile(
    `./dev-data/data/tours-simple.json`,
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
};

const getATour = async (req, res) => {
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
};

const updateTour = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;
  c;

  const tour = toursData.find((el) => el.id === parseInt(id));

  if (!tour) {
    return res.status(400).json({
      staus: "Error",
      data: {
        message: "ID does not exist",
      },
    });
  }
};

module.exports = { getATour, getAllTours, createTour, updateTour };
