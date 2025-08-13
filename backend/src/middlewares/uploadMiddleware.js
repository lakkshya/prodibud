const multer = require("multer");

// store in memory to directly pass buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
