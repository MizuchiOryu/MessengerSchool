
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
    }
);

module.exports = Subject;