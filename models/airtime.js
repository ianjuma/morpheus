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
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'WAIT',
      values: ['SUCCESS', 'FAIL', 'WAIT'],
      validate: {
        isIn: [['SUCESS', 'FAIL', 'WAIT']]
      }
    }
  }, {
    underscored: true,
    classMethods: {
      underscored: true,
      associate: function(models) {
        Airtime.belongsTo(models.User, { foreignKey: 'id' });
      }
    }
  });

  return Airtime;
};
