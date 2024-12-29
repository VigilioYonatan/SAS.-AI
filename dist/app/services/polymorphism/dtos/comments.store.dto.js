"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const comments_schema_1 = require("../schemas/comments.schema");
exports.commentsStoreDto = (0, valibot_1.pickAsync)(comments_schema_1.commentsSchema, ["content"]);
