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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStrategy = localStrategy;
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_entity_1 = require("@/users/entities/users.entity");
const sequelize_1 = require("sequelize");
function localStrategy() {
    return new passport_local_1.Strategy({ usernameField: "telephone", passReqToCallback: true }, (req, telephone, password, done) => __awaiter(this, void 0, void 0, function* () {
        const user = yield users_entity_1.Users.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { telephone: telephone },
                    { email: telephone },
                ],
                empresa_id: req.body.empresa_id,
            },
        });
        if (!user) {
            return done(null, false, {
                message: "Télefono, Correo electrónico o contraseña incorrecta",
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, user.password);
        if (!validPassword) {
            return done(null, false, {
                message: "Télefono, Correo electrónico o contraseña incorrecta",
            });
        }
        if (!user.enabled) {
            return done(null, false, {
                message: "Esta cuenta no está habilitado para ingresar en este momento.",
            });
        }
        return done(null, {
            id: user.id,
            role_id: user.role_id,
        });
    }));
}
