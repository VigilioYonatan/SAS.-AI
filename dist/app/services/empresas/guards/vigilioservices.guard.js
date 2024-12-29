"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VigilioServicesGuard = VigilioServicesGuard;
const express_core_1 = require("@vigilio/express-core");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
function VigilioServicesGuard() {
    return (target, propertyKey, _descriptor) => {
        (0, express_core_1.attachMiddleware)(target, propertyKey, (req, res, next) => {
            const token = req.headers["access-token"];
            if (!token) {
                return res
                    .status(404)
                    .json({ success: false, message: "required token" });
            }
            if (token !== enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES) {
                return res.status(403).json({ success: false, message: "bad token" });
            }
            next();
        });
    };
}
