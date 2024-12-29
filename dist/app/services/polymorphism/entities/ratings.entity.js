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
exports.Ratings = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_entity_1 = require("@/users/entities/users.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Ratings = class Ratings extends sequelize_typescript_1.Model {
    get rating() {
        return Number.parseFloat(this.getDataValue("rating"));
    }
};
exports.Ratings = Ratings;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Ratings.prototype, "rating", null);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Ratings.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Ratings.prototype, "ratingsable_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", String)
], Ratings.prototype, "ratingsable_type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Ratings.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users),
    __metadata("design:type", Object)
], Ratings.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_normal_entity_1.ProductsNormal, {
        foreignKey: "ratingsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Ratings.prototype, "product_normal", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_servicio_entity_1.ProductsServicio, {
        foreignKey: "ratingsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Ratings.prototype, "product_servicio", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_restaurant_entity_1.ProductsRestaurant, {
        foreignKey: "ratingsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Ratings.prototype, "product_restaurant", void 0);
exports.Ratings = Ratings = __decorate([
    sequelize_typescript_1.Table
], Ratings);
