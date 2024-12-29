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
exports.ProductsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const helpers_1 = require("~/libs/helpers");
const helpers_2 = require("@/uploads/libs/helpers");
const dayjs_1 = require("~/libs/dayjs");
const libs_1 = require("../libs");
const coupons_entity_1 = require("../entities/coupons.entity");
const products_options_entity_1 = require("../entities/options/products_options.entity");
const variants_features_entity_1 = require("../entities/options/variants_features.entity");
const variants_entity_1 = require("../entities/options/variants.entity");
let ProductsApiService = class ProductsApiService {
    index(empresa, token, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new express_core_2.UnauthorizedException("token is required ?token=");
            if (token !== empresa.token)
                throw new express_core_2.UnauthorizedException("Token no válido");
            const data = yield (0, libs_1.Product)(empresa, isService).findAll();
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa_1, slug_1, isService_1, allProduct_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (empresa, slug, isService, allProduct, user, isView = false) {
            let product = null;
            if (!Number.isNaN(Number(slug))) {
                product = (yield (0, libs_1.Product)(empresa, isService).findOne({
                    where: {
                        id: slug,
                        empresa_id: empresa.id,
                    },
                }));
            }
            else {
                product = (yield (0, libs_1.Product)(empresa, isService).findOne({
                    where: {
                        slug,
                        empresa_id: empresa.id,
                    },
                }));
            }
            if (!product) {
                const message = `No se encontró un producto con ${slug}`;
                if (isView) {
                    throw new express_core_1.Redirect("/404?message=Producto No encontrado");
                }
                throw new express_core_2.NotFoundException(message);
            }
            if (allProduct) {
                product = yield (0, libs_1.getProductAll)(empresa, product, user, true);
            }
            return {
                success: true,
                product,
            };
        });
    }
    coupon(product_id, coupon_code, empresa, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ product }, coupon] = yield Promise.all([
                this.show(empresa, product_id, isService, false, null, false),
                coupons_entity_1.Coupons.findOne({
                    where: {
                        coupon: coupon_code,
                        empresa_id: empresa.id,
                    },
                }),
            ]);
            if (!coupon) {
                throw new express_core_2.BadRequestException("No se encontró cupon.");
            }
            const existCoupon = coupon.categories.some((tech) => tech === product.category_id);
            if (!existCoupon) {
                throw new express_core_2.BadRequestException("Este cupón de descuento no es válido para esta compra");
            }
            if ((0, dayjs_1.restarDays)(empresa, (0, dayjs_1.NOW)(empresa).format(), (0, dayjs_1.TimePeru)(empresa, coupon.date).format()) <= 0)
                throw new express_core_2.BadRequestException("Lastimosamente, Este cupón de descuento ya se ha vencido");
            if (coupon.max_use < 1) {
                throw new express_core_2.BadRequestException("Lastimosamente, Este cupón ya no está disponible por limite de uso.");
            }
            return {
                success: true,
                discount: coupon.discount,
                limit: coupon.max_use,
                coupon,
            };
        });
    }
    store(empresa, productsStoreDto, isNormal, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const Pr = (0, libs_1.Product)(empresa, isService);
            const product = new Pr(Object.assign(Object.assign({}, productsStoreDto), { empresa_id: empresa.id }));
            product.product_code = yield (0, helpers_1.generateCodeEntity)(Pr, "product_code", isService ? "SERV" : "PROD", empresa);
            yield product.save();
            if (isNormal) {
                yield Promise.all(productsStoreDto.options.map((option) => __awaiter(this, void 0, void 0, function* () {
                    yield products_options_entity_1.ProductsOptions.create(Object.assign(Object.assign({}, option), { product_normal_id: product.id, empresa_id: empresa.id }));
                })));
                const combinaciones = (0, libs_1.combinacionesVariants)(productsStoreDto.options.map((opt) => opt.features));
                yield Promise.all(combinaciones.map((combinacion) => __awaiter(this, void 0, void 0, function* () {
                    if (combinacion.length) {
                        const variant = yield product.$create("variant", {
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                            empresa_id: empresa.id,
                        });
                        yield Promise.all(combinacion.map((comb) => __awaiter(this, void 0, void 0, function* () {
                            yield variants_features_entity_1.VariantsFeatures.create({
                                variant_id: variant.id,
                                feature_id: comb,
                                empresa_id: empresa.id,
                            });
                        })));
                    }
                })));
            }
            return {
                success: true,
                product,
            };
        });
    }
    update(empresa, id, productsUpdateDto, isNormal, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product } = yield this.show(empresa, id, isService, true, null, false);
            const [byName, bySlug] = yield Promise.all([
                (0, libs_1.Product)(empresa, isService).findOne({
                    where: {
                        name: productsUpdateDto.name,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
                (0, libs_1.Product)(empresa, isService).findOne({
                    where: {
                        slug: productsUpdateDto.slug,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
            ]);
            if (byName) {
                throw new express_core_2.BadRequestException(`Ya existe el producto con el nombre: ${productsUpdateDto.name}`, { body: "name" });
            }
            if (bySlug) {
                throw new express_core_2.BadRequestException(`Ya existe el producto con el slug: ${productsUpdateDto.slug}`, { body: "slug" });
            }
            yield product.update(Object.assign(Object.assign({}, productsUpdateDto), { empresa_id: empresa.id }));
            if (isNormal) {
                const mapped = product.dataValues.options.map((opt) => {
                    return {
                        option_id: opt.id,
                        features: opt.features.map((feature) => feature.id),
                    };
                });
                if (!(0, libs_1.areArraysEqual)(productsUpdateDto.options, mapped)) {
                    yield Promise.all([
                        products_options_entity_1.ProductsOptions.destroy({
                            where: {
                                product_normal_id: product.id,
                                empresa_id: empresa.id,
                            },
                        }),
                        variants_entity_1.Variants.destroy({
                            where: {
                                product_normal_id: product.id,
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    yield Promise.all(productsUpdateDto.options.map((option) => __awaiter(this, void 0, void 0, function* () {
                        yield products_options_entity_1.ProductsOptions.create(Object.assign({ product_normal_id: product.id, empresa_id: empresa.id }, option));
                    })));
                    const combinaciones = (0, libs_1.combinacionesVariants)(productsUpdateDto.options.map((opt) => opt.features));
                    yield Promise.all(combinaciones.map((combinacion) => __awaiter(this, void 0, void 0, function* () {
                        if (combinacion.length) {
                            const variant = yield product.$create("variant", {
                                sku: null,
                                stock: 0,
                                ilimit: false,
                                images: [],
                                empresa_id: empresa.id,
                            });
                            yield Promise.all(combinacion.map((comb) => __awaiter(this, void 0, void 0, function* () {
                                yield variants_features_entity_1.VariantsFeatures.create({
                                    variant_id: variant.id,
                                    feature_id: comb,
                                    empresa_id: empresa.id,
                                });
                            })));
                        }
                    })));
                }
            }
            return {
                success: true,
                product,
            };
        });
    }
    destroy(empresa, id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product } = yield this.show(empresa, id, isService, false, null, false);
            yield product.destroy();
            if (product.images) {
                (0, helpers_2.removeFile)(empresa.slug, product.images);
            }
            return {
                success: true,
                message: `El producto con el id: ${id} fue eliminado`,
            };
        });
    }
    variant(empresa, product_id, variant_id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product } = yield this.show(empresa, product_id, isService, false, null, false);
            const variant = yield product.$get("variants", {
                where: {
                    id: variant_id,
                },
            });
            return {
                success: true,
                variant: variant[0],
            };
        });
    }
    variantUpdate(empresa, product_id, variant_id, variantsUpdateDto, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { variant } = yield this.variant(empresa, product_id, variant_id, isService);
            if (variantsUpdateDto.sku) {
                const existSku = yield variants_entity_1.Variants.findOne({
                    where: {
                        product_normal_id: product_id,
                        sku: variantsUpdateDto.sku,
                        id: { [sequelize_1.Op.not]: variant.id },
                    },
                });
                if (existSku)
                    throw new express_core_2.BadRequestException("Este sku ya existe", {
                        body: "sku",
                    });
            }
            yield variant.update(variantsUpdateDto);
            return {
                success: true,
                message: "Variante editado correctamente.",
            };
        });
    }
    varianDelete(empresa, product_id, variant_id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { variant } = yield this.variant(empresa, product_id, variant_id, isService);
            yield variant.destroy();
            return {
                success: true,
                message: "Variante Eliminado correctamente.",
            };
        });
    }
};
exports.ProductsApiService = ProductsApiService;
exports.ProductsApiService = ProductsApiService = __decorate([
    (0, express_core_1.Injectable)()
], ProductsApiService);
