"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlsPaymentSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const valibot_2 = require("valibot");
exports.urlsPaymentSchema = (0, valibot_2.objectAsync)({
    id: (0, valibot_2.number)(),
    url: (0, valibot_2.string)(),
    hash: (0, valibot_2.string)(),
    time: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    empresa_id: (0, valibot_2.number)(),
});
