"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingsSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.ratingsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    rating: (0, valibot_1.number)(),
    user_id: (0, valibot_1.number)(),
    ratingsable_id: (0, valibot_1.number)(),
    ratingsable_type: (0, valibot_1.string)(),
    empresa_id: (0, valibot_1.number)(),
});
