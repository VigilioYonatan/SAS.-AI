"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guidesUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const guides_schema_1 = require("../schemas/guides.schema");
exports.guidesUpdateDto = (0, valibot_1.omitAsync)(guides_schema_1.guidesSchema, ["id"]);
