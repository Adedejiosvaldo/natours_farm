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

const updateTour = async (req, res) => {
  try {
    const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      //   runValidators: true,
    });

    res.status(200).json({ status: 'Success', data: { tour } });
  } catch (error) {
    res.status(400).json({ status: 'Failed', msg: error.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tours.findByIdAndDelete(id);

    res.status(200).json({
      status: 'Success',
      msg: `Successfully deleted tour with ID ${id}`,
    });
  } catch (error) {
    return res.status(404).json({ status: 'Sucess' });
  }
};

module.exports = {
  getATour,
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
};
