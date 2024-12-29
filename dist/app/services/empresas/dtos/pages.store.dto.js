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
exports.pagesStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const pages_schema_1 = require("../schemas/pages.schema");
const page_entity_1 = require("../entities/page.entity");
exports.pagesStoreDto = (0, valibot_1.omitAsync)(pages_schema_1.pagesSchema, ["id"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byTitle, bySlug] = yield Promise.all([
            page_entity_1.Page.findOne({
                where: {
                    title: input.title,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            page_entity_1.Page.findOne({
                where: {
                    slug: input.slug,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byTitle) {
            return (0, valibot_1.getPipeIssues)("title", `Ya existe la página con el nombre: ${input.title}`, input);
        }
        if (bySlug) {
            return (0, valibot_1.getPipeIssues)("slug", `Ya existe la página con el nombre: ${input.title}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
