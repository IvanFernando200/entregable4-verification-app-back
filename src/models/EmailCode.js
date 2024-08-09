const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");
// In capital letters and singular      // In lowercase and singular
const EmailCode = sequelize.define("emailCode", {
  // we define the columns here
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // userId
});

module.exports = EmailCode;
