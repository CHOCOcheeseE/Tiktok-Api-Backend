const Like = require("../models/Like");
const Video = require("../models/Video");
const Comment = require("../models/Comment");
const User = require("../models/User");

// Menambahkan komentar pada video
exports.addComment = async (req, res) => {
    try {
        const videoId = req.params.video_id;
        const userId = req.user.id;
        const { content } = req.body;

        // Cek apakah video ada
        const video = await Video.findByPk(videoId);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Tambahkan komentar
        const comment = await Comment.create({
            user_id: userId,
            video_id: videoId,
            content: content
        });

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: "Error adding comment", error });
    }
};

// Mengambil semua komentar pada video
exports.getCommentsByVideo = async (req, res) => {
    try {
        const videoId = req.params.video_id;

        // Cek apakah video ada
        const video = await Video.findByPk(videoId);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Ambil semua komentar video
        const comments = await Comment.findAll({
            where: { video_id: videoId },
            include: [{ model: User, attributes: ['username', 'avatar'] }]  // Include user info
        });

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ message: "Error getting comments", error });
    }
};

// Menghapus komentar
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;

        // Cek apakah komentar ada
        const comment = await Comment.findByPk(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Cek apakah user adalah pemilik komentar
        if (comment.user_id !== userId) {
            return res.status(403).json({ message: "You can only delete your own comment" });
        }

        // Hapus komentar
        await comment.destroy();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: "Error deleting comment", error });
    }
};

// Mengambil komentar berdasarkan ID
exports.getCommentById = async (req, res) => {
    try {
        const commentId = req.params.id;

        // Cek apakah komentar ada
        const comment = await Comment.findByPk(commentId, {
            include: [{ model: User, attributes: ['username', 'avatar'] }]  // Include user info
        });
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json({ comment });
    } catch (error) {
        console.error('Error getting comment:', error);
        res.status(500).json({ message: "Error getting comment", error });
    }
};

// Mengedit komentar
exports.editComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { content } = req.body;
        const userId = req.user.id;

        // Cek apakah komentar ada
        const comment = await Comment.findByPk(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Cek apakah user adalah pemilik komentar
        if (comment.user_id !== userId) {
            return res.status(403).json({ message: "You can only edit your own comment" });
        }

        // Update komentar
        comment.content = content;
        await comment.save();

        res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ message: "Error editing comment", error });
    }
};
// Mengambil jumlah komentar pada video
exports.getCommentCount = async (req, res) => {
    try {
        const videoId = req.params.video_id;

        // Cek apakah video ada
        const video = await Video.findByPk(videoId);
        if (!video) return res.status(404).json({ message: "Video not found" });

        // Hitung jumlah komentar pada video
        const commentCount = await Comment.count({ where: { video_id: videoId } });

        res.status(200).json({ commentCount });
    } catch (error) {
        console.error('Error getting comment count:', error);
        res.status(500).json({ message: "Error getting comment count", error });
    }
};