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
exports.usersStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const users_entity_1 = require("../entities/users.entity");
const users_schema_1 = require("../schemas/users.schema");
exports.usersStoreDto = (0, valibot_1.omitAsync)(users_schema_1.usersSchema, [
    "id",
    "user_code",
    "token",
    "isOnline",
    "photo",
    "subscription",
    "enabledNotification",
    "isBot",
], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byUser_name, byTelephone, byEmail, bySlug] = yield Promise.all([
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
            users_entity_1.Users.findOne({
                where: {
                    email: input.email,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            users_entity_1.Users.findOne({
                where: {
                    slug: input.slug,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byUser_name) {
            return (0, valibot_1.getPipeIssues)("username", `Ya existe un usuario con el username: ${input.username} en tu empresa`, input);
        }
        if (byTelephone) {
            return (0, valibot_1.getPipeIssues)("telephone", `Ya existe un usuario con el telefono: ${input.telephone}`, input);
        }
        if (byEmail) {
            return (0, valibot_1.getPipeIssues)("email", `Ya existe un usuario con el email: ${input.email} en tu empresa`, input);
        }
        if (bySlug) {
            return (0, valibot_1.getPipeIssues)("slug", `Ya existe un usuario con el slug: ${input.slug}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
