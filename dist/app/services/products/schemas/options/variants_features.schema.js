"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantsfeaturesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.variantsfeaturesSchema = (0, valibot_1.objectAsync)({
    variant_id: (0, valibot_1.number)(),
    feature_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
});
