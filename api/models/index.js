exports.sequelize = require("./db");
exports.Friendship = require("./Friendship");
exports.Message = require("./Message");
exports.User = require("./User");

exports.User.hasMany(exports.Friendship, {
  foreignKey: {
    name: '_user',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

exports.User.hasMany(exports.Friendship, {
  foreignKey: {
    name: 'friend',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});
