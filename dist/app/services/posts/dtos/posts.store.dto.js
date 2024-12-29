"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const posts_schema_1 = require("../schemas/posts.schema");
exports.postsStoreDto = (0, valibot_1.omitAsync)(posts_schema_1.postsSchema, [
    "id",
    "user_id",
    "empresa_id",
    "likes",
]);
