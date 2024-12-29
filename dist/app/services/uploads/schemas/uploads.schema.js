"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesSchema = filesSchema;
const valibot_1 = require("@vigilio/valibot");
function filesSchema(dimensions) {
    return (0, valibot_1.object)({
        dimension: (0, valibot_1.optional)((0, valibot_1.number)([
            (0, valibot_1.custom)((input) => !!(dimensions === null || dimensions === void 0 ? void 0 : dimensions.includes(input)), "Dimension incorrecta"),
        ])),
        file: (0, valibot_1.string)(),
    });
}
