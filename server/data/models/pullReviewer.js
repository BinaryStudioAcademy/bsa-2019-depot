module.exports = (sequelize) => {
  const pullReviewers = sequelize.define('pullReviewers', {}, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'pullId']
      }
    ]
  });
  return pullReviewers;
};
