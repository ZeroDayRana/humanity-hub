const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check if header exists
        if(!authHeader) {
            console.log("🚫 Missing Authorization header", req.headers);
            return res.status(401).json({success: false, message: "Authorization header not found"});
        }

        // 3. Extract token (Bearer <token>)
        const token = authHeader.split(" ")[1];

        // 4. Check if token exists
        if(!token) {
            return res.status(401).json({success: false, message: "Token not found"});
        }

         // 5. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // 6. Attach user to request
        req.user = decoded;

        // 7. Move to next middleware/controller    
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Invalid or expired token"});
    }
}     

module.exports =  authMiddleware ;
