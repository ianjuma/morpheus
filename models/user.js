module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    encrypted_pin: DataTypes.STRING,
    date_registered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  return User;
};

