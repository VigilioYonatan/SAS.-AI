"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const helpers_1 = require("~/libs/helpers");
exports.couponsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    coupon: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(6), (0, valibot_1.maxLength)(20)]),
    discount: (0, valibot_1.number)([(0, valibot_1.minValue)(0, "Minímo 0%."), (0, valibot_1.maxValue)(100, "Máximo 100%.")]),
    max_use: (0, valibot_1.number)([(0, valibot_1.minValue)(0), (0, valibot_1.maxValue)(100)]),
    date: (0, helpers_1.datetime)(),
    categories: (0, valibot_1.array)((0, valibot_1.number)(), [(0, valibot_1.minLength)(1)]),
    empresa_id: (0, valibot_1.number)(),
});
