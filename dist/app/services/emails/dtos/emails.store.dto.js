"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const emails_schema_1 = require("../schemas/emails.schema");
exports.emailsStoreDto = (0, valibot_1.omitAsync)(emails_schema_1.emailsSchema, ["id", "empresa_id"]);
