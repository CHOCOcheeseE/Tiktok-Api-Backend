const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// Edit Profile
exports.editProfile = async (req, res) => {
    try {
        const { username, email, avatar } = req.body;
        const userId = req.user.id; // Extract user ID from token middleware

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.username = username || user.username;
        user.email = email || user.email;
        user.avatar = avatar || user.avatar;
        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token middleware
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
