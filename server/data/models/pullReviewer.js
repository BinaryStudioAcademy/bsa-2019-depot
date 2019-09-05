module.exports = (sequelize) => {
  const pullReviewers = sequelize.define('pullReviewers', {}, {});
  return pullReviewers;
};
