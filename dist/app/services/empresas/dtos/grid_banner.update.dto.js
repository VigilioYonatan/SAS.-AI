"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridBannerUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const grid_banner_schema_1 = require("../schemas/grid_banner.schema");
exports.gridBannerUpdateDto = (0, valibot_1.omitAsync)(grid_banner_schema_1.gridBannerSchema, [
    "id",
    "empresa_id",
]);
