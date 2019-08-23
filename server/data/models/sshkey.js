module.exports = (sequelize, DataTypes) => {
  const SshKey = sequelize.define(
    'sshKey',
    {
      value: DataTypes.STRING,
      title: DataTypes.STRING,
      fingerprint: DataTypes.STRING,
      userId: DataTypes.UUID
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return SshKey;
};
