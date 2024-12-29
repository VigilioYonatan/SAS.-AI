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
exports.categoriesStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const categories_schema_1 = require("../schemas/categories.schema");
const categories_entity_1 = require("../entities/categories.entity");
exports.categoriesStoreDto = (0, valibot_1.omitAsync)(categories_schema_1.categoriesSchema, ["id", "category_code"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byName, bySlug] = yield Promise.all([
            categories_entity_1.Categories.findOne({
                where: {
                    name: input.name,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            categories_entity_1.Categories.findOne({
                where: {
                    slug: input.slug,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            return (0, valibot_1.getPipeIssues)("name", `Ya existe la categoría con el nombre: ${input.name}`, input);
        }
        if (bySlug) {
            return (0, valibot_1.getPipeIssues)("slug", `Ya existe la categoría con el slug: ${input.slug}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
