"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authForgotPasswordDto = void 0;
const users_schema_1 = require("@/users/schemas/users.schema");
const valibot_1 = require("@vigilio/valibot");
exports.authForgotPasswordDto = (0, valibot_1.pickAsync)(users_schema_1.usersSchema, ["telephone"]);
