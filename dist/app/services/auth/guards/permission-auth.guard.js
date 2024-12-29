"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionAuth = PermissionAuth;
const express_core_1 = require("@vigilio/express-core");
function PermissionAuth() {
    return (target, propertyKey, _descriptor) => {
        (0, express_core_1.attachMiddleware)(target, propertyKey, (req, res, next) => {
            if (req.isAuthenticated()) {
                const user = req.user;
                if (!user || !user.enabled) {
                    return res.status(403).json({
                        success: false,
                        message: "No está permitido realizar esta acción, por  estar desabilitado",
                    });
                }
                req.user = user;
                return next();
            }
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        });
    };
}
