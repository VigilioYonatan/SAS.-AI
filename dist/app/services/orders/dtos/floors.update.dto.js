"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorsUpdateDto = void 0;
const valibot_1 = require("valibot");
const floors_schema_1 = require("../schemas/floors.schema");
exports.floorsUpdateDto = (0, valibot_1.omitAsync)(floors_schema_1.floorsSchema, ["id", "empresa_id"]);
