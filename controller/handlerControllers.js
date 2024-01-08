const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

module.exports = { deleteOne, updateOne, createOne };
