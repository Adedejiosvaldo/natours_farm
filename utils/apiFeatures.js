class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

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
    if (this.query.fields) {
      const fields = this.query.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  Pagination() {
    // D- Pagination
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
