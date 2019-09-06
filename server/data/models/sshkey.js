module.exports = (sequelize, DataTypes) => {
  const SshKey = sequelize.define(
    'sshKey',
    {
      value: DataTypes.STRING,
      title: DataTypes.STRING,
      fingerprint: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return SshKey;
};
