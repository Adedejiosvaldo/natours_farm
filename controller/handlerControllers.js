const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      // res.status(404).json({ status: 'Sucess', data: 'No Tour Found' });
      return next(new AppError('No document found with that id', 404));
    }
    res.status(200).json({ status: 'Success', data: { data: doc } });
  });

const createOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'Success',
      data: doc,
    });
  });

const getOne = (Model, popOptions) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }
    res.status(200).json({ status: 'Success', data: doc });
  });

const getAll = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    // Allows to get nested route for tours - HACK
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    //   await the query - response
    const doc = await features.query;
    //Send back response
    res.status(200).json({
      status: 'Success',
      noOfTours: doc.length,
      data: {
        doc,
      },
    });
  });
module.exports = { deleteOne, updateOne, createOne, getOne, getAll };
