const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/upload", authenticate, videoController.uploadVideo);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoDetails);
router.put("/:id", authenticate, videoController.updateVideo);
router.delete("/:id", authenticate, videoController.deleteVideo);
router.get("/user/:userId", videoController.getVideosByUser); 
router.get("/stats/count", videoController.getVideoCount);


module.exports = router;
