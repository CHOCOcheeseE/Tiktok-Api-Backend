const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Video = require('../models/Video');

// Upload Video
exports.uploadVideo = async (req, res) => {
    try {
        const { title, description, video_url } = req.body;
        const userId = req.user.id;

        const newVideo = await Video.create({
            user_id: userId,
            title,
            description,
            video_url,
        });

        res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
    } catch (error) {
        res.status(500).json({ message: "Error uploading video", error });
    }
};

// Get All Videos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.findAll();
        res.status(200).json({ videos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error });
    }
};

// Get Video Details
exports.getVideoDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findByPk(id);

        if (!video) return res.status(404).json({ message: "Video not found" });

        res.status(200).json({ video });
    } catch (error) {
        res.status(500).json({ message: "Error fetching video details", error });
    }
};

// Update Video
exports.updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, video_url } = req.body;

        const video = await Video.findByPk(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        video.title = title || video.title;
        video.description = description || video.description;
        video.video_url = video_url || video.video_url;
        await video.save();

        res.status(200).json({ message: "Video updated successfully", video });
    } catch (error) {
        res.status(500).json({ message: "Error updating video", error });
    }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findByPk(id);
        if (!video) return res.status(404).json({ message: "Video not found" });

        await video.destroy();
        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting video", error });
    }
};

// Get Videos by User
exports.getVideosByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const videos = await Video.findAll({ where: { user_id: userId } });

        if (videos.length === 0) return res.status(404).json({ message: "No videos found for this user" });

        res.status(200).json({ videos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos by user", error });
    }
};

// Get video count
exports.getVideoCount = async (req, res) => {
    try {
        const videoCount = await Video.count(); // Menghitung jumlah video
        res.status(200).json({
            message: 'Video count retrieved successfully',
            count: videoCount,
        });
    } catch (error) {
        console.error('Error fetching video count:', error);
        res.status(500).json({
            message: 'Error fetching video count',
            error: error.message,
        });
    }
};


// Get Trending Videos
exports.getTrendingVideos = async (req, res) => {
    try {
        // Ambil video berdasarkan jumlah likes terbanyak
        const trendingVideos = await Video.findAll({
            attributes: {
                include: [
                    [
                        // Subquery untuk menghitung jumlah likes
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM Likes AS like
                            WHERE like.video_id = Video.id
                        )`),
                        'likeCount',
                    ],
                ],
            },
            order: [[sequelize.literal('likeCount'), 'DESC']], // Urutkan berdasarkan likeCount
            limit: 10, // Misalnya, ambil 10 video saja
        });

        res.status(200).json({
            message: 'Trending videos retrieved successfully',
            videos: trendingVideos,
        });
    } catch (error) {
        console.error('Error fetching trending videos:', error);
        res.status(500).json({
            message: 'Error fetching trending videos',
            error: error.message,
        });
    }
};
