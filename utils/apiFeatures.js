class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

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

  filter() {
    // 1A - Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // const allTours = await Tours.find().where('duration').equals(5);

    // 1B Adavnced Filter
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
    //  Building The Query
  }

  sort() {
    // B - Sorting
    if (this.queryString.sort) {
      //Multiple Sorting Criteria
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //C- Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    // D- Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
