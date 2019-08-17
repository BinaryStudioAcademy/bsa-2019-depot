module.exports = (sequelize, DataTypes) => {
  const CommitComment = sequelize.define(
    'CommitComment',
    {
      body: DataTypes.STRING,
      repoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'repository',
          key: 'id'
        }
      },
      commitSHA: DataTypes.STRING
    },
    {}
  );
  CommitComment.associate = function (/* models */) {
    // associations can be defined here
  };
  return CommitComment;
};
