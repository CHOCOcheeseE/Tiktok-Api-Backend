const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Video = sequelize.define("Video", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Video;
