module.exports = (sequelize, DataTypes) => {
  const IssueLabel = sequelize.define(
    'issueLabel',
    {
      issueId: DataTypes.STRING,
      labelId: DataTypes.STRING
    },
    { paranoid: true, timestamps: true }
  );
  return IssueLabel;
};
