"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authNoAuthenticatedMiddleware = authNoAuthenticatedMiddleware;
exports.authAuthenticatedMiddleware = authAuthenticatedMiddleware;
exports.authDashboardPermissionMiddleware = authDashboardPermissionMiddleware;
const libs_1 = require("@/users/libs");
function authNoAuthenticatedMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            return res.redirect("/");
        }
        next();
    });
}
function authAuthenticatedMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.redirect("/auth/login");
        }
        next();
    });
}
function authDashboardPermissionMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.redirect("/auth/login");
        }
        const user = req.user;
        if (!user.enabled || user.role_id === libs_1.ROLES.user) {
            return res.redirect("/");
        }
        next();
    });
}
