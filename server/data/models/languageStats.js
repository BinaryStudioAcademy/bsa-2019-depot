module.exports = (sequelize, DataTypes) => {
  const LanguageStats = sequelize.define(
    'languageStats',
    {
      percentage: DataTypes.FLOAT
    },
    {
      paranoid: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['branchId', 'languageId']
        }
      ]
    }
  );
  return LanguageStats;
};
