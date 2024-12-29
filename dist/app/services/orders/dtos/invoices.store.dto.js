"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoicesStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const invoices_schema_1 = require("../schemas/invoices.schema");
exports.invoicesStoreDto = (0, valibot_1.omitAsync)(invoices_schema_1.invoicesSchema, ["id"]);
