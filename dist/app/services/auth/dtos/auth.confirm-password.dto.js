"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfirmPasswordDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const auth_register_dto_1 = require("./auth.register.dto");
exports.authConfirmPasswordDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.pickAsync)(auth_register_dto_1.authRegisterDto, ["password", "repeat_password"]),
    (0, valibot_1.objectAsync)({
        user_id: (0, valibot_1.numberAsync)("Este campo es obligatorio"),
    }),
], [
    (input) => {
        if (input.repeat_password !== input.password) {
            return (0, valibot_1.getPipeIssues)("repeat_password", "Contraseñas no similares", input);
        }
        return (0, valibot_1.getOutput)(input);
    },
]);
