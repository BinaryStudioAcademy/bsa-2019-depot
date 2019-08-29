
module.exports = (sequelize, DataTypes) => {
  const LanguageStats = sequelize.define(
    'languageStats',
    {
      percentage: DataTypes.FLOAT
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return LanguageStats;
};
