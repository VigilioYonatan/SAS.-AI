"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const notes_schema_1 = require("../schemas/notes.schema");
exports.notesStoreDto = (0, valibot_1.omitAsync)(notes_schema_1.notesSchema, ["id"]);
