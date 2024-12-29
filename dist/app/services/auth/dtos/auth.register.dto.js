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
exports.authRegisterDto = void 0;
const users_entity_1 = require("@/users/entities/users.entity");
const users_schema_1 = require("@/users/schemas/users.schema");
const valibot_1 = require("@vigilio/valibot");
exports.authRegisterDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.pickAsync)(users_schema_1.usersSchema, [
        "username",
        "name",
        "telephone",
        "password",
        "empresa_id",
    ]),
    (0, valibot_1.object)({
        repeat_password: (0, valibot_1.string)([
            (0, valibot_1.minLength)(1, "Este campo es obligatorio"),
            (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Deber tener por lo menos una letra."),
            (0, valibot_1.custom)((val) => /\d/.test(val), "Deber tener por lo menos un número."),
        ]),
    }),
], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        if (input.repeat_password !== input.password) {
            return (0, valibot_1.getPipeIssues)("repeat_password", "Contraseñas no similares", input);
        }
        const [byUser_name, byEmail] = yield Promise.all([
            users_entity_1.Users.findOne({
                where: {
                    username: input.username,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            users_entity_1.Users.findOne({
                where: {
                    telephone: input.telephone,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byUser_name) {
            return (0, valibot_1.getPipeIssues)("username", `Ya existe un usuario con el nombre de usuario ${input.username}`, input);
        }
        if (byEmail) {
            return (0, valibot_1.getPipeIssues)("telephone", `Ya existe un usuario con el telefono ${input.telephone}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
