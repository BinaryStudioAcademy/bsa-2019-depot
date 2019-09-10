module.exports = (sequelize, DataTypes) => {
  const IssueAssignee = sequelize.define(
    'issueAssignee',
    {
      issueId: DataTypes.STRING,
      assigneeId: DataTypes.STRING
    },
    { paranoid: true, timestamps: true }
  );
  return IssueAssignee;
};
