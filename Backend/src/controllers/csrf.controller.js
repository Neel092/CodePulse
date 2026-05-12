import crypto from "crypto"

export const getCSRFToken = (req, res) => {

    const csrfToken = crypto.randomBytes(32).toString('hex');

    res.cookie("csrfToken", csrfToken, {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "lax"
    });

    res.status(200).json({ csrfToken });


};