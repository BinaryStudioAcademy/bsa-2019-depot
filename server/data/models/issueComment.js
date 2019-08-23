module.exports = (sequelize, DataTypes) => {
  const IssueComment = sequelize.define(
    'issueComment',
    {
      body: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return IssueComment;
};
