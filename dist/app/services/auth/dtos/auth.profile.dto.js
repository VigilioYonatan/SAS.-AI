"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProfileDto = void 0;
const users_schema_1 = require("@/users/schemas/users.schema");
const valibot_1 = require("@vigilio/valibot");
exports.authProfileDto = (0, valibot_1.pickAsync)(users_schema_1.usersSchema, [
    "name",
    "lastname",
    "address",
    "birthday",
    "address",
    "telephone",
    "reference",
    "identification_number",
]);
