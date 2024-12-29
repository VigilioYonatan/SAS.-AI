"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersProfileDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const users_schema_1 = require("../schemas/users.schema");
exports.usersProfileDto = (0, valibot_1.pickAsync)(users_schema_1.usersSchema, [
    "name",
    "address",
    "birthday",
    "lastname",
    "enabledNotification",
    "email",
    "speciality",
    "identification_number",
    "reference",
    "telephone",
]);
