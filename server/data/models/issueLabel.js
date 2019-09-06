module.exports = (sequelize, DataTypes) => {
  const IssueLabel = sequelize.define(
    'IssueLabel',
    {
      issueId: DataTypes.STRING,
      labelId: DataTypes.STRING
    },
    { paranoid: true, timestamps: true }
  );
  return IssueLabel;
};
