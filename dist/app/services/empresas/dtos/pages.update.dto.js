"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const pages_schema_1 = require("../schemas/pages.schema");
exports.pagesUpdateDto = (0, valibot_1.omitAsync)(pages_schema_1.pagesSchema, ["id", "empresa_id"]);
