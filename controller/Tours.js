const Tours = require('../model/Tours');
const APIFeatures = require('../utils/apiFeatures');

//Controllers

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    // Building Query
    // // 1A - Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // const allTours = await Tours.find().where('duration').equals(5);

    // // 1B Adavnced Filter
    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gt|gte|lt|lte)/g,
    //   (match) => `$${match}`,
    // );
    // queryString = JSON.parse(queryString);
    // let query = Tours.find(queryString);

    //  Building The Query
    // let query = Tours.find(queryString);

    // B - Sorting
    // if (req.query.sort) {
    //   //Multiple Sorting Criteria
    //   const sortBy = req.query.sort.split(',').join(' ');

    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // C- Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // D- Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // // To check that the pagination does not exist the available doc
    // if (req.query.page) {
    //   const numberOfTours = await Tours.countDocuments();
    //   if (skip >= numberOfTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }

    //Executing the query
    const features = new APIFeatures(Tours.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .Pagination();
    //   await the query - response
    const allTours = await features.query;

    //Send back response
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

const getTourStats = async (req, res) => {
  try {
    const stats = await Tours.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numofTours: { $sum: 1 },
          numRating: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'Sucess',
      data: {
        stats,
      },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ status: 'Request Failed', msg: error.message });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    console.log(req.params);
    const year = req.params.year * 1;

    const plan = await Tours.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $month: '$startDates' },
          numberTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },

      {
        $addFields: {
          month: '$_id',
        },
      },

      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numberTourStarts: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ status: 'Request Failed', msg: error.message });
  }
};

module.exports = {
  getATour,
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  //   Other ROutes
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
