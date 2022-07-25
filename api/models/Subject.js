const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
const User = require('./User')

class Subject extends Model { }

Subject.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    min: 2,
                },
            },
        }
    },
    {
      sequelize,
      modelName: "subject",
    }
);


Subject.belongsToMany(User, {
    through: "user_tag",
    as: "users",
    foreignKey: "subject_id",
});


User.belongsToMany(Subject, {
    through: "user_tag",
    as: "tags",
    foreignKey: "user_id",
});

// Subject.belongsToMany(User, {
//     through: "user_tag",
//     as: "users",
//     foreignKey: "user_id",
// });

module.exports = Subject;