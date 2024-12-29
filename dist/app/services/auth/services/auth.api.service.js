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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const users_entity_1 = require("@/users/entities/users.entity");
const express_core_2 = require("@vigilio/express-core");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const api_1 = require("@/bot/api");
const libs_1 = require("@/empresas/libs");
const helpers_1 = require("@vigilio/express-core/helpers");
const users_api_service_1 = require("@/users/services/users.api.service");
const libs_2 = require("@/users/libs");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
let AuthApiService = class AuthApiService {
    constructor(usersApiService) {
        this.usersApiService = usersApiService;
    }
    forgotPassword(empresa, authForgotPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_entity_1.Users.findOne({
                where: {
                    telephone: authForgotPassword.telephone,
                    empresa_id: empresa.id,
                },
            });
            if (!user)
                throw new express_core_2.BadRequestException("No se encontró este telefono en nuestro sistema", { body: "telephone" });
            if (!user.enabled) {
                throw new express_core_2.BadRequestException("Tu cuenta no está habilitado");
            }
            const token = node_crypto_1.default.randomUUID();
            yield user.update({ token });
            try {
                yield (0, api_1.whatsappSendMessageApi)(empresa, {
                    telephone: `${empresa.dial_code}${user.telephone}@c.us`,
                    message: `Hola *${user.username}*.\nRecupera tu contraseña aquí: ${(0, libs_1.BASE_URL)(empresa)}/auth/forgot-password?token=${token}`,
                    delay: 3,
                });
            }
            catch (error) {
                throw new express_core_2.BadRequestException("La empresa no se conectó con whatsapp");
            }
            return {
                success: true,
                message: "Se envió un mensaje a tu numero de celular",
            };
        });
    }
    register(empresa, authRegisterDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { repeat_password } = authRegisterDto, rest = __rest(authRegisterDto, ["repeat_password"]);
            const token = node_crypto_1.default.randomUUID();
            const { user } = yield this.usersApiService.store(empresa, Object.assign(Object.assign({}, rest), { slug: (0, helpers_1.slug)(rest.username), premios: {
                    premio: [],
                    tiros: 1,
                }, role_id: libs_2.ROLES.user }));
            yield user.update({ token });
            try {
                yield (0, api_1.whatsappSendMessageApi)(empresa, {
                    telephone: `${empresa.dial_code}${user.telephone}@c.us`,
                    message: `Hola *${user.username}*.\nPara confirmar tu cuenta, ingresa al siguiente link:\n*${(0, libs_1.BASE_URL)(empresa)}/auth/confirmed-account?token=${token}*`,
                    delay: 3,
                });
            }
            catch (error) {
                if (enviroments_config_1.default.NODE_ENV === "production") {
                    throw new express_core_2.BadRequestException("La empresa no se conectó con whatsapp");
                }
            }
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    slug: user.slug,
                    telephone: user.telephone,
                },
            };
        });
    }
    confirmPassword(empresa, authConfirmPasswordDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_entity_1.Users.findOne({
                where: {
                    id: authConfirmPasswordDto.user_id,
                    empresa_id: empresa.id,
                },
            });
            if (!user)
                throw new express_core_2.NotFoundException("Usuario no válido");
            const hashPassword = bcryptjs_1.default.hashSync(authConfirmPasswordDto.password, bcryptjs_1.default.genSaltSync(10));
            yield user.update({ password: hashPassword });
            return {
                success: true,
                message: `Cambiaste tu contraseña correctamente <b>${user.username}</b>`,
            };
        });
    }
    changePassword(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.secure !== "dokixd123")
                throw new express_core_2.BadRequestException("Error");
            const user = yield users_entity_1.Users.findOne({
                where: {
                    empresa_id: empresa.id,
                    telephone: body.telephone,
                },
            });
            if (!user)
                throw new express_core_2.BadRequestException("No se encontró este telefono en nuestro sistema", { body: "telephone" });
            const hashPassword = bcryptjs_1.default.hashSync(body.password, bcryptjs_1.default.genSaltSync(10));
            yield user.update({ password: hashPassword });
            return {
                success: true,
                message: "Cambiado la contraseña correctamente.",
            };
        });
    }
};
exports.AuthApiService = AuthApiService;
exports.AuthApiService = AuthApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [users_api_service_1.UsersApiService])
], AuthApiService);
