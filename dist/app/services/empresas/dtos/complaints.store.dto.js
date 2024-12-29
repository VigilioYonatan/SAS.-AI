"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintsStoreDto = void 0;
const valibot_1 = require("valibot");
const complaints_schema_1 = require("../schemas/complaints.schema");
exports.complaintsStoreDto = (0, valibot_1.omitAsync)(complaints_schema_1.complaintsSchema, [
    "id",
    "empresa_id",
]);
