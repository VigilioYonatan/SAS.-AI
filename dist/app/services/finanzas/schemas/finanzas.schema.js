"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finanzasSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.finanzasSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    date: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    presupuesto: (0, valibot_1.number)([(0, valibot_1.minValue)(0)]),
    monto: (0, valibot_1.number)([(0, valibot_1.minValue)(0)]),
    description: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.maxLength)(20)])),
    category_finanza_id: (0, valibot_1.number)(),
    tipo_finanza_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
});
