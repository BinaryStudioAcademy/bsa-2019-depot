module.exports = (sequelize) => {
  const pullReviewer = sequelize.define('pullReviewers', {}, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'pullId']
      }
    ]
  });
  return pullReviewer;
};
