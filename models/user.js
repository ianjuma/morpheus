module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    gender: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['female', 'male', 'undefined'],
      validate: {
        isIn: [['female', 'male', 'undefined']]
      },
      msg: 'Gender is only Male, Female or undefined'
    },
    verification: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['pending','verified'],
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'verified']]
      }
    },
    primary_email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      unique: true
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encrypted_password: DataTypes.STRING,
    salt: DataTypes.STRING,
    date_registered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
  return User;
};

