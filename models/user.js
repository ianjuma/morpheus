module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encrypted_password: DataTypes.STRING,
    date_registered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  return User;
};

