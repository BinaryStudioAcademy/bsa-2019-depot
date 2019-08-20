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
      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {}
  );
  CommitComment.associate = function (/* models */) {
    // associations can be defined here
  };
  return CommitComment;
};
