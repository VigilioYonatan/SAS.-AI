"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const valibot_2 = require("valibot");
exports.urlsSchema = (0, valibot_2.objectAsync)({
    id: (0, valibot_2.number)(),
    web: (0, valibot_2.string)([
        (0, valibot_2.toTrimmed)(),
        (0, valibot_2.minLength)(1),
        (0, valibot_1.startsWith)("http", "Debe empezar con http"),
    ]),
    hash: (0, valibot_2.string)([(0, valibot_2.toTrimmed)(), (0, valibot_2.minLength)(1), (0, valibot_2.minLength)(3), (0, valibot_2.maxLength)(50)]),
    empresa_id: (0, valibot_2.number)(),
    enabled: (0, valibot_1.boolean)(),
});
