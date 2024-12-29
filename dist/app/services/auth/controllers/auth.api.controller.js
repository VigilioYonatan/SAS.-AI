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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApiController = void 0;
const passport_1 = __importDefault(require("passport"));
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const auth_confirm_password_dto_1 = require("../dtos/auth.confirm-password.dto");
const auth_api_service_1 = require("../services/auth.api.service");
const auth_forgot_password_dto_1 = require("../dtos/auth.forgot-password.dto");
const valibot_1 = require("@vigilio/express-core/valibot");
const vigilioservices_guard_1 = require("@/empresas/guards/vigilioservices.guard");
const valibot_2 = require("@vigilio/valibot");
const auth_register_dto_1 = require("../dtos/auth.register.dto");
let AuthApiController = class AuthApiController {
    constructor(authApiService) {
        this.authApiService = authApiService;
    }
    login() { }
    forgotPassword(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authApiService.forgotPassword(empresa, body);
            return result;
        });
    }
    register(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authApiService.register(empresa, body);
            return result;
        });
    }
    confirmPassword(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authApiService.confirmPassword(empresa, body);
            return result;
        });
    }
    changePassword(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authApiService.changePassword(empresa, body);
            return result;
        });
    }
};
exports.AuthApiController = AuthApiController;
__decorate([
    (0, express_core_1.Post)("/login", [
        (req, res, next) => {
            passport_1.default.authenticate("local", (err, user, message) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json(Object.assign({ success: false }, message));
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.status(200).json({
                        success: true,
                        user,
                    });
                });
            })(req, res, next);
        },
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthApiController.prototype, "login", null);
__decorate([
    (0, valibot_1.Validator)(auth_forgot_password_dto_1.authForgotPasswordDto),
    (0, express_core_1.Post)("/forgot-password"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], AuthApiController.prototype, "forgotPassword", null);
__decorate([
    (0, valibot_1.Validator)(auth_register_dto_1.authRegisterDto),
    (0, express_core_1.Post)("/register"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], AuthApiController.prototype, "register", null);
__decorate([
    (0, valibot_1.Validator)(auth_confirm_password_dto_1.authConfirmPasswordDto),
    (0, express_core_1.Put)("/confirm-password"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], AuthApiController.prototype, "confirmPassword", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Validator)((0, valibot_2.objectAsync)({
        password: (0, valibot_2.string)(),
        telephone: (0, valibot_2.string)(),
        secure: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Post)("/change-password"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], AuthApiController.prototype, "changePassword", null);
exports.AuthApiController = AuthApiController = __decorate([
    (0, express_core_2.Injectable)(),
    (0, express_core_1.Controller)("/auth"),
    __metadata("design:paramtypes", [auth_api_service_1.AuthApiService])
], AuthApiController);
