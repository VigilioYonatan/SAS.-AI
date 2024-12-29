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
exports.BrandsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const helpers_1 = require("~/libs/helpers");
const brands_entitiy_1 = require("../entities/brands.entitiy");
const helpers_2 = require("@/uploads/libs/helpers");
let BrandsApiService = class BrandsApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield brands_entitiy_1.Brands.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let brand = null;
            if (!Number.isNaN(Number(slug))) {
                brand = yield brands_entitiy_1.Brands.findOne({
                    where: { id: slug, empresa_id: empresa.id },
                });
            }
            else {
                brand = yield brands_entitiy_1.Brands.findOne({
                    where: {
                        slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!brand) {
                throw new express_core_2.NotFoundException(`No se encontró un marca con ${slug}`);
            }
            return {
                success: true,
                brand,
            };
        });
    }
    store(empresa, brandsStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const brand = new brands_entitiy_1.Brands(Object.assign(Object.assign({}, brandsStoreDto), { empresa_id: empresa.id }));
            brand.brand_code = yield (0, helpers_1.generateCodeEntity)(brands_entitiy_1.Brands, "brand_code", "BRAND", empresa);
            yield brand.save();
            return {
                success: true,
                brand,
            };
        });
    }
    update(empresa, id, brandsUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { brand } = yield this.show(empresa, id);
            const [byName, bySlug] = yield Promise.all([
                brands_entitiy_1.Brands.findOne({
                    where: {
                        name: brandsUpdateDto.name,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
                brands_entitiy_1.Brands.findOne({
                    where: {
                        slug: brandsUpdateDto.slug,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
            ]);
            if (byName) {
                throw new express_core_2.BadRequestException(`Ya existe la marca con el nombre: ${brandsUpdateDto.name}`, { body: "name" });
            }
            if (bySlug) {
                throw new express_core_2.BadRequestException(`Ya existe la marca con el slug: ${brandsUpdateDto.slug}`, { body: "slug" });
            }
            yield brand.update(brandsUpdateDto);
            return {
                success: true,
                brand,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { brand } = yield this.show(empresa, id);
            const products = yield brand.$get("products", { raw: true });
            if (products.length)
                throw new express_core_2.BadRequestException(`Existe productos en la marca ${brand.brand_code} - ${products.length} productos`);
            yield brand.destroy();
            if (brand.image) {
                (0, helpers_2.removeFile)(empresa.slug, brand.image);
            }
            return {
                success: true,
                message: `La marca con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.BrandsApiService = BrandsApiService;
exports.BrandsApiService = BrandsApiService = __decorate([
    (0, express_core_1.Injectable)()
], BrandsApiService);
