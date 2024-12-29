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
exports.Variants = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const variants_features_entity_1 = require("./variants_features.entity");
const features_entity_1 = require("./features.entity");
const cart_entity_1 = require("@/cart/entites/cart.entity");
const detail_orders_entity_1 = require("@/orders/entities/detail_orders.entity");
const products_normal_entity_1 = require("../products_normal.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Variants = class Variants extends sequelize_typescript_1.Model {
};
exports.Variants = Variants;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", String)
], Variants.prototype, "sku", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Variants.prototype, "stock", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], Variants.prototype, "ilimit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: false }),
    __metadata("design:type", Array)
], Variants.prototype, "images", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => products_normal_entity_1.ProductsNormal),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Variants.prototype, "product_normal_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_normal_entity_1.ProductsNormal),
    __metadata("design:type", Object)
], Variants.prototype, "product_normal", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cart_entity_1.Cart),
    __metadata("design:type", Array)
], Variants.prototype, "carts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => detail_orders_entity_1.DetailOrders, { onDelete: "SET NULL" }),
    __metadata("design:type", Array)
], Variants.prototype, "detailsOrders", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => features_entity_1.Features, () => variants_features_entity_1.VariantsFeatures),
    __metadata("design:type", Array)
], Variants.prototype, "features", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Variants.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Variants.prototype, "empresa", void 0);
exports.Variants = Variants = __decorate([
    sequelize_typescript_1.Table
], Variants);
