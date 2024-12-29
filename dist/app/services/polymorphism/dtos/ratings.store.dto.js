"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const ratings_schema_1 = require("../schemas/ratings.schema");
exports.ratingsStoreDto = (0, valibot_1.pickAsync)(ratings_schema_1.ratingsSchema, ["rating"]);
