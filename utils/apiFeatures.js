class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
    this.filterObj = {};
  }

  filter() {
    // تجهيز الفلترة من query
    const filterObj = { ...this.queryStr };
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((el) => delete filterObj[el]);

    const finalFilter = {};

    Object.keys(filterObj).forEach((key) => {
      const value = filterObj[key];
      const match = key.match(/(.+)\[(gte|lte|gt|lt)\]/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        if (!finalFilter[field]) finalFilter[field] = {};
        finalFilter[field][operator] = Number(value);
      } else {
        finalFilter[key] = isNaN(value) ? value : Number(value);
      }
    });

    this.filterObj = finalFilter;
    return this;
  }

search(modelName) {
  const keyword = this.queryStr.keyword;
  if (keyword) {
    let searchCondition;

    if (modelName === "Products") {
      searchCondition = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
    } else {
      // لأي موديل تاني نبحث في حقل name
      searchCondition = { name: { $regex: keyword, $options: "i" } };
    }

    // دمج الفلترة + السيرش في object واحد
    const finalQuery =
      this.filterObj && Object.keys(this.filterObj).length > 0
        ? { $and: [this.filterObj, searchCondition] }
        : searchCondition;

    this.mongooseQuery = this.mongooseQuery.find(finalQuery);
  } else {
    // لو مفيش keyword نطبق فقط الفلترة لو موجودة
    this.mongooseQuery = this.mongooseQuery.find(this.filterObj);
  }

  return this;
}


  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit; //2*10 = 20

    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    // 50 items, 10 per page, 5 pages
    pagination.numberOfPages = Math.ceil(countDocuments / limit); // 50 / 10 = 5

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    // previous page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }

  populate(populateOptions) {
    if (populateOptions) {
      this.mongooseQuery = this.mongooseQuery.populate(populateOptions);
    }
    return this;
  }
}

module.exports = ApiFeatures;
