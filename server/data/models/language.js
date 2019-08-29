module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define(
    'language',
    {
      name: DataTypes.STRING,
      color: DataTypes.STRING
    }
  );
  return Language;
};
