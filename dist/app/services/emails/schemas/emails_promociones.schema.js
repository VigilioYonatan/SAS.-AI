"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailsPromocionesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.emailsPromocionesSchema = (0, valibot_1.object)({
    id: (0, valibot_1.number)(),
    email: (0, valibot_1.string)([(0, valibot_1.email)()]),
    empresa_id: (0, valibot_1.number)(),
});
