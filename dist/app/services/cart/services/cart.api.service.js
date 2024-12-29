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
exports.CartApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const cart_entity_1 = require("../entites/cart.entity");
const variants_entity_1 = require("@/products/entities/options/variants.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const libs_1 = require("@/products/libs");
let CartApiService = class CartApiService {
    index(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield cart_entity_1.Cart.findAll({
                where: { user_id: user.id, empresa_id: empresa.id },
                order: [["createdAt", "ASC"]],
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, user_id, product_id, variant_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = (0, libs_1.productEntityId)(empresa, false);
            const cart = yield cart_entity_1.Cart.findOne({
                where: {
                    user_id,
                    [product]: product_id,
                    empresa_id: empresa.id,
                    variant_id: variant_id ? variant_id : null,
                },
                include: [products_normal_entity_1.ProductsNormal, products_restaurant_entity_1.ProductsRestaurant, variants_entity_1.Variants],
            });
            if (!cart) {
                throw new express_core_1.NotFoundException(`No se encontró un cart con ${product_id}`);
            }
            return {
                success: true,
                cart,
            };
        });
    }
    store(empresa, user_id, cartStoreDto, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = (0, libs_1.productEntityId)(empresa, isService);
            const existProductInCart = yield cart_entity_1.Cart.findOne({
                where: {
                    user_id,
                    empresa_id: empresa.id,
                    [productId]: cartStoreDto[productId],
                    variant_id: cartStoreDto.variant_id ? cartStoreDto.variant_id : null,
                },
            });
            if (existProductInCart)
                throw new express_core_1.BadRequestException("Ya existe este producto en el carrito");
            const cart = new cart_entity_1.Cart(Object.assign(Object.assign({}, cartStoreDto), { empresa_id: empresa.id }));
            cart.user_id = user_id;
            yield cart.save();
            return {
                success: true,
                cart,
            };
        });
    }
    update(empresa, userId, cartUpdateDto, product_id, variant_id, isService) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cart } = yield this.show(empresa, userId, product_id, variant_id);
            if (cart.variant) {
                if (cart.variant.stock &&
                    cart.variant.stock > cartUpdateDto.quantity &&
                    cartUpdateDto.quantity < 1)
                    throw new express_core_1.BadRequestException("Hubo un error al modificar este comentario");
            }
            else {
                const productId = (0, libs_1.productEntityId)(empresa, isService);
                if (cart[productId].stock &&
                    cart[productId].stock > cartUpdateDto.quantity &&
                    cartUpdateDto.quantity < 1)
                    throw new express_core_1.BadRequestException("Hubo un error al modificar este comentario");
            }
            yield cart.update(cartUpdateDto);
            return {
                success: true,
                cart,
            };
        });
    }
    destroy(empresa, userId, product_id, variant_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cart } = yield this.show(empresa, userId, product_id, variant_id);
            yield cart.destroy();
            return {
                success: true,
                message: `La cart con el product_id: ${product_id} fue eliminado`,
            };
        });
    }
};
exports.CartApiService = CartApiService;
exports.CartApiService = CartApiService = __decorate([
    (0, express_core_1.Injectable)()
], CartApiService);
