module.exports = (sequelize) => {
  const pullReviewers = sequelize.define('pullReviewers', {}, {
    /* timestamps: true,
    paranoid: true, */
    indexes: [
      {
        unique: true,
        fields: ['userId', 'pullId']
      }
    ]
  });
  return pullReviewers;
};
