const Like = require("../models/Like");
const Video = require("../models/Video");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Like Video

exports.likeVideo = async (req, res) => {
    try {
        const videoId = req.params.video_id;  // Mendapatkan video ID dari URL
        const userId = req.user.id;  // Mendapatkan user ID dari middleware authenticate

        // Cek apakah video ada
        const video = await Video.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Cek apakah pengguna ada
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cek apakah user sudah memberikan like pada video ini
        const existingLike = await Like.findOne({ where: { user_id: userId, id: videoId } });  // Gunakan 'id' sebagai referensi video
        if (existingLike) {
            // Jika sudah ada like, maka unlike
            await existingLike.destroy();
            return res.status(200).json({ message: "Video unliked successfully" });
        } else {
            // Jika belum ada like, maka create like baru
            await Like.create({ user_id: userId, id: videoId });  // Gunakan 'id' sebagai referensi video
            return res.status(200).json({ message: "Video liked successfully" });
        }
    } catch (error) {
        console.error('Error liking video:', error);
        res.status(500).json({ message: "Error liking video", error });
    }
};

// Get Like Count

exports.getLikeCount = async (req, res) => {
    try {
        const videoId = req.params.video_id;  // Mendapatkan video ID dari parameter URL

        // Cek apakah video ada
        const video = await Video.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Hitung jumlah like pada video ini
        const likeCount = await Like.count({ where: { id: videoId } });  // 'id' digunakan sebagai referensi video
        return res.status(200).json({ likeCount });
    } catch (error) {
        console.error('Error fetching like count:', error);
        res.status(500).json({ message: "Error fetching like count", error });
    }
};

// check if video is liked by user
exports.checkIfUserLikedVideo = async (req, res) => {
    try {
        const videoId = req.params.video_id;  // Mendapatkan video ID dari parameter URL
        const userId = req.user.id;  // Mendapatkan user_id dari data yang terdapat dalam request (dari token JWT)

        // Cek apakah video ada
        const video = await Video.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Cek apakah pengguna sudah memberi like pada video ini
        const like = await Like.findOne({ where: { video_id: videoId, user_id: userId } });

        if (like) {
            return res.status(200).json({ message: "User has liked this video" });
        } else {
            return res.status(200).json({ message: "User has not liked this video" });
        }

    } catch (error) {
        console.error('Error checking if user liked video:', error);
        res.status(500).json({ message: "Error checking if user liked video", error });
    }
};