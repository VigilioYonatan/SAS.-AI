"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const auth_service_1 = require("../services/auth.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const libs_1 = require("@/empresas/libs");
const CLIENT_ID = "1957086741385823";
const CLIENT_SECRET = "94dff236a11b006bc4b215bf5c2d4fa6";
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    facebook(empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const REDIRECT_URI = `${(0, libs_1.BASE_URL)(empresa)}/auth/facebook/callback`;
            const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_messaging,pages_read_engagement`;
            res.redirect(fbAuthUrl);
        });
    }
    facebookCallback(empresa, code, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!code) {
                return res.status(400).send("No authorization code provided.");
            }
            const REDIRECT_URI = `${(0, libs_1.BASE_URL)(empresa)}/auth/facebook/callback`;
            try {
                const tokenResponse = yield fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${CLIENT_SECRET}`);
                const tokenResult = yield tokenResponse.json();
                const accessToken = tokenResult.data.access_token;
                res.send({ accessToken });
            }
            catch (error) {
                console.error("Error al obtener el token de acceso:", error.message);
                res.status(500).send("Error al obtener el token de acceso.");
            }
        });
    }
    profile(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render("auth/profile", { user });
        });
    }
    register(res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render("auth/register", {
                title: "Registrarse",
                description: "Unete a nosotros, Registraste ahora.",
            });
        });
    }
    login(res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render("auth/login", {
                title: "Iniciar sesión",
                description: "Bienvenido a",
            });
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        });
    }
    changePassword(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.query.token;
            const empresa = req.empresa;
            const result = yield this.authService.forgotPassword(empresa, token);
            return res.render("auth/forgot-password", result);
        });
    }
    confirmedAccount(res, token, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authService.confirmedAccount(empresa, token);
            return res.render("auth/confirmed-account", result);
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, express_core_2.Get)("/facebook"),
    __param(0, (0, express_core_2.Req)("empresa")),
    __param(1, (0, express_core_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebook", null);
__decorate([
    (0, express_core_2.Get)("/facebook/callback"),
    __param(0, (0, express_core_2.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("code")),
    __param(2, (0, express_core_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookCallback", null);
__decorate([
    (0, express_core_2.Get)("/profile", [auth_middleware_1.authAuthenticatedMiddleware]),
    __param(0, (0, express_core_2.Res)()),
    __param(1, (0, express_core_2.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "profile", null);
__decorate([
    (0, express_core_2.Get)("/register", [auth_middleware_1.authNoAuthenticatedMiddleware]),
    __param(0, (0, express_core_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, express_core_2.Get)("/login", [auth_middleware_1.authNoAuthenticatedMiddleware]),
    __param(0, (0, express_core_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, express_core_2.Get)("/logout", [auth_middleware_1.authAuthenticatedMiddleware]),
    __param(0, (0, express_core_2.Req)()),
    __param(1, (0, express_core_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, express_core_2.Get)("/forgot-password"),
    __param(0, (0, express_core_2.Res)()),
    __param(1, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, express_core_2.Get)("/confirmed-account"),
    __param(0, (0, express_core_2.Res)()),
    __param(1, (0, express_core_1.Query)("token")),
    __param(2, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmedAccount", null);
exports.AuthController = AuthController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
