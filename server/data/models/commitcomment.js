module.exports = (sequelize, DataTypes) => {
  const CommitComment = sequelize.define(
    'commitComment',
    {
      body: DataTypes.STRING,
      commitId: {
        type: DataTypes.UUID,
        references: {
          model: 'commit',
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
    {
      paranoid: true,
      timestamps: true
    }
  );
  return CommitComment;
};
