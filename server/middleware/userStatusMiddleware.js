const userStatusMiddleware = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.status === 'banned') {
            return res.status(403).json({
                message: "Your account has been banned"
            });
        }

        if (user.status === 'suspended') {
            return res.status(403).json({
                message: "Your account has been suspended"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Error checking user status",
            error: error.message
        });
    }
};

module.exports = userStatusMiddleware;