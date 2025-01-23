// db.js
const { Sequelize } = require("sequelize");

// Sesuaikan nama database, username, password, dan host dengan konfigurasi Anda
const sequelize = new Sequelize("TikTokDB", "root", "", {
    host: "localhost",
    dialect: "mysql", // Sesuaikan dengan database Anda
});

sequelize.authenticate()
    .then(() => console.log("Database connected..."))
    .catch(err => console.error("Error connecting to database:", err));

module.exports = sequelize;
