"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const urls_schema_1 = require("../schemas/urls.schema");
exports.urlsUpdateDto = (0, valibot_1.omitAsync)(urls_schema_1.urlsSchema, ["id", "empresa_id"]);
