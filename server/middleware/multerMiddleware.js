const multer = require("multer");

// Storage settings
const storage = multer.diskStorage({
    // कहाँ store करना है
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    // file name क्या होगा
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
// Initialize multer with storage settings
const upload = multer({ storage });

module.exports = upload;