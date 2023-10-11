const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/AppError");
const axios = require("axios");
const _ = require("lodash");
const { search } = require("../Utils/APIFeatures");

const fetchData = async () => {
  try {
    const response = await axios.get(`${process.env.CURL}`, {
      headers: {
        "x-hasura-admin-secret": `${process.env.HEADER}`,
      },
    });

    return response.data;
  } catch (err) {
    return new AppError("Error Fetching Data", err.response.status || 500);
  }
};

const analyseData = (data) => {
  const totalBlogs = _.size(data.blogs);

  const blogWithLongestTitle = _.maxBy(data.blogs, "title.length");
  const blogsWithPrivacyTitle = _.filter(data.blogs, (blog) =>
    _.includes(blog.title.toLowerCase(), "privacy")
  ).length;
  const uniqueBlogTitles = _.uniqBy(data.blogs, "title");

  return {
    totalBlogs,
    blogWithLongestTitle: blogWithLongestTitle
      ? blogWithLongestTitle.title
      : null,
    blogsWithPrivacyTitle,
    uniqueBlogTitles,
  };
};

exports.getStats = catchAsync(async (req, res, next) => {
  const data = await fetchData();

  if (data.status === "Fail") {
    return next(data);
  }

  const stats = analyseData(data);

  res.status(200).json({
    stats,
  });
});

exports.getStatsQuery = catchAsync(async (req, res, next) => {
  const query = req.query.query;

  if (!query) {
    return next(new AppError("No Search Query Found", 404));
  }

  const data = await fetchData();
  const searchResults = search(data.blogs, query);

  res.json({
    status: "success",
    total: _.size(searchResults),
    results: searchResults,
  });
});
