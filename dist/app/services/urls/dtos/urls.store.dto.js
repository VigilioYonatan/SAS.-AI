"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const urls_schema_1 = require("../schemas/urls.schema");
const urls_entity_1 = require("../entities/urls.entity");
exports.urlsStoreDto = (0, valibot_1.omitAsync)(urls_schema_1.urlsSchema, ["id"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byName, byhash] = yield Promise.all([
            urls_entity_1.Urls.findOne({
                where: {
                    web: input.web,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            urls_entity_1.Urls.findOne({
                where: {
                    hash: input.hash,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            return (0, valibot_1.getPipeIssues)("web", `Ya existe un url con el web: ${input.web}`, input);
        }
        if (byhash) {
            return (0, valibot_1.getPipeIssues)("hash", `Ya existe un url con el web: ${input.hash}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
