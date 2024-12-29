"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const suppliers_schema_1 = require("../schemas/suppliers.schema");
exports.suppliersUpdateDto = (0, valibot_1.omitAsync)(suppliers_schema_1.suppliersSchema, [
    "id",
    "supplier_code",
    "logo",
    "razon_social",
    "ruc",
    "empresa_id",
]);
