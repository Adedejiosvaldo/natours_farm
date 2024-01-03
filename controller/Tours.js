// eslint-disable-next-line import/extensions
const Tours = require('../model/Tours.js');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsyncErrors = require('../utils/catchAsync');

//Controllers

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsyncErrors(async (req, res, next) => {
  const features = new APIFeatures(Tours.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .Pagination();
  //   await the query - response
  const allTours = await features.query;
  console.log(allTours);
  //Send back response
  res.status(200).json({
    status: 'Success',
    noOfTours: allTours.length,
    data: {
      allTours,
    },
  });

  //   const tour = await Tours.find();
  //   res.status(200).json({
  //     status: 'Success',
  //     noOfTours: tour.length,
  //     data: {
  //       tour,
  //     },
  //   });
});

const createTour = catchAsyncErrors(async (req, res, next) => {
  const newTour = await Tours.create(req.body);

  res.status(200).json({
    status: 'Success',
    tour: newTour,
  });
});

const getATour = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const Tour = await Tours.findById(id);

  if (!Tour) {
    // res.status(404).json({ status: 'Success', data: 'No Tour Found' });
    return next(new AppError('No Tour found with that id', 404));
  }
  res.status(200).json({ status: 'Success', data: Tour });
});

const updateTour = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    // res.status(404).json({ status: 'Sucess', data: 'No Tour Found' });
    return next(new AppError('No Tour found with that id', 404));
  }
  res.status(200).json({ status: 'Success', data: { tour } });
});

const deleteTour = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tours.findByIdAndDelete(id);

  if (!tour) {
    // res.status(404).json({ status: 'Sucess', data: 'No Tour Found' });
    return next(new AppError('No Tour found with that id', 404));
  }
  res.status(200).json({
    status: 'Success',
    msg: `Successfully deleted tour with ID ${id}`,
  });
});

const getTourStats = catchAsyncErrors(async (req, res) => {
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
});

const getMonthlyPlan = catchAsyncErrors(async (req, res, next) => {
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
});

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
