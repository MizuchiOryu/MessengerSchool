const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");

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


module.exports = Subject;