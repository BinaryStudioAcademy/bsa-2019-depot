module.exports = (sequelize, DataTypes) => {
  const PullRequest = sequelize.define(
    'pullrequest',
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      number: DataTypes.INTEGER
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return PullRequest;
};
