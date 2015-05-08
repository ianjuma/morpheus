module.exports = function(sequelize, DataTypes) {
  var Airtime = sequelize.define('Airtime', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_sent: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'PENDING',
      values: ['SUCCESS', 'FAIL', 'PENDING'],
      validate: {
        isIn: [['SUCCESS', 'FAIL', 'PENDING']]
      }
    }
  }, {
    underscored: true
  });

  return Airtime;
};
