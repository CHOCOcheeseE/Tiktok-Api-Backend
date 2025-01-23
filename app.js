const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const User = require("./models/User");
const Video = require("./models/Video");
const Comment = require("./models/Comment");
const Like = require("./models/Like");

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use(express.json());

// Rute
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api', likeRoutes);
app.use('/api', commentRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Relasi antar tabel
User.hasMany(Video, { foreignKey: "user_id" });
Video.belongsTo(User, { foreignKey: "user_id" });

Video.hasMany(Comment, { foreignKey: "video_id" });
Comment.belongsTo(Video, { foreignKey: "video_id" });

User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

Video.hasMany(Like, { foreignKey: "video_id" });
Like.belongsTo(Video, { foreignKey: "video_id" });

User.hasMany(Like, { foreignKey: "user_id" });
Like.belongsTo(User, { foreignKey: "user_id" });

(async () => {
    try {
        await sequelize.sync();
        console.log("Database & tables synced!");
    } catch (error) {
        console.error("Error syncing database:", error);
    }
})();