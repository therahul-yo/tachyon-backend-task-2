module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending','in-progress','done'),
      defaultValue: 'pending'
    },
    dueDate: DataTypes.DATEONLY,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  return Task;
};
