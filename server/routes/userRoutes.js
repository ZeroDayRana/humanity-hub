const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { registerUser, loginUser, getUserProfile, updateUser, deleteUser, forgotPassword, resetPassword } = require("../controllers/userController");
const router = express.Router();
router.post("/register", registerUser); // register user
router.post("/login", loginUser); // login user
router.get("/profile", authMiddleware, getUserProfile); // get user profile after authentication
router.patch("/profile", updateUser); // update user
router.delete("/profile", deleteUser); // delete user
router.post("/forgot-password", forgotPassword); // forgot password
router.post("/reset-password/:token", resetPassword); // reset password

module.exports = router