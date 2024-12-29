"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const main_1 = require("./main");
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!authHeader?.startsWith("Bearer"))
        return res
            .status(401)
            .json({ success: false, message: "error bearer required" });
    if (!token)
        return res
            .status(401)
            .json({ success: false, message: "error bad bearer" });
    if (main_1.VITE_TOKEN_VIGILIO_SERVICES !== token) {
        return res
            .status(403)
            .json({ success: false, message: "Not authorized" });
    }
    next();
}
