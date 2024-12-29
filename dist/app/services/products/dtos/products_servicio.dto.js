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
exports.productsServicioUpdateDto = exports.productsServicioStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const categories_entity_1 = require("../entities/categories.entity");
const products_servicio_schema_1 = require("../schemas/products_servicio.schema");
const products_servicio_entity_1 = require("../entities/products_servicio.entity");
exports.productsServicioStoreDto = (0, valibot_1.omitAsync)(products_servicio_schema_1.productsServicioSchema, ["id", "product_code"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byName, bySlug, byCategoryId] = yield Promise.all([
            products_servicio_entity_1.ProductsServicio.findOne({
                where: {
                    name: input.name,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            products_servicio_entity_1.ProductsServicio.findOne({
                where: {
                    slug: input.slug,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            categories_entity_1.Categories.findOne({
                where: {
                    id: input.category_id,
                    empresa_id: input.empresa_id,
                },
            }),
        ]);
        if (byName) {
            return (0, valibot_1.getPipeIssues)("name", `Ya existe el producto con el nombre: ${input.name}`, input);
        }
        if (bySlug) {
            return (0, valibot_1.getPipeIssues)("slug", `Ya existe el producto con el slug: ${input.slug}`, input);
        }
        if (!byCategoryId) {
            return (0, valibot_1.getPipeIssues)("category_id", `No existe la categoría ${input.category_id}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
exports.productsServicioUpdateDto = (0, valibot_1.omitAsync)(products_servicio_schema_1.productsServicioSchema, [
    "id",
    "product_code",
    "images",
    "empresa_id",
]);
