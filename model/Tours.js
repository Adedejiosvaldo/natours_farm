const mongoose = require('mongoose');

const TourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, 'Price must be added'],
  },
});

module.exports = mongoose.model('Tours', TourSchema);
