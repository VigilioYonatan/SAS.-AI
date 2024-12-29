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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_entity_1 = require("@/users/entities/users.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const variants_entity_1 = require("@/products/entities/options/variants.entity");
let Cart = class Cart extends sequelize_typescript_1.Model {
};
exports.Cart = Cart;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Cart.prototype, "quantity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", Object)
], Cart.prototype, "coupon", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Cart.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => products_normal_entity_1.ProductsNormal),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Cart.prototype, "product_normal_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => products_restaurant_entity_1.ProductsRestaurant),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Cart.prototype, "product_restaurant_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_normal_entity_1.ProductsNormal),
    __metadata("design:type", Object)
], Cart.prototype, "product_normal", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_restaurant_entity_1.ProductsRestaurant),
    __metadata("design:type", Object)
], Cart.prototype, "product_restaurant", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Cart.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Cart.prototype, "empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users),
    __metadata("design:type", Object)
], Cart.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => variants_entity_1.Variants),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Cart.prototype, "variant_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => variants_entity_1.Variants, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", Object)
], Cart.prototype, "variant", void 0);
exports.Cart = Cart = __decorate([
    sequelize_typescript_1.Table
], Cart);
