"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.addressSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    city_id: (0, valibot_1.number)(),
    urbanizacion: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1)]),
    direccion: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1)]),
    codLocal: (0, valibot_1.string)([(0, valibot_1.toTrimmed)()]),
    empresa_id: (0, valibot_1.number)(),
});
