const Tours = require('../model/Tours');

//Middlewares

const checkReqBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Missing Name and Price',
    });
  }
  next();
};

//Controllers
const getAllTours = async (req, res) => {};

const createTour = async (req, res) => {};

const getATour = async (req, res) => {
  const { id } = req.params;
};

const updateTour = async (req, res) => {};

module.exports = {
  getATour,
  getAllTours,
  createTour,
  updateTour,

  checkReqBody,
};
