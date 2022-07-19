exports.sequelize = require("./db");
exports.Friendship = require("./Friendship");
exports.Message = require("./Message");
exports.User = require("./User");
exports.Report = require("./Report");

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

exports.User.hasOne(exports.Message, {
  foreignKey: {
    name: 'owner',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

exports.User.hasMany(exports.Report, {
  foreignKey: {
    name: 'reporter',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

exports.User.hasMany(exports.Report, {
  foreignKey: {
    name: 'target',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});
