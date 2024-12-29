"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresasAddressUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const address_schema_1 = require("../schemas/address.schema");
exports.empresasAddressUpdateDto = (0, valibot_1.omitAsync)(address_schema_1.addressSchema, [
    "id",
    "empresa_id",
]);
