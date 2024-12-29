"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusOrdersUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const status_orders_schema_1 = require("../schemas/status_orders.schema");
exports.statusOrdersUpdateDto = (0, valibot_1.omitAsync)(status_orders_schema_1.statusOrdersSchema, ["id"]);
