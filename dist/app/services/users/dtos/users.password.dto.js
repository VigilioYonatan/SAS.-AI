"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersPasswordDto = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.usersPasswordDto = (0, valibot_1.objectAsync)({
    passwordActual: (0, valibot_1.string)("Este campo es obligatorio.", [
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(1, "Este campo es obligatorio."),
        (0, valibot_1.minLength)(6, "Este campo requiere mínimo 6 cáracteres."),
        (0, valibot_1.maxLength)(30, "Este campo requiere máximo 30 cáracteres."),
        (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Deber tener por lo menos una letra."),
        (0, valibot_1.custom)((val) => /\d/.test(val), "Deber tener por lo menos un número."),
    ]),
    newPassword: (0, valibot_1.string)("Este campo es obligatorio.", [
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(1, "Este campo es obligatorio."),
        (0, valibot_1.minLength)(6, "Este campo requiere mínimo 6 cáracteres."),
        (0, valibot_1.maxLength)(30, "Este campo requiere máximo 30 cáracteres."),
        (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Deber tener por lo menos una letra."),
        (0, valibot_1.custom)((val) => /\d/.test(val), "Deber tener por lo menos un número."),
    ]),
    repeatNewPassword: (0, valibot_1.string)("Este campo es obligatorio.", [
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(1, "Este campo es obligatorio."),
        (0, valibot_1.minLength)(6, "Este campo requiere mínimo 6 cáracteres."),
        (0, valibot_1.maxLength)(30, "Este campo requiere máximo 30 cáracteres."),
        (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Deber tener por lo menos una letra."),
        (0, valibot_1.custom)((val) => /\d/.test(val), "Deber tener por lo menos un número."),
    ]),
});
