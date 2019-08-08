module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  User.associate = (/* models */) => {
    // associations can be defined here
  };
  return User;
};
