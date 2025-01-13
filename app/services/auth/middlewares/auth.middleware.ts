import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "../types";
import { ROLES } from "@/users/libs";

export async function authNoAuthenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // if user is authenticated that redirect in home
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}
export async function authAuthenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // if user is not authenticated that redirect in login
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/login");
    }
    next();
}
export async function authDashboardPermissionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const referer = req.originalUrl as string;

    if (!req.isAuthenticated()) {
        return res.redirect(`/auth/login?referer=${referer}`);
    }
    const user = req.user as AuthUser;

    // only admin,modifiers,workers
    if (!user.enabled || user.role_id === ROLES.user) {
        return res.redirect("/");
    }

    next();
}
