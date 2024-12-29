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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsImageQualities = exports.categoriesWallpaperQualities = exports.categoriesImageQualities = exports.productsImagesQualities = void 0;
exports.Product = Product;
exports.ProductKeys = ProductKeys;
exports.productEntityId = productEntityId;
exports.combinacionesVariants = combinacionesVariants;
exports.getProductAll = getProductAll;
exports.printImagesProduct = printImagesProduct;
exports.areArraysEqual = areArraysEqual;
exports.arrayNoRepeat = arrayNoRepeat;
exports.printProductVariant = printProductVariant;
exports.printVariantFeatures = printVariantFeatures;
const helpers_1 = require("@/uploads/libs/helpers");
const detail_orders_entity_1 = require("@/orders/entities/detail_orders.entity");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const libs_1 = require("@/orders/libs");
const products_normal_entity_1 = require("../entities/products_normal.entity");
const products_restaurant_entity_1 = require("../entities/products_restaurant.entity");
const products_servicio_entity_1 = require("../entities/products_servicio.entity");
const libs_2 = require("@/empresas/libs");
const features_entity_1 = require("../entities/options/features.entity");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const helpers_2 = require("~/libs/helpers");
exports.productsImagesQualities = [100, 500];
exports.categoriesImageQualities = [100, 800];
exports.categoriesWallpaperQualities = [100, 1200];
exports.brandsImageQualities = [100, 500];
function Product(empresa, isService) {
    const pr = {
        1: products_normal_entity_1.ProductsNormal,
        2: products_restaurant_entity_1.ProductsRestaurant,
        3: isService ? products_servicio_entity_1.ProductsServicio : products_normal_entity_1.ProductsNormal,
    };
    return pr[empresa.tipo_empresa.tipo_servicio_id];
}
function ProductKeys(empresa, isService) {
    const pr = {
        1: "ProductsNormals",
        2: "ProductsRestaurants",
        3: isService ? "ProductsServicios" : "ProductsNormals",
    };
    return pr[empresa.tipo_empresa.tipo_servicio_id];
}
function productEntityId(empresa, isService) {
    const pr = {
        1: "product_normal_id",
        2: "product_restaurant_id",
        3: isService ? "product_servicio_id" : "product_normal_id",
    };
    return pr[empresa.tipo_empresa.tipo_servicio_id];
}
function combinacionesVariants(arrays, indice = 0, combinacion = []) {
    if (indice === arrays.length)
        return [combinacion];
    let resultado = [];
    for (const item of arrays[indice]) {
        const combinacionTemp = [...combinacion];
        combinacionTemp.push(item);
        resultado = resultado.concat(combinacionesVariants(arrays, indice + 1, combinacionTemp));
    }
    return resultado;
}
function getProductAll(empresa, product, user, isNecesaryAllDescription) {
    return __awaiter(this, void 0, void 0, function* () {
        const [ratings] = yield Promise.all([
            ratings_entity_1.Ratings.findAll({
                where: {
                    ratingsable_id: product.id,
                    ratingsable_type: ProductKeys(empresa, product instanceof products_servicio_entity_1.ProductsServicio),
                },
            }),
        ]);
        if (product instanceof products_normal_entity_1.ProductsNormal) {
            const [options, variants] = yield Promise.all([
                product.$get("options"),
                product.$get("variants", {
                    order: [["id", "ASC"]],
                    include: [features_entity_1.Features],
                }),
            ]);
            product.dataValues.options = yield Promise.all(options.map((opt) => __awaiter(this, void 0, void 0, function* () {
                const _a = opt.toJSON(), { ProductsOptions } = _a, rest = __rest(_a, ["ProductsOptions"]);
                const features = yield Promise.all(opt.ProductsOptions.features.map((feat) => __awaiter(this, void 0, void 0, function* () {
                    const feature = yield features_entity_1.Features.findByPk(feat);
                    return feature;
                })));
                return Object.assign(Object.assign({}, rest), { features });
            })));
            product.dataValues.variants = yield Promise.all(variants.map((variant) => __awaiter(this, void 0, void 0, function* () {
                const totalSold = yield detail_orders_entity_1.DetailOrders.count({
                    where: {
                        product_normal_id: product.id,
                        variant_id: variant.id,
                    },
                    include: [
                        {
                            model: orders_entity_1.Orders,
                            where: {
                                status_order_id: libs_1.STATUSORDER.entregado,
                            },
                            required: true,
                        },
                    ],
                });
                return Object.assign(Object.assign({}, variant.toJSON()), { totalSold });
            })));
        }
        else {
            const product_id = product instanceof products_normal_entity_1.ProductsNormal
                ? "product_normal_id"
                : product instanceof products_servicio_entity_1.ProductsServicio
                    ? "product_servicio_id"
                    : "product_restaurant_id";
            const [totalSold] = yield Promise.all([
                detail_orders_entity_1.DetailOrders.count({
                    where: {
                        [product_id]: product.id,
                        empresa_id: empresa.id,
                    },
                    include: [
                        {
                            model: orders_entity_1.Orders,
                            where: {
                                status_order_id: libs_1.STATUSORDER.entregado,
                            },
                            required: true,
                        },
                    ],
                }),
            ]);
            product.dataValues.totalSold = totalSold;
        }
        if (user) {
            const product_id = product instanceof products_normal_entity_1.ProductsNormal
                ? "product_normal_id"
                : product instanceof products_servicio_entity_1.ProductsServicio
                    ? "product_servicio_id"
                    : "product_restaurant_id";
            const [favorites, rating] = yield Promise.all([
                favorites_entity_1.Favorites.findOne({
                    where: {
                        [product_id]: product.id,
                        user_id: user.id,
                        empresa_id: empresa.id,
                    },
                }),
                ratings_entity_1.Ratings.findOne({
                    where: {
                        ratingsable_id: product.id,
                        user_id: user.id,
                        ratingsable_type: [
                            ProductKeys(empresa, product instanceof products_servicio_entity_1.ProductsServicio),
                        ],
                        empresa_id: empresa.id,
                    },
                }),
            ]);
            product.dataValues.user = {
                isFavorite: !!favorites,
                rating: rating === null || rating === void 0 ? void 0 : rating.rating,
            };
        }
        const starsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalSum = 0;
        for (const rating of ratings) {
            const roundedRating = Math.floor(rating.rating);
            starsCount[roundedRating] = (starsCount[roundedRating] || 0) + 1;
            totalSum += rating.rating;
        }
        const stars5 = ratings.filter((rate) => rate.rating >= 5).length;
        const stars4 = ratings.filter((rate) => rate.rating > 4 && rate.rating < 5).length;
        const stars3 = ratings.filter((rate) => rate.rating > 3 && rate.rating < 4).length;
        const stars2 = ratings.filter((rate) => rate.rating > 2 && rate.rating < 3).length;
        const stars1 = ratings.filter((rate) => rate.rating > 1 && rate.rating < 2).length;
        const rated = {
            quantity: ratings.length,
            promedio: totalSum / ratings.length,
            ratings: Object.keys(starsCount)
                .map((star) => ({
                rating: Number.parseInt(star),
                percentage: ratings.length > 0
                    ? (starsCount[Number.parseInt(star)] / ratings.length) *
                        100
                    : 0,
                length: ratings.filter((rate) => rate.rating >= Number.parseInt(star) &&
                    rate.rating < Number.parseInt(star) + 1).length,
            }))
                .toReversed(),
            stars5,
            stars4,
            stars3,
            stars2,
            stars1,
        };
        product.dataValues.rating = rated;
        if (!isNecesaryAllDescription) {
            const desc = (0, helpers_2.removeTextHTML)(product.dataValues.description);
            product.dataValues.description = desc ? desc.slice(0, 600) : null;
        }
        return product;
    });
}
function printImagesProduct(empresa) {
    return (images, quality = 500) => {
        if (images) {
            return (0, helpers_1.printFileWithDimension)(empresa)(images, quality);
        }
        return [`${(0, libs_2.BASE_URL)(empresa)}/images/settings/others/no-profile.webp`];
    };
}
function areArraysEqual(obj1, obj2) {
    if (obj1.length !== obj2.length) {
        return false;
    }
    const set1 = new Set(obj1.map((item) => JSON.stringify(item)));
    const set2 = new Set(obj2.map((item) => JSON.stringify(item)));
    for (const item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }
    return true;
}
function arrayNoRepeat(_a) {
    return __awaiter(this, arguments, void 0, function* ({ array1, array2, onDelete, onCreate, }) {
        const array1Set = new Set(array1);
        const array2Set = new Set(array2);
        if (array1Set.size === array2Set.size &&
            [...array1Set].every((id) => array2Set.has(id))) {
        }
        else if (array1Set.size > array2Set.size) {
            const deleteIds = [...array1Set].filter((id) => !array2Set.has(id));
            if (onDelete) {
                yield onDelete(deleteIds);
            }
        }
        else {
            const addedIds = [...array2Set].filter((id) => !array1Set.has(id));
            if (onCreate) {
                yield onCreate(addedIds);
            }
        }
    });
}
function printProductVariant(product, variant) {
    const result = variant.features.map((option) => {
        const opt = product.dataValues.options.find((opt) => opt.id === option.option_id);
        if (opt) {
            const detailedFeatures = opt.features
                .map((featureId) => variant.features.find((feature) => feature.id === featureId.id)
                ? featureId
                : null)
                .filter((opt) => opt !== null);
            return Object.assign(Object.assign({}, opt), { features: detailedFeatures });
        }
        return null;
    });
    return result;
}
function printVariantFeatures(product, variant, spacing = " ") {
    return printProductVariant(product, variant)
        .map((variant) => {
        return variant === null || variant === void 0 ? void 0 : variant.features.map((feature) => feature === null || feature === void 0 ? void 0 : feature.description);
    })
        .join(spacing);
}
