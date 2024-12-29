"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featuresSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.featuresSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    value: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.maxLength)(45)]),
    description: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.maxLength)(45)]),
    option_id: (0, valibot_1.number)(),
});
