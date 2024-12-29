"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesFinanzasStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const tipo_schema_1 = require("../schemas/tipo.schema");
exports.categoriesFinanzasStoreDto = (0, valibot_1.omitAsync)(tipo_schema_1.categoryFinanzasSchema, [
    "id",
    "empresa_id",
]);
