"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionAdmin = PermissionAdmin;
const express_core_1 = require("@vigilio/express-core");
function PermissionAdmin() {
    return (target, propertyKey, _descriptor) => {
        (0, express_core_1.attachMiddleware)(target, propertyKey, (req, res, next) => {
            if (req.isAuthenticated()) {
                const user = req.user;
                if (!user || !user.enabled || user.role_id !== 1) {
                    return res.status(403).json({
                        success: false,
                        message: "No está permitido realizar esta acción solo admin",
                    });
                }
                return next();
            }
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        });
    };
}
