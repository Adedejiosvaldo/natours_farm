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

module.exports = { deleteOne };
