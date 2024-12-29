"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mesasSchema = void 0;
const valibot_1 = require("valibot");
exports.mesasSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    mesa_code: (0, valibot_1.string)(),
    floor_id: (0, valibot_1.number)("Este campo es obligatorio."),
    empresa_id: (0, valibot_1.number)(),
});
