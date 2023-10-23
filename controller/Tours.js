const Tours = require('../model/Tours');

//Controllers
const getAllTours = async (req, res) => {
  try {
    const allTours = await Tours.find();
    res.status(200).json({
      status: 'Sucess',
      noOfTours: allTours.length,
      data: {
        allTours,
      },
    });
  } catch (error) {
    res.status(404).json({ status: 'failure', msg: error.message });
  }
};

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
  try {
    const { id } = req.params;
    const Tour = await Tours.findById(id);
    res.status(200).json({ status: 'Sucess', data: Tour });
  } catch (error) {
    res.status(400).json({ status: 'Failed', msg: error.message });
  }
};

const updateTour = async (req, res) => {};

module.exports = {
  getATour,
  getAllTours,
  createTour,
  updateTour,
};
