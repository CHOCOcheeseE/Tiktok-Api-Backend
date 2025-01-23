const User = require("./User");
const Video = require("./Video");
const Comment = require("./Comment");
const Like = require("./Like");

// Relasi: User memiliki banyak Video
User.hasMany(Video, { foreignKey: "user_id" });
Video.belongsTo(User, { foreignKey: "user_id" });

// Relasi: Video memiliki banyak Comment
Video.hasMany(Comment, { foreignKey: "video_id" });
Comment.belongsTo(Video, { foreignKey: "video_id" });

// Relasi: User memiliki banyak Like
User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });

module.exports = { User, Video, Comment, Like };
