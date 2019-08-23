module.exports = (sequelize, DataTypes) => {
  const CommitComment = sequelize.define(
    'commitComment',
    {
      body: DataTypes.STRING,
      commitId: DataTypes.UUID,
      userId: DataTypes.UUID,
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return CommitComment;
};
