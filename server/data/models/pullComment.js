module.exports = (sequelize, DataTypes) => {
  const PullComment = sequelize.define(
    'pullComment',
    {
      body: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return PullComment;
};
