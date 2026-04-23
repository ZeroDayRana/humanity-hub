const { User, Campaign, Donation } = require('../models/Relationship');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const sequelize = require('../config/db');
const crypto = require("crypto");
// const { sendResetEmail } = require('../services/nodemailerService');

// For User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //1. Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        //2. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        //3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //4. Create new user
        const newUser = await User.create({ name, email, password: hashedPassword });

        //5. Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET_KEY, { expiresIn: '1h' }
        );

        //6. Send response
        res.status(201).json({ success: true, message: "User registered successfully", data: newUser, token: token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "User registration failed", error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //1. Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        //2. Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        //3. Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        //4. Generate JWT token
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        //5. Send response      
        res.status(200).json({ success: true, message: "User logged in successfully", data: user, token: token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "User login failed", error: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        // 1. Get user id from token (set by authMiddleware)
        const userId = req.user.id;

        // 2. Find user in database
        const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] }); // exclude password

        // 3. Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // 4. Find campaigns and total amount user has donated to
        const campaigns = await Campaign.findAll({
            include: {
                model: Donation,
                where: { userId },
                attributes: [],
            },
            attributes: [
                'id',
                'title',
                [sequelize.fn('SUM', sequelize.col('Donations.amount')), 'totalDonated']
            ],
            group: ['Campaign.id', 'Campaign.title']
        });
        // 4. Send response
        return res.status(200).json({ success: true, message: "Profile fetched successfully", data: user, campaigns: campaigns });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Profile fetch failed", error: error.message });
    }
};


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        //1. Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        //2. Check if update data is valid
        const allowedFields = ["name", "email", "password"];
        const updates = Object.keys(updateData);
        const isValid = updates.every((field) => allowedFields.includes(field)); // returns true or false
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid update fields" });
        }

        //3. Check if email is updated
        if (updateData.email) {
            const existingUser = await User.findOne({ where: { email: updateData.email } });
            if (existingUser && existingUser.id != id) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
        }

        // 4. If password is updated → hash it
        if (updateData.password) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }

        //5. Update user to database
        await user.update(updateData);

        return res.status(200).json({ success: true, message: "User updated successfully", data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: "User update failed", error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "User deletion failed", error: error.message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // send email (nodemailer)
        // console.log(resetLink);
        // 👉 CALL EMAIL FUNCTION HERE
        // await sendResetEmail(user.email, token);

        // res.json({ message: "Reset link sent" });
        return res.status(200).json({ success: true, message: "Reset link sent", link: resetLink });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ success: false, message: "Password reset failed", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password: newPassword } = req.body;

        //1. Validation 
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: { [Op.gt]: Date.now() },
            },
        });

        //2. Check if token is valid
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        //3. Check if new password is same as old password
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({
                message: "New password cannot be same as old password"
            });
        }

        //4. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        // await sendResetEmail(user.email, token);
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ success: false, message: "Password reset failed", error: error.message });
    }
};

// For Admin/SuperAdmin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
    }
}

const makeAdmin = async (req, res) => {
    try {
        // Get user id from params users/:id/make-admin
        const { id } = req.params;

        // Prevent self role change 
        if (req.user.id == Number(id)) {
            return res.status(400).json({
                message: "You cannot change your own role"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: "User already admin" });
        }

        user.role = 'admin';
        await user.save();

        res.json({ message: "User promoted to admin" });

    } catch (error) {
        res.status(500).json({
            message: "Error promoting user",
            error: error.message
        });
    }
};

const removeAdmin = async (req, res) => {
    try {
        // Get user id from params users/:id/remove-admin
        const { id } = req.params;

        // Prevent self role change
        if (req.user.id == Number(id)) {
            return res.status(400).json({
                message: "You cannot change your own role"
            });
        }

        // Prevent removing last admin
        const adminCount = await User.count({ where: { role: 'admin' } });

        if (adminCount <= 1) {
            return res.status(400).json({
                message: "Cannot remove the last admin"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'user') {
            return res.status(400).json({ message: "User is not an admin" });
        }

        user.role = 'user';
        await user.save();

        res.json({ message: "Admin role removed" });

    } catch (error) {
        res.status(500).json({
            message: "Error removing admin",
            error: error.message
        });
    }
};

const banUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Only superadmin can ban
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({
                message: "Only superadmin can ban users"
            });
        }

        // Prevent self-ban
        if (req.user.id == Number(id)) {
            return res.status(400).json({
                message: "You cannot ban yourself"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Optional safety
        if (user.role === 'superadmin') {
            return res.status(400).json({
                message: "Cannot ban another superadmin"
            });
        }

        if (user.status === 'banned') {
            return res.status(400).json({
                message: "User is already banned"
            });
        }

        user.status = 'banned';
        await user.save();

        res.json({
            message: "User has been banned successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error banning user",
            error: error.message
        });
    }
};

const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'superadmin') {
            return res.status(403).json({
                message: "Only superadmin can unban users"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.status !== 'banned') {
            return res.status(400).json({
                message: "User is not banned"
            });
        }

        user.status = 'active';
        await user.save();

        res.json({
            message: "User has been unbanned successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error unbanning user",
            error: error.message
        });
    }
};

const suspendUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Only superadmin
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({
                message: "Only superadmin can suspend users"
            });
        }

        // Prevent self suspend
        if (req.user.id == Number(id)) {
            return res.status(400).json({
                message: "You cannot suspend yourself"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Prevent suspending superadmin
        if (user.role === 'superadmin') {
            return res.status(400).json({
                message: "Cannot suspend another superadmin"
            });
        }

        if (user.status === 'suspended') {
            return res.status(400).json({
                message: "User is already suspended"
            });
        }

        user.status = 'suspended';
        await user.save();

        res.json({
            message: "User has been suspended"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error suspending user",
            error: error.message
        });
    }
};

const unsuspendUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== 'superadmin') {
            return res.status(403).json({
                message: "Only superadmin can unsuspend users"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.status !== 'suspended') {
            return res.status(400).json({
                message: "User is not suspended"
            });
        }

        user.status = 'active';
        await user.save();

        res.json({
            message: "User has been unsuspended"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error unsuspending user",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    makeAdmin,
    removeAdmin,
    banUser,
    unbanUser,
    suspendUser,
    unsuspendUser
};