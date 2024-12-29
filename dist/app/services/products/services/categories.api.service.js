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
exports.CategoriesApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const helpers_1 = require("~/libs/helpers");
const categories_entity_1 = require("../entities/categories.entity");
const helpers_2 = require("@/uploads/libs/helpers");
const libs_1 = require("../libs");
let CategoriesApiService = class CategoriesApiService {
    index(empresa, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield categories_entity_1.Categories.findAll({
                where: {
                    empresa_id: empresa.id,
                    isService,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa_1, slug_1) {
        return __awaiter(this, arguments, void 0, function* (empresa, slug, isView = false) {
            let category = null;
            if (!Number.isNaN(Number(slug))) {
                category = yield categories_entity_1.Categories.findOne({
                    where: {
                        id: slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            else {
                category = yield categories_entity_1.Categories.findOne({
                    where: {
                        slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!category) {
                if (!isView) {
                    throw new express_core_2.NotFoundException("No se encontró categoría");
                }
                throw new express_core_1.Redirect("/404?message=Producto No encontrado");
            }
            return {
                success: true,
                category,
            };
        });
    }
    subcategories(empresa, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = yield this.show(empresa, slug, false);
            const data = yield category.$get("subcategories");
            return {
                success: true,
                data,
            };
        });
    }
    store(empresa, categoriesStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = new categories_entity_1.Categories(Object.assign(Object.assign({}, categoriesStoreDto), { empresa_id: empresa.id }));
            category.category_code = yield (0, helpers_1.generateCodeEntity)(categories_entity_1.Categories, "category_code", "CAT", empresa);
            yield category.save();
            return {
                success: true,
                category,
            };
        });
    }
    update(empresa, id, categoriesUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = yield this.show(empresa, id);
            const [byName, bySlug] = yield Promise.all([
                categories_entity_1.Categories.findOne({
                    where: {
                        name: categoriesUpdateDto.name,
                        empresa_id: empresa.id,
                        id: { [sequelize_1.Op.not]: id },
                    },
                    raw: true,
                }),
                categories_entity_1.Categories.findOne({
                    where: {
                        slug: categoriesUpdateDto.slug,
                        empresa_id: empresa.id,
                        id: { [sequelize_1.Op.not]: id },
                    },
                    raw: true,
                }),
            ]);
            if (byName) {
                throw new express_core_2.BadRequestException(`Ya existe la categoría con el nombre: ${categoriesUpdateDto.name}`, { body: "name" });
            }
            if (bySlug) {
                throw new express_core_2.BadRequestException(`Ya existe la categoría con el slug: ${categoriesUpdateDto.slug}`, { body: "slug" });
            }
            yield category.update(categoriesUpdateDto);
            return {
                success: true,
                category,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = yield this.show(empresa, id);
            const [servicios, products] = yield Promise.all([
                category.$get((0, libs_1.ProductKeys)(empresa, true), {
                    raw: true,
                }),
                category.$get((0, libs_1.ProductKeys)(empresa, false), {
                    raw: true,
                }),
            ]);
            if (servicios.length)
                throw new express_core_2.BadRequestException(`Existe servicios en la categoría ${category.category_code} - ${products.length} productos`);
            if (products.length)
                throw new express_core_2.BadRequestException(`Existe productos en la categoría ${category.category_code} - ${products.length} productos`);
            yield category.destroy();
            if (category.image) {
                (0, helpers_2.removeFile)(empresa.slug, category.image);
            }
            if (category.wallpaper) {
                (0, helpers_2.removeFile)(empresa.slug, category.wallpaper);
            }
            return {
                success: true,
                message: `La categoría con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.CategoriesApiService = CategoriesApiService;
exports.CategoriesApiService = CategoriesApiService = __decorate([
    (0, express_core_1.Injectable)()
], CategoriesApiService);
