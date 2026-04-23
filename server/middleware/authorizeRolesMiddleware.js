const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal error while verifying roles",
                error: error.message
            });
        }
    };
};

module.exports = authorizeRoles;