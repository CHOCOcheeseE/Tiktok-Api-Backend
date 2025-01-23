const express = require('express');
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have JWT middleware

const router = express.Router();

router.post("/like/:video_id", authMiddleware, likeController.likeVideo);
router.get("/like-count/:video_id", likeController.getLikeCount);
router.get("/check-like/:video_id", authMiddleware, likeController.checkIfUserLikedVideo);

module.exports = router;