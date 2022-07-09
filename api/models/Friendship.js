const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");

const Message = require('./Message')

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

Friendship.hasMany(Message, {
  foreignKey: {
    name: 'friendshipId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
})

module.exports = Friendship;
