module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define(
    'label',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      color: DataTypes.STRING
    },
    { paranoid: true, timestamps: true }
  );
  return Label;
};
