"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.SubCategoriesApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const helpers_1 = require("~/libs/helpers");
const helpers_2 = require("@/uploads/libs/helpers");
const subcategories_entity_1 = require("../entities/subcategories.entity");
const libs_1 = require("../libs");
const helpers_3 = require("@vigilio/express-core/helpers");
let SubCategoriesApiService = class SubCategoriesApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield subcategories_entity_1.Subcategories.findAll({
                where: { empresa_id: empresa.id },
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa_1, slug_1) {
        return __awaiter(this, arguments, void 0, function* (empresa, slug, isView = true) {
            let subcategory = null;
            if (!Number.isNaN(Number(slug))) {
                subcategory = yield subcategories_entity_1.Subcategories.findOne({
                    where: { empresa_id: empresa.id, id: slug },
                });
            }
            else {
                subcategory = yield subcategories_entity_1.Subcategories.findOne({
                    where: {
                        slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!subcategory) {
                if (isView) {
                    throw new express_core_1.Redirect(`/404?message=No se encontró subcategoría ${slug}`);
                }
                throw new express_core_2.NotFoundException(`No se encontró esta subcategoría con ${slug}`);
            }
            return {
                success: true,
                subcategory,
            };
        });
    }
    store(empresa, subCategoriesStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const [existSlug] = yield Promise.all([
                subcategories_entity_1.Subcategories.findOne({
                    where: {
                        slug: subCategoriesStoreDto.slug,
                        empresa_id: empresa.id,
                    },
                }),
            ]);
            const subcategory = new subcategories_entity_1.Subcategories(Object.assign(Object.assign({}, subCategoriesStoreDto), { slug: existSlug
                    ? (0, helpers_3.slug)(subCategoriesStoreDto.slug) +
                        Math.random().toString(32).slice(2, 4)
                    : subCategoriesStoreDto.slug }));
            subcategory.subcategory_code = yield (0, helpers_1.generateCodeEntity)(subcategories_entity_1.Subcategories, "subcategory_code", "SUB", empresa);
            yield subcategory.save();
            return {
                success: true,
                subcategory,
            };
        });
    }
    update(empresa, id, subCategoriesUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subcategory } = yield this.show(empresa, id);
            const [existSlug] = yield Promise.all([
                subcategories_entity_1.Subcategories.findOne({
                    where: {
                        slug: subCategoriesUpdateDto.slug,
                        empresa_id: empresa.id,
                        id: { [sequelize_1.Op.not]: id },
                    },
                }),
            ]);
            const [byName, bySlug] = yield Promise.all([
                subcategories_entity_1.Subcategories.findOne({
                    where: {
                        name: subCategoriesUpdateDto.name,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                        category_id: subCategoriesUpdateDto.category_id,
                    },
                    raw: true,
                }),
                subcategories_entity_1.Subcategories.findOne({
                    where: {
                        slug: subCategoriesUpdateDto.slug,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                        category_id: subCategoriesUpdateDto.category_id,
                    },
                    raw: true,
                }),
            ]);
            if (byName) {
                throw new express_core_2.BadRequestException(`Ya existe esta subcategoría con el nombre: ${subCategoriesUpdateDto.name}.`, { body: "name" });
            }
            if (bySlug) {
                throw new express_core_2.BadRequestException(`Ya existe esta subcategoría con el slug: ${subCategoriesUpdateDto.slug}.`, { body: "slug" });
            }
            yield subcategory.update(Object.assign(Object.assign({}, subCategoriesUpdateDto), { slug: existSlug
                    ? (0, helpers_3.slug)(subCategoriesUpdateDto.slug) +
                        Math.random().toString(32).slice(2, 4)
                    : subCategoriesUpdateDto.slug }));
            return {
                success: true,
                subcategory,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { subcategory } = yield this.show(empresa, id);
            const products = yield subcategory.$get((0, libs_1.ProductKeys)(empresa, false), {
                raw: true,
            });
            if (products.length)
                throw new express_core_2.BadRequestException(`Existe productos en esta subcategoría ${subcategory.subcategory_code} - ${products.length} productos.`);
            if (subcategory.image) {
                (0, helpers_2.removeFile)(empresa.slug, subcategory.image);
            }
            yield subcategory.destroy();
            return {
                success: true,
                message: `Esta subcategoría con el id: ${id} fue eliminado.`,
            };
        });
    }
};
exports.SubCategoriesApiService = SubCategoriesApiService;
exports.SubCategoriesApiService = SubCategoriesApiService = __decorate([
    (0, express_core_1.Injectable)()
], SubCategoriesApiService);
