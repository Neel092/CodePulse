import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {

    // 1. Read header
    // 2. Check exists
    // 3. Extract token
    // 4. Verify token
    // 5. Attach user to req
    // 6. next()
    // 7. else → 401
    try {

        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;

        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {
        try {

            if (!req.user || !req.user.role) {
                return res.status(403).json({ messsage: "Access denied" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden : insufficient role" });
            }

            next();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}