const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Like = sequelize.define("Like", {
    video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Video",
            key: "id",
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        }
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps: true,
});

module.exports = Like;
