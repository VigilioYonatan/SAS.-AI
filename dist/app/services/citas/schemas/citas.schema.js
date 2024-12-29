"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citasSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const valibot_2 = require("@vigilio/valibot");
exports.citasSchema = (0, valibot_2.objectAsync)({
    id: (0, valibot_2.number)(),
    telephone: (0, valibot_2.string)([
        (0, valibot_2.minLength)(1),
        (0, valibot_2.maxLength)(30),
        (0, valibot_2.custom)((value) => /^\d+$/.test(value), "Este campo solo permite números."),
    ]),
    hour: (0, valibot_2.string)(),
    date: (0, valibot_2.coerce)((0, valibot_1.date)(), (val) => new Date(val)),
    description: (0, valibot_1.nullable)((0, valibot_2.string)([(0, valibot_2.minLength)(3), (0, valibot_2.maxLength)(200)])),
    answers: (0, valibot_1.record)((0, valibot_2.string)(), (0, valibot_2.string)([(0, valibot_2.minLength)(2), (0, valibot_2.maxLength)(300)])),
    empresa_id: (0, valibot_2.number)(),
});
