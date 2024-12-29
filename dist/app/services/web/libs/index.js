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
exports.getFeatures = getFeatures;
const features_entity_1 = require("@/products/entities/options/features.entity");
const options_entity_1 = require("@/products/entities/options/options.entity");
const products_options_entity_1 = require("@/products/entities/options/products_options.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const sequelize_1 = require("sequelize");
function getFeatures(products, category_id, brand_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
            const opt = yield products_options_entity_1.ProductsOptions.findAll({
                where: {
                    product_normal_id: product.id,
                },
            });
            return opt;
        })));
        const flattened = options.flat();
        const grouped = flattened.reduce((acc, item) => {
            if (!acc[item.option_id]) {
                acc[item.option_id] = {
                    option_id: item.option_id,
                    features: new Set(item.features),
                };
            }
            else {
                for (const feature of item.features) {
                    acc[item.option_id].features.add(feature);
                }
            }
            return acc;
        }, {});
        const where = brand_id
            ? { brand_id: brand_id }
            : { category_id: category_id };
        const optionsFeatures = yield Promise.all(Object.values(grouped).map((item) => __awaiter(this, void 0, void 0, function* () {
            const option = yield options_entity_1.Options.findByPk(item.option_id);
            const features = yield Promise.all([...item.features].map((feature) => __awaiter(this, void 0, void 0, function* () {
                const featur = yield features_entity_1.Features.findByPk(feature);
                const quantity = yield products_options_entity_1.ProductsOptions.count({
                    where: {
                        option_id: item.option_id,
                        features: {
                            [sequelize_1.Op.contains]: [feature],
                        },
                    },
                    include: [
                        {
                            model: products_normal_entity_1.ProductsNormal,
                            where,
                            required: true,
                        },
                    ],
                });
                return Object.assign(Object.assign({}, featur === null || featur === void 0 ? void 0 : featur.toJSON()), { quantity });
            })));
            return Object.assign(Object.assign({}, option === null || option === void 0 ? void 0 : option.toJSON()), { features });
        })));
        return optionsFeatures;
    });
}
