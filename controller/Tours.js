const Tours = require('../model/Tours');
const AppError = require('../utils/appError');
const catchAsyncErrors = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerControllers');
//Controllers

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Before Factory Function
// ->
// const getAllTours = catchAsyncErrors(async (req, res, next) => {
//   const features = new APIFeatures(Tours.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .Pagination();
//   //   await the query - response
//   const allTours = await features.query;
//   //Send back response
//   res.status(200).json({
//     status: 'Success',
//     noOfTours: allTours.length,
//     data: {
//       allTours,
//     },
//   });
// });

const getAllTours = getAll(Tours);

// Before Factory Function
// ->
// const createTour = catchAsyncErrors(async (req, res, next) => {
//   const newTour = await Tours.create(req.body);

//   res.status(200).json({
//     status: 'Success',
//     tour: newTour,
//   });
// });

// After Factory Function
// ->
const createTour = createOne(Tours);

// const getATour = catchAsyncErrors(async (req, res, next) => {
//   const { id } = req.params;
//   const Tour = await Tours.findById(id).populate('reviews');

//   if (!Tour) {
//     // res.status(404).json({ status: 'Success', data: 'No Tour Found' });
//     return next(new AppError('No Tour found with that id', 404));
//   }
//   res.status(200).json({ status: 'Success', data: Tour });
// });

const getATour = getOne(Tours, 'reviews');

// Before Factory Function
// ->
// const updateTour = catchAsyncErrors(async (req, res, next) => {
//   const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!tour) {
//     // res.status(404).json({ status: 'Sucess', data: 'No Tour Found' });
//     return next(new AppError('No Tour found with that id', 404));
//   }
//   res.status(200).json({ status: 'Success', data: { tour } });
// });

// After Factory Function
// ->
const updateTour = updateOne(Tours);

// Before Factory Function
// ->
// const deleteTour = catchAsyncErrors(async (req, res, next) => {
//   const { id } = req.params;
//   const tour = await Tours.findByIdAndDelete(id);

//   if (!tour) {
//     // res.status(404).json({ status: 'Sucess', data: 'No Tour Found' });
//     return next(new AppError('No Tour found with that id', 404));
//   }
//   res.status(200).json({
//     status: 'Success',
//     msg: `Successfully deleted tour with ID ${id}`,

//   });
// });

// After Factory Function
// ->
const deleteTour = deleteOne(Tours);

// Aggregate
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

const getToursWithin = catchAsyncErrors(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide Latitude and Longitiute in the format lat,long',
        400,
      ),
    );
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  //   GeoWithin
  const tours = await Tours.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { data: tours },
  });
});

const getTourDistance = catchAsyncErrors(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide Latitude and Longitiute in the format lat,long',
        400,
      ),
    );
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const distances = await Tours.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] }, // Point from which to calculate the distances
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { data: distances },
  });
});

module.exports = {
  getATour,
  getAllTours,
  createTour,
  updateTour,
  deleteTour,

  //   Aggregation
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,

  // Geospatial Queries and aggregation
  getToursWithin,
  getTourDistance,
};
