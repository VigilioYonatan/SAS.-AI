"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finanzasStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const finanzas_schema_1 = require("../schemas/finanzas.schema");
exports.finanzasStoreDto = (0, valibot_1.omitAsync)(finanzas_schema_1.finanzasSchema, ["id", "empresa_id"]);
