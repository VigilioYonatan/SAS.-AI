"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const questions_schema_1 = require("../schemas/questions.schema");
exports.questionsStoreDto = (0, valibot_1.omitAsync)(questions_schema_1.questionsSchema, [
    "id",
    "empresa_id",
]);
