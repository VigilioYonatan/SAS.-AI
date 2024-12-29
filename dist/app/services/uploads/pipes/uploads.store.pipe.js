"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsStorePipe = void 0;
const valibot_1 = require("@vigilio/valibot");
const helpers_1 = require("../libs/helpers");
exports.uploadsStorePipe = (0, valibot_1.objectAsync)({
    entity: (0, valibot_1.string)("Este campo es obligatorio", [
        (0, valibot_1.custom)((input) => helpers_1.uploadsEntities.includes(input)),
    ]),
    property: (0, valibot_1.string)("Este campo es obligatorio", [
        (0, valibot_1.custom)((input) => helpers_1.uploadsProperties.includes(input)),
    ]),
});
