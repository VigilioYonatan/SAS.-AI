"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payMethodsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const pay_methods_schema_1 = require("../schemas/pay_methods.schema");
exports.payMethodsStoreDto = (0, valibot_1.omitAsync)(pay_methods_schema_1.payMethodsSchema, ["id"]);
