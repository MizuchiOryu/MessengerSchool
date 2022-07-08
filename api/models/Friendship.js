const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");

class Friendship extends Model {}

Friendship.init(
  {
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "friendship",
  }
);

module.exports = Friendship;
