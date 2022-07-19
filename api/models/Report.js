const { DataTypes, Model } = require("sequelize");
const sequelize = require("./db");
const User = require("./User");

class Report extends Model { }

Report.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isClosed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },
    {
        sequelize,
        modelName: "report",
    }
);

module.exports = Report;