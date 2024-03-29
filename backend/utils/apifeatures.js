/** @format */

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.typeSearch == 'title'
      ? {
        title: {
          $regex: new RegExp(this.queryStr.keyword, 'i')
        },
      }
      : this.queryStr.typeSearch == 'name' ? {
        name: {
          $regex: new RegExp(this.queryStr.keyword, 'i')
        },
      }
        : this.queryStr.typeSearch == 'storyTellersName' ? {
          storyTellersName: {
            $regex: new RegExp(this.queryStr.keyword, 'i')
          },
        } : {};

    const dateSort =
      this.queryStr.dateData == "recent" ? { createdAt: -1 } : { createdAt: 1 };

    this.query = this.query.find({ ...keyword }).sort(dateSort);
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;