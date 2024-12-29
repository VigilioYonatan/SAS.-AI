"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditCardSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.creditCardSchema = (0, valibot_1.object)({
    cardNumber: (0, valibot_1.string)(),
    expiration: (0, valibot_1.string)([
        (0, valibot_1.custom)((val) => new RegExp(/^(0[1-9]|1[0-2])\/([0-9]{2})$/).test(val), "Fecha no valida."),
    ]),
    cvv2: (0, valibot_1.string)(),
    firstName: (0, valibot_1.string)(),
    lastName: (0, valibot_1.string)(),
    email: (0, valibot_1.string)([(0, valibot_1.email)()]),
});
