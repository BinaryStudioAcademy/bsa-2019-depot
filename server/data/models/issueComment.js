module.exports = (sequelize, DataTypes) => {
  const IssueComment = sequelize.define(
    'issueComment',
    {
      userId: DataTypes.UUID,
      issueId: DataTypes.UUID,
      body: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return IssueComment;
};
