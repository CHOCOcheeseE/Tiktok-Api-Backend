const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Comment = sequelize.define("Comment", {
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Comment;
