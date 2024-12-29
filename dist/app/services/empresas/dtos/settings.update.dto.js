"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const settings_schema_1 = require("../schemas/settings.schema");
exports.settingsUpdateDto = (0, valibot_1.omitAsync)(settings_schema_1.settingsSchema, [
    "id",
    "empresa_id",
    "host",
    "background_auth",
]);
