"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsersApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const users_entity_1 = require("../entities/users.entity");
const express_core_2 = require("@vigilio/express-core");
const helpers_1 = require("@/uploads/libs/helpers");
const helpers_2 = require("~/libs/helpers");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
let UsersApiService = class UsersApiService {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield users_entity_1.Users.scope("hiddePassword").findAll();
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = null;
            if (!Number.isNaN(Number(slug))) {
                user = yield users_entity_1.Users.scope("hiddePassword").findOne({
                    where: {
                        id: slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            else {
                user = yield users_entity_1.Users.scope("hiddePassword").findOne({
                    where: {
                        slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!user) {
                throw new express_core_2.NotFoundException(`No se encontró un usuario con ${slug}`);
            }
            return {
                success: true,
                user,
            };
        });
    }
    store(empresa, usersStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new users_entity_1.Users(Object.assign(Object.assign({}, usersStoreDto), { enabledNotification: true, empresa_id: empresa.id }));
            user.user_code = yield (0, helpers_2.generateCodeEntity)(users_entity_1.Users, "user_code", "USER", empresa);
            user.password = bcryptjs_1.default.hashSync(usersStoreDto.password, bcryptjs_1.default.genSaltSync(10));
            yield user.save();
            return {
                success: true,
                user,
            };
        });
    }
    update(empresa, id, usersUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield this.show(empresa, id);
            const [adminSuper, existOtherBot] = yield Promise.all([
                users_entity_1.Users.findOne({
                    order: [["id", "ASC"]],
                    attributes: ["id"],
                    where: { empresa_id: empresa.id },
                }),
                users_entity_1.Users.findOne({
                    attributes: ["id", "isBot", "username"],
                    where: {
                        empresa_id: empresa.id,
                        isBot: true,
                        [sequelize_1.Op.not]: {
                            id,
                        },
                    },
                }),
            ]);
            if (existOtherBot && usersUpdateDto.isBot) {
                throw new express_core_2.BadRequestException(`Solo puede haber un bot usuario ${existOtherBot.username}`);
            }
            if (user.id === (adminSuper === null || adminSuper === void 0 ? void 0 : adminSuper.id))
                throw new express_core_2.BadRequestException("No se puede editar al administrador");
            yield user.update(usersUpdateDto);
            return {
                success: true,
                user,
            };
        });
    }
    changePassword(empresa, body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.newPassword !== body.repeatNewPassword) {
                throw new express_core_2.BadRequestException("Contraseña no similares", {
                    body: "repeatNewPassword",
                });
            }
            const findUser = yield users_entity_1.Users.findOne({
                where: { id: user.id, empresa_id: empresa.id },
                attributes: ["password", "id", "empresa_id"],
            });
            if (!findUser)
                throw new express_core_2.InternalServerErrorException("Error de servidor");
            if (!bcryptjs_1.default.compareSync(body.passwordActual, findUser.password)) {
                throw new express_core_2.BadRequestException("Contraseña incorrecta", {
                    body: "passwordActual",
                });
            }
            user.password = bcryptjs_1.default.hashSync(body.repeatNewPassword, bcryptjs_1.default.genSaltSync(10));
            yield user.save();
            return {
                success: true,
                message: "Se cambió la contraseña correctamente",
            };
        });
    }
    profile(empresa, usersProfileDto, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [byEmail, byTelephone] = yield Promise.all([
                users_entity_1.Users.findOne({
                    where: {
                        email: usersProfileDto.email,
                        empresa_id: empresa.id,
                        [sequelize_1.Op.not]: {
                            id: user.id,
                        },
                    },
                    raw: true,
                }),
                users_entity_1.Users.findOne({
                    where: {
                        telephone: usersProfileDto.telephone,
                        empresa_id: empresa.id,
                        id: { [sequelize_1.Op.not]: user.id },
                    },
                    raw: true,
                }),
            ]);
            if (byEmail) {
                throw new express_core_2.BadRequestException(`Ya existe un usuario con el email: ${usersProfileDto.email}`, { body: "email" });
            }
            if (byTelephone) {
                throw new express_core_2.BadRequestException("Ya existe un usuario con este telefono", {
                    body: "telephone",
                });
            }
            yield user.update(usersProfileDto);
            return {
                success: true,
                user,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield this.show(empresa, id);
            const adminSuper = yield users_entity_1.Users.findOne({
                order: [["id", "ASC"]],
                attributes: ["id"],
                where: { empresa_id: empresa.id },
            });
            if (user.id === (adminSuper === null || adminSuper === void 0 ? void 0 : adminSuper.id))
                throw new express_core_2.BadRequestException("No se puede eliminar al administrador");
            yield user.destroy();
            if (user.photo) {
                (0, helpers_1.removeFile)(empresa.slug, user.photo);
            }
            return {
                success: true,
                message: `El usuario con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.UsersApiService = UsersApiService;
exports.UsersApiService = UsersApiService = __decorate([
    (0, express_core_1.Injectable)()
], UsersApiService);
