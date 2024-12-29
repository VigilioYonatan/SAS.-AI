"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgroundStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const background_schema_1 = require("../schemas/background.schema");
exports.backgroundStoreDto = (0, valibot_1.omitAsync)(background_schema_1.backgroundSchema, [
    "id",
    "empresa_id",
]);
