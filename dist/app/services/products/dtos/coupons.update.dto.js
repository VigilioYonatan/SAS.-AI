"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const coupons_schema_1 = require("../schemas/coupons.schema");
exports.couponsUpdateDto = (0, valibot_1.omitAsync)(coupons_schema_1.couponsSchema, ["id", "empresa_id"]);
