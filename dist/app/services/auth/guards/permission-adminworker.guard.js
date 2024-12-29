"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionAdminWorker = PermissionAdminWorker;
const express_core_1 = require("@vigilio/express-core");
const libs_1 = require("@/users/libs");
function PermissionAdminWorker() {
    return (target, propertyKey, _descriptor) => {
        (0, express_core_1.attachMiddleware)(target, propertyKey, (req, res, next) => {
            if (req.isAuthenticated()) {
                const user = req.user;
                if (!user || !user.enabled || user.role_id === libs_1.ROLES.user) {
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
