module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      //------------------
      name: DataTypes.STRING,
      bio: DataTypes.STRING,
      url: DataTypes.STRING,
      company: DataTypes.STRING,
      location: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      // ------------------
      type: DataTypes.ENUM('USER', 'ORG'),
      fake: DataTypes.BOOLEAN
    },
    {}
  );
  User.associate = (/* models */) => {
    // associations can be defined here
  };
  return User;
};
