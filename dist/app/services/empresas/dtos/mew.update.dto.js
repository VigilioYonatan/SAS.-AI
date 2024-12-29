"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const new_schema_1 = require("../schemas/new.schema");
exports.newUpdateDto = (0, valibot_1.omitAsync)(new_schema_1.newSchema, ["id", "empresa_id", "image"]);
