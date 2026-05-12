
export const verifyCSRF = (req, res, next) => {

    try {

        const tokenFromHeader = req.headers['x-csrf-token'];
        const tokenFromCookies = req.cookies.csrfToken;


        if (!tokenFromCookies || !tokenFromHeader) {
            return res.status(403).json({ message: "csrf token is missing" });
        }

        if (tokenFromHeader !== tokenFromCookies) {
            return res.status(403).json({ message: "Invalid CSRF token" });
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}