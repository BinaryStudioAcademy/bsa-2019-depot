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
      status: DataTypes.STRING,
      deviceToken: DataTypes.STRING,
      // ------------------
      type: DataTypes.ENUM('USER', 'ORG')
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  User.associate = (/* models */) => {
    // associations can be defined here
  };
  return User;
};
