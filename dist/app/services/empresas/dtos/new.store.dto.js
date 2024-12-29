"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const new_schema_1 = require("../schemas/new.schema");
exports.newStoreDto = (0, valibot_1.omitAsync)(new_schema_1.newSchema, ["id", "empresa_id"]);
