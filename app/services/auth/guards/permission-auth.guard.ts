import { attachMiddleware } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { type AuthUser } from "../types";

export function PermissionAuth() {
    return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        target: any,
        propertyKey: string,
        _descriptor: PropertyDescriptor
    ) => {
        attachMiddleware(
            target,
            propertyKey,
            (req: Request, res: Response, next: NextFunction) => {
                // local
                if (req.isAuthenticated()) {
                    const user = req.user as AuthUser;
                    if (!user || !user.enabled) {
                        return res.status(403).json({
                            success: false,
                            message:
                                "No está permitido realizar esta acción, por  estar desabilitado",
                        });
                    }
                    req.user = user;
                    return next();
                }
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
        );
    };
}
