exports.search = (data, query) => {
  const queryLower = query.toLowerCase();

  const searchResults = data.filter((blog) =>
    blog.title.toLowerCase().includes(queryLower)
  );

  return searchResults;
};
