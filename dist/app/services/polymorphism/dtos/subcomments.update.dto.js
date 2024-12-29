"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcommentsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const subcomments_schema_1 = require("../schemas/subcomments.schema");
exports.subcommentsUpdateDto = (0, valibot_1.pickAsync)(subcomments_schema_1.subcommentsSchema, ["content"]);
