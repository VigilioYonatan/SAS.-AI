"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const users_schema_1 = require("../schemas/users.schema");
exports.usersUpdateDto = (0, valibot_1.pickAsync)(users_schema_1.usersSchema, [
    "role_id",
    "enabled",
    "speciality",
    "isBot",
]);
