"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citasUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const citas_schema_1 = require("../schemas/citas.schema");
exports.citasUpdateDto = (0, valibot_1.omitAsync)(citas_schema_1.citasSchema, ["id", "empresa_id"]);
