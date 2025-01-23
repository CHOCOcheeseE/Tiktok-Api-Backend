const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/edit", authenticate, userController.editProfile);
router.delete("/delete", authenticate, userController.deleteUser);

module.exports = router;
