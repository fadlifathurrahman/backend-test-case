const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Member = sequelize.define(
  "member",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    penalty_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'members',
    timestamps: false, 
  } 
);

module.exports = Member;
