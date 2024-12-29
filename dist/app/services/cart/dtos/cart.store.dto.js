"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const cart_schema_1 = require("../schemas/cart.schema");
exports.cartStoreDto = (0, valibot_1.omitAsync)(cart_schema_1.cartSchema, ["user_id"]);
