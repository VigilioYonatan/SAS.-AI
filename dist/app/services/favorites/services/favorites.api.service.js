"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.FavoritesApiService = void 0;
const favorites_entity_1 = require("../entities/favorites.entity");
const products_api_service_1 = require("@/products/services/products.api.service");
const express_core_1 = require("@vigilio/express-core");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const libs_1 = require("@/products/libs");
let FavoritesApiService = class FavoritesApiService {
    constructor(productsApiService) {
        this.productsApiService = productsApiService;
    }
    index(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield favorites_entity_1.Favorites.findAll({
                where: {
                    user_id: user.id,
                    empresa_id: empresa.id,
                },
                include: [
                    {
                        model: products_normal_entity_1.ProductsNormal,
                        attributes: [
                            "images",
                            "id",
                            "slug",
                            "name",
                            "price",
                            "discount",
                        ],
                    },
                    {
                        model: products_restaurant_entity_1.ProductsRestaurant,
                        attributes: [
                            "images",
                            "id",
                            "slug",
                            "name",
                            "price",
                            "discount",
                        ],
                    },
                    {
                        model: products_servicio_entity_1.ProductsServicio,
                        attributes: [
                            "images",
                            "id",
                            "slug",
                            "name",
                            "price",
                            "discount",
                        ],
                    },
                ],
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, user, product_id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = (0, libs_1.productEntityId)(empresa, isService);
            const favorite = yield favorites_entity_1.Favorites.findOne({
                where: {
                    [productId]: product_id,
                    user_id: user.id,
                    empresa_id: empresa.id,
                },
            });
            if (!favorite)
                throw new express_core_1.NotFoundException("No se encontró este favorito");
            return {
                success: true,
                favorite,
            };
        });
    }
    store(empresa, user, product_id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { product } = yield this.productsApiService.show(empresa, product_id, isService, false, null);
            const productId = (0, libs_1.productEntityId)(empresa, isService);
            const react = yield favorites_entity_1.Favorites.findOne({
                where: {
                    [productId]: product.id,
                    user_id: user.id,
                    empresa_id: empresa.id,
                },
            });
            if (react)
                throw new express_core_1.NotFoundException("Ya se elegió como favorito");
            yield favorites_entity_1.Favorites.create({
                [productId]: product.id,
                user_id: user.id,
                empresa_id: empresa.id,
            });
            return {
                success: true,
                message: "Agregaste como favorito a este producto correctamente.",
            };
        });
    }
    destroy(empresa, user, product_id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { favorite } = yield this.show(empresa, user, product_id, isService);
            yield favorite.destroy();
            return {
                success: true,
                message: "Quitaste el favorito a este producto correctamente.",
            };
        });
    }
};
exports.FavoritesApiService = FavoritesApiService;
exports.FavoritesApiService = FavoritesApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [products_api_service_1.ProductsApiService])
], FavoritesApiService);
