import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authorizeUser = (req, res, next) => {
    console.log("Checking Auth");
    const token = req.cookies.token;
    console.log("Token", token);

    if (!token) {
        console.log("No token");
        return res.status(401).json({
            success: false,
            message: "Access Denied",
        });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_JWT);

        if (!verified) {
            console.log("Token not verified");
            return res.status(401).json({
                success: false,
                message: "Access Denied",
            });
        }
        console.log("Token verified in middleware");

        next();
    } catch (error) {
        console.log("Error in middleware", error);
        return res.status(400).json({
            success: false,
            message: "Invalid Token",
        });
    }
};

export default authorizeUser;
