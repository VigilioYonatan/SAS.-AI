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
exports.brandsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const brands_schema_1 = require("../schemas/brands.schema");
const brands_entitiy_1 = require("../entities/brands.entitiy");
exports.brandsStoreDto = (0, valibot_1.omitAsync)(brands_schema_1.brandsSchema, ["id", "brand_code"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byName, bySlug] = yield Promise.all([
            brands_entitiy_1.Brands.findOne({
                where: {
                    name: input.name,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            brands_entitiy_1.Brands.findOne({
                where: {
                    slug: input.slug,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            return (0, valibot_1.getPipeIssues)("name", `Ya existe la marca con el name: ${input.name}`, input);
        }
        if (bySlug) {
            return (0, valibot_1.getPipeIssues)("slug", `Ya existe la marca con el slug: ${input.slug}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
