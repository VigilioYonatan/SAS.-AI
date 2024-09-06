import type { NextFunction, Request, Response } from "express";
import { VITE_TOKEN_VIGILIO_SERVICES } from "./main";

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!authHeader?.startsWith("Bearer"))
        return res.status(401).json({ success: false, message: "error" });

    if (!token)
        return res.status(401).json({ success: false, message: "error" });
    if (VITE_TOKEN_VIGILIO_SERVICES !== token) {
        return res
            .status(403)
            .json({ success: false, message: "Not authorized" });
    }
    next();
}
