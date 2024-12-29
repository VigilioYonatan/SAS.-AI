"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const reactions_schema_1 = require("../schemas/reactions.schema");
exports.reactionsUpdateDto = (0, valibot_1.pickAsync)(reactions_schema_1.reactionsSchema, ["isLike"]);
