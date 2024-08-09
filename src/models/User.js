const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
// In capital letters and singular      // In lowercase and singular
const User = sequelize.define("user", {
  // we define the columns here
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  country: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
