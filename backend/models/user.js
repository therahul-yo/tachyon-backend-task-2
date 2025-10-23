module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: DataTypes.STRING,
    provider: { type: DataTypes.STRING, defaultValue: 'local' },
    providerId: DataTypes.STRING
  }, { timestamps: true });
  return User;
};
