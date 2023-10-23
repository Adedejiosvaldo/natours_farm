const Tours = require('../model/Tours');

//Controllers
const getAllTours = async (req, res) => {};

const createTour = async (req, res) => {
  try {
    const newTour = await Tours.create(req.body);

    res.status(200).json({
      status: 'sucess',
      tour: newTour,
    });
  } catch (error) {
    res.status(400).json({ status: 'Failure', msg: error.message });
  }
};

const getATour = async (req, res) => {
  const { id } = req.params;
};

const updateTour = async (req, res) => {};

module.exports = {
  getATour,
  getAllTours,
  createTour,
  updateTour,
};
