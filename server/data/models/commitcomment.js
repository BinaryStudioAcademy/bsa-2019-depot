module.exports = (sequelize, DataTypes) => {
  const CommitComment = sequelize.define(
    'commitComment',
    {
      body: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return CommitComment;
};
