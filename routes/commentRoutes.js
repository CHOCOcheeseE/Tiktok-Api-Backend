const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const commentController = require("../controllers/commentController");

// Menambahkan komentar pada video
router.post("/comment/:video_id", authenticate, commentController.addComment);
router.get("/comment/:video_id", authenticate, commentController.getCommentsByVideo);
router.delete("/comment/del/:id", authenticate, commentController.deleteComment);
router.get("/comments/comment/:id", authenticate, commentController.getCommentById);
router.put("/comment/edit/:id", authenticate, commentController.editComment);
router.get("/comment-count/:video_id", authenticate, commentController.getCommentCount);
module.exports = router;