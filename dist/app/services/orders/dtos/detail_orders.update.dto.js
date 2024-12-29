"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailOrdersUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const detail_orders_schema_1 = require("../schemas/detail_orders.schema");
exports.detailOrdersUpdateDto = (0, valibot_1.omitAsync)(detail_orders_schema_1.detailOrdersSchema, [
    "id",
    "empresa_id",
]);
